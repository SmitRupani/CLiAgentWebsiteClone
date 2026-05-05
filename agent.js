import "dotenv/config";
import { OpenAI } from "openai";
import readline from "readline";

import { colors, colorLog, printBanner } from "./ui.js";
import { executeTool } from "./tools.js";
import { SYSTEM_PROMPT } from "./prompt.js";

// ── OpenRouter Client ──────────────────────────────────────────────
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const MODEL = "google/gemini-2.0-flash-001";

// ── Parse AI Response ──────────────────────────────────────────────

/**
 * Extracts code block content from raw text.
 * Handles: ```css ... ```, ```html ... ```, ```javascript ... ```, ``` ... ```
 */
function extractCodeBlock(rawText) {
  // Find ALL code blocks and return the largest one (most likely the file content)
  const codeBlocks = [];
  const regex = /```[\w]*\s*([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(rawText)) !== null) {
    const content = match[1].trim();
    if (content.length > 0) {
      codeBlocks.push(content);
    }
  }
  if (codeBlocks.length === 0) return null;
  // Return the longest code block (most likely the actual file content)
  return codeBlocks.reduce((a, b) => (a.length >= b.length ? a : b));
}

/**
 * Ensures a parsed createFile TOOL call has content.
 * If content is missing, tries to extract it from code blocks in the raw text.
 */
function ensureFileContent(parsed, rawText) {
  if (
    parsed &&
    parsed.tool_name === "createFile" &&
    parsed.tool_args &&
    (!parsed.tool_args.content || parsed.tool_args.content.trim() === "")
  ) {
    const extracted = extractCodeBlock(rawText);
    if (extracted) {
      parsed.tool_args.content = extracted;
    }
  }
  return parsed;
}

/**
 * Robust parser that handles multiple formats the model might produce:
 * 1. Clean JSON
 * 2. JSON wrapped in markdown code fences
 * 3. JSON with extra text before/after
 * 4. JSON with file content as a code block after it (special createFile handling)
 * 5. Broken JSON with file content embeded — fallback to code block extraction
 */
function parseAIResponse(rawContent) {
  if (!rawContent || rawContent.trim() === "") {
    return null;
  }

  const rawText = rawContent; // Keep original for code block extraction
  let text = rawContent.trim();

  // Strategy 1: Check for a "split format" where JSON is followed by a code block
  // e.g.: {"step":"TOOL","tool_name":"createFile","tool_args":{"filename":"style.css"}} ```css ... ```
  const splitPattern = /(\{[\s\S]*?\})\s*```[\w]*\s*([\s\S]*?)```/;
  const splitMatch = text.match(splitPattern);
  if (splitMatch) {
    try {
      const jsonPart = JSON.parse(splitMatch[1]);
      const codeContent = splitMatch[2].trim();
      if (jsonPart.tool_name === "createFile" && codeContent) {
        if (!jsonPart.tool_args) jsonPart.tool_args = {};
        jsonPart.tool_args.content = codeContent;
      }
      return jsonPart;
    } catch {
      // Fall through
    }
  }

  // Strategy 2: Remove markdown code fences wrapping JSON
  const jsonCodeBlock = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (jsonCodeBlock) {
    try {
      const parsed = JSON.parse(jsonCodeBlock[1]);
      return ensureFileContent(parsed, rawText);
    } catch {
      // Fall through
    }
  }

  // Strategy 3: Direct JSON parse
  try {
    const parsed = JSON.parse(text);
    return ensureFileContent(parsed, rawText);
  } catch {
    // Continue
  }

  // Strategy 4: Extract first complete JSON object using brace matching
  const firstBrace = text.indexOf("{");
  if (firstBrace !== -1) {
    let depth = 0;
    let inString = false;
    let escape = false;

    for (let i = firstBrace; i < text.length; i++) {
      const ch = text[i];
      if (escape) { escape = false; continue; }
      if (ch === "\\") { escape = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          const candidate = text.substring(firstBrace, i + 1);
          try {
            const parsed = JSON.parse(candidate);
            return ensureFileContent(parsed, rawText);
          } catch {
            // Try the NEXT closing brace
            continue;
          }
        }
      }
    }
  }

  // Strategy 5: Last resort — try to find any parseable JSON-like structure
  // and extract code blocks for content
  const toolNameMatch = text.match(/"tool_name"\s*:\s*"(createFile)"/);
  const filenameMatch = text.match(/"filename"\s*:\s*"([^"]+)"/);
  if (toolNameMatch && filenameMatch) {
    const codeContent = extractCodeBlock(rawText);
    if (codeContent) {
      return {
        step: "TOOL",
        content: `Creating ${filenameMatch[1]}`,
        tool_name: "createFile",
        tool_args: {
          filename: filenameMatch[1],
          content: codeContent,
        },
      };
    }
  }

  // Strategy 6: Greedy regex match (last resort for non-createFile)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      // Give up
    }
  }

  return null;
}

// ── Agent Loop ─────────────────────────────────────────────────────

async function runAgent(userMessage, messages) {
  messages.push({
    role: "user",
    content: userMessage,
  });

  console.log(
    `\n${colors.bgBlue}${colors.white}${colors.bold} 🤖 AGENT STARTED ${colors.reset}\n`
  );

  let iterations = 0;
  const MAX_ITERATIONS = 40;
  let consecutiveErrors = 0;
  const MAX_CONSECUTIVE_ERRORS = 5;

  while (iterations < MAX_ITERATIONS) {
    iterations++;

    try {
      const response = await client.chat.completions.create({
        model: MODEL,
        messages: messages,
        temperature: 0.2,
        max_tokens: 10000,
      });

      const rawContent = response.choices[0].message.content;
      const parsedContent = parseAIResponse(rawContent);

      if (!parsedContent) {
        consecutiveErrors++;
        colorLog(colors.dim, "WAITING", `Retrying... (${consecutiveErrors}/${MAX_CONSECUTIVE_ERRORS})`);
        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          colorLog(colors.red, "ABORT", "Too many consecutive parse errors. Stopping.");
          break;
        }
        messages.push({ role: "assistant", content: rawContent || "" });
        messages.push({
          role: "user",
          content: 'Your response was not valid. Respond with a single JSON object. Example: {"step":"THINK","content":"my reasoning"} or {"step":"TOOL","content":"desc","tool_name":"screenshotWebsite","tool_args":{"url":"https://example.com"}}',
        });
        continue;
      }

      consecutiveErrors = 0;

      // Store the raw assistant message for conversation context
      messages.push({
        role: "assistant",
        content: rawContent,
      });

      // Handle step types
      const step = (parsedContent.step || "").toUpperCase();

      if (step === "START") {
        colorLog(colors.cyan, "START", parsedContent.content);
        console.log();
      } else if (step === "THINK") {
        colorLog(colors.yellow, "THINK", parsedContent.content);
        console.log();
      } else if (step === "TOOL") {
        const toolName = parsedContent.tool_name;
        const toolArgs = parsedContent.tool_args;

        if (!toolName) {
          colorLog(colors.red, "ERROR", "Tool step missing tool_name.");
          messages.push({
            role: "user",
            content: 'Error: TOOL step needs tool_name. Example: {"step":"TOOL","content":"desc","tool_name":"screenshotWebsite","tool_args":{"url":"https://example.com"}}',
          });
          continue;
        }

        colorLog(colors.magenta, "TOOL", `Calling ${toolName}...`);

        try {
          const { result, image } = await executeTool(toolName, toolArgs);
          colorLog(colors.green, "RESULT", result);
          console.log();

          if (image) {
            // Enhanced feedback for screenshots with detailed analysis guidance
            const enhancedFeedback = toolName === "screenshotWebsite" 
              ? `OBSERVE: ${result}\n\nCRITICAL ANALYSIS REQUIRED:\n- Extract EXACT hex color codes (#RRGGBB) for: header bg, header text, hero bg, hero text, buttons, footer bg, footer text\n- Measure spacing: header padding, hero padding, section margins\n- Identify fonts: what typeface for headings vs body?\n- Layout: is header fixed/sticky? hero full-width? footer multi-column?\n- Colors: any gradients? shadows? borders?\nProvide detailed observations before building CSS.`
              : toolName === "screenshotOwnOutput"
              ? `OBSERVE: ${result}\n\nCOMPARISON CHECK:\nCompare this output screenshot pixel-by-pixel with the original:\n✓ Do header colors match exactly?\n✓ Do text colors match?\n✓ Is spacing/padding identical?\n✓ Are button styles the same?\n✓ Does footer layout match?\n✓ Any colors off? Any spacing wrong?\n\nIf ANY differences found, list them specifically and fix the CSS. Do up to 2 more iterations if needed.`
              : `OBSERVE: ${result}`;
            
            messages.push({
              role: "user",
              content: [
                {
                  type: "text",
                  text: enhancedFeedback,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/png;base64,${image}`,
                  },
                },
              ],
            });
          } else {
            messages.push({
              role: "user",
              content: `OBSERVE: ${result}`,
            });
          }
        } catch (toolErr) {
          colorLog(colors.red, "TOOL ERROR", toolErr.message);
          messages.push({
            role: "user",
            content: `OBSERVE ERROR: ${toolErr.message}`,
          });
        }
      } else if (step === "OUTPUT") {
        console.log(
          `\n${colors.bgGreen}${colors.white}${colors.bold} ✅ DONE ${colors.reset}`
        );
        console.log(
          `${colors.green}${parsedContent.content}${colors.reset}\n`
        );
        break;
      } else {
        colorLog(
          colors.dim,
          step || "INFO",
          parsedContent.content || JSON.stringify(parsedContent)
        );
        console.log();
      }
    } catch (apiErr) {
      colorLog(colors.red, "API ERROR", apiErr.message);
      consecutiveErrors++;
      if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
        colorLog(
          colors.red,
          "ABORT",
          "Too many API errors. Please check your API key and try again."
        );
        break;
      }
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  if (iterations >= MAX_ITERATIONS) {
    colorLog(
      colors.red,
      "WARN",
      "Reached maximum iterations. Stopping agent loop."
    );
  }

  return messages;
}

// ── Interactive CLI ────────────────────────────────────────────────

async function main() {
  printBanner();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let messages = [{ role: "system", content: SYSTEM_PROMPT }];

  const askQuestion = () => {
    rl.question(
      `${colors.bold}${colors.blue}You ▶ ${colors.reset}`,
      async (input) => {
        const trimmed = input.trim();

        if (!trimmed) {
          askQuestion();
          return;
        }

        if (
          trimmed.toLowerCase() === "exit" ||
          trimmed.toLowerCase() === "quit"
        ) {
          console.log(
            `\n${colors.cyan}Goodbye! Check the ${colors.bold}output/${colors.reset}${colors.cyan} folder for generated files.${colors.reset}\n`
          );
          rl.close();
          process.exit(0);
        }

        messages = await runAgent(trimmed, messages);
        askQuestion();
      }
    );
  };

  askQuestion();
}

main();


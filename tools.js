import fs from "fs";
import path from "path";
import { exec } from "child_process";
import puppeteer from "puppeteer";

// ── Output Directory ───────────────────────────────────────────────
export const OUTPUT_DIR = path.resolve("./output");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ── Tool Functions ─────────────────────────────────────────────────

/**
 * Creates (or overwrites) a file inside the output/ directory.
 */
function createFile(filename, content) {
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, content, "utf-8");
  return `File "${filename}" created successfully at ${filePath} (${content.length} bytes)`;
}

/**
 * Reads a file from the output/ directory.
 */
function readFile(filename) {
  const filePath = path.join(OUTPUT_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return `Error: File "${filename}" does not exist in the output directory.`;
  }
  return fs.readFileSync(filePath, "utf-8");
}

/**
 * Opens a file from output/ in the default system browser.
 */
function openInBrowser(filename) {
  const filePath = path.join(OUTPUT_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return `Error: File "${filename}" does not exist.`;
  }
  const platform = process.platform;
  let cmd;
  if (platform === "darwin") cmd = `open "${filePath}"`;
  else if (platform === "win32") cmd = `start "" "${filePath}"`;
  else cmd = `xdg-open "${filePath}"`;

  exec(cmd, (err) => {
    if (err) console.error(`Failed to open browser: ${err.message}`);
  });

  return `Opened "${filename}" in the default browser.`;
}

/**
 * Takes a screenshot of a website URL using Puppeteer.
 * Returns viewport-only screenshot (not full-page) to keep image size manageable.
 */
async function screenshotWebsite(url) {
  // Ensure URL has protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  const screenshotPath = path.join(OUTPUT_DIR, "screenshot.png");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Wait for animations/lazy content to load
    await new Promise((r) => setTimeout(r, 3000));

    // Take viewport-only screenshot (not full-page to keep size reasonable)
    await page.screenshot({ path: screenshotPath, fullPage: false });

    // Read as base64
    const imageBuffer = fs.readFileSync(screenshotPath);
    const base64Image = imageBuffer.toString("base64");

    return {
      success: true,
      message: `Screenshot of ${url} captured successfully (${imageBuffer.length} bytes). The screenshot image is attached — analyze it carefully to extract exact colors, layout, typography, and structure.`,
      base64: base64Image,
    };
  } catch (err) {
    return {
      success: false,
      message: `Failed to capture screenshot of ${url}: ${err.message}`,
      base64: null,
    };
  } finally {
    await browser.close();
  }
}

/**
 * Takes a screenshot of the agent's own generated index.html for self-review.
 */
async function screenshotOwnOutput() {
  const indexPath = path.join(OUTPUT_DIR, "index.html");
  if (!fs.existsSync(indexPath)) {
    return {
      success: false,
      message: "Error: index.html does not exist yet. Create it first.",
      base64: null,
    };
  }

  const screenshotPath = path.join(OUTPUT_DIR, "output-screenshot.png");
  const fileUrl = `file://${indexPath}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(fileUrl, { waitUntil: "networkidle2", timeout: 15000 });

    await new Promise((r) => setTimeout(r, 1000));

    // Viewport-only screenshot for comparison
    await page.screenshot({ path: screenshotPath, fullPage: false });

    const imageBuffer = fs.readFileSync(screenshotPath);
    const base64Image = imageBuffer.toString("base64");

    return {
      success: true,
      message: `Screenshot of your generated output captured. Compare this against the original website screenshot and identify differences in colors, layout, spacing, fonts, and structure.`,
      base64: base64Image,
    };
  } catch (err) {
    return {
      success: false,
      message: `Failed to screenshot own output: ${err.message}`,
      base64: null,
    };
  } finally {
    await browser.close();
  }
}

// ── Tool Dispatcher ────────────────────────────────────────────────

/**
 * Dispatches a tool call by name, parsing args if needed.
 * Returns { result: string, image?: string } where image is optional base64.
 */
export async function executeTool(toolName, toolArgs) {
  let args;
  if (typeof toolArgs === "string") {
    try {
      args = JSON.parse(toolArgs);
    } catch {
      args = { filename: toolArgs, url: toolArgs };
    }
  } else {
    args = toolArgs || {};
  }

  switch (toolName) {
    case "createFile":
      return { result: createFile(args.filename, args.content) };
    case "readFile":
      return { result: readFile(args.filename) };
    case "openInBrowser":
      return { result: openInBrowser(args.filename) };
    case "screenshotWebsite": {
      const data = await screenshotWebsite(args.url);
      return { result: data.message, image: data.base64 };
    }
    case "screenshotOwnOutput": {
      const data = await screenshotOwnOutput();
      return { result: data.message, image: data.base64 };
    }
    default:
      return {
        result: `Tool "${toolName}" is not available. Available tools: screenshotWebsite, screenshotOwnOutput, createFile, readFile, openInBrowser`,
      };
  }
}

# AI CLI Agent - Website Cloner

A conversational terminal agent that takes natural language instructions, reasons in a loop, uses tools, and generates a working website clone as real HTML, CSS, and JavaScript files.

The primary assignment target is Scaler Academy style cloning with:
- Header
- Hero section
- Footer

## Assignment Coverage

This project satisfies the required workflow:
1. Runs as a CLI chat tool in terminal.
2. Accepts natural language instructions from user.
3. Uses an iterative agent loop (not one-shot output).
4. Takes actions through tools (screenshot, file create/read, browser open).
5. Produces working output files in output folder.
6. Opens generated page in browser for visual verification.

## Features

- Conversational CLI interface.
- Tool-using agent loop: START -> THINK -> TOOL -> OBSERVE -> OUTPUT.
- Website screenshot capture with Puppeteer.
- Output screenshot self-review for iterative correction.
- Robust JSON parsing with multiple fallbacks.
- Generates index.html, style.css, script.js in output.

## Tech Stack

- Node.js (ESM)
- OpenRouter via OpenAI SDK
- Puppeteer
- dotenv

## Project Structure

```text
CLIAgent/
├── agent.js
├── prompt.js
├── tools.js
├── ui.js
├── SCALER_GUIDE.md
├── package.json
├── .env
└── output/
      ├── index.html
      ├── style.css
      ├── script.js
      ├── screenshot.png
      └── output-screenshot.png
```

## Prerequisites

- Node.js 18+
- npm
- OpenRouter API key

## Setup

1. Open project folder:

```bash
cd /home/.../GenAI/CLIAgent
```

2. Install dependencies:

```bash
npm install
```

3. Create or update .env:

```env
OPENROUTER_API_KEY=your_openrouter_key_here
```

## Run

```bash
npm start
```

Example prompt in CLI:

```text
Clone scaler.com landing page with accurate header hero and footer
```

## How the Agent Works

1. Receives user instruction.
2. Captures target website screenshot.
3. Analyzes layout, colors, spacing, typography.
4. Creates style.css.
5. Creates index.html.
6. Creates script.js.
7. Screenshots its own output.
8. Compares and iterates fixes.
9. Opens output in browser and returns summary.

## Available Tools

- screenshotWebsite: captures target website screenshot.
- screenshotOwnOutput: captures generated output screenshot.
- createFile: writes/overwrites file in output folder.
- readFile: reads file from output folder.
- openInBrowser: opens generated file in system browser.

## Output

Generated files are written to output folder:
- output/index.html
- output/style.css
- output/script.js

Comparison screenshots:
- output/screenshot.png
- output/output-screenshot.png

## Troubleshooting

### Output does not match layout well

- Let the full iteration complete.
- Re-run with a clearer instruction such as:
   - Clone scaler.com and match colors typography spacing exactly.
- Inspect output/style.css variables and spacing values.
- Compare output/screenshot.png and output/output-screenshot.png.

### API errors

- Verify OPENROUTER_API_KEY in .env.
- Ensure network access is available.
- Re-run npm start.

### Browser does not open

- Linux uses xdg-open.
- Open output/index.html manually if needed.

## Scripts

- npm start: runs agent.js

## Notes

- This is an assignment-focused implementation for cloning landing-page style websites.
- Best results come from pages with clear hero, navigation, and footer structure.

## License

ISC

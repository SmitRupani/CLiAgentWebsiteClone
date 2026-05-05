# AI CLI Agent - Website Cloner

A conversational CLI agent that clones websites (like Scaler Academy) by generating pixel-perfect HTML, CSS, and JavaScript files through AI-powered screenshot analysis and iterative refinement.

## Features

✨ **Conversational Interface** - Chat naturally with the agent in your terminal  
🎨 **Pixel-Perfect Cloning** - Extracts exact colors, fonts, spacing from target website  
🔄 **Iterative Refinement** - Takes screenshots, compares output, and fixes CSS until it matches  
📸 **Visual Analysis** - Uses Puppeteer for automated screenshot capture and comparison  
🎯 **Multi-section Support** - Creates header, hero section, and footer with proper styling  
💾 **Real Output Files** - Generates working HTML/CSS/JS that opens in your browser

## Prerequisites

- Node.js 16+ (with npm)
- OpenRouter API key (free tier available)
- ~5 minutes setup time

## Installation

1. **Clone/Navigate to project**:
```bash
cd /home/smit/Desktop/ExternalAssignments/GenAI/ai-cli-agent/ai-cli-agent
```

2. **Install dependencies**:
```bash
npm install
```

3. **Setup environment**:
```bash
cp .env.example .env  # or create manually
```

4. **Add your API key** to `.env`:
```
OPENROUTER_API_KEY=your_api_key_here
```

Get a free API key from [OpenRouter](https://openrouter.ai)

## Usage

**Start the agent**:
```bash
npm start
```

**Example commands**:
```
You ▶ Clone scaler.com
```

The agent will:
1. Screenshot the target website
2. Analyze colors, layout, typography
3. Generate HTML, CSS, JavaScript
4. Screenshot its own output
5. Compare with original
6. Iterate to fix mismatches
7. Open result in browser

**Output files** are saved in the `output/` folder:
- `index.html` - Complete page structure
- `style.css` - All styling and colors
- `script.js` - Interactive behaviors

## How It Works

### Phase 1: Analysis
- Takes high-quality screenshot of target website
- Extracts exact hex color codes from screenshot
- Measures spacing and layout dimensions
- Identifies fonts and typography

### Phase 2: Generation
- Generates comprehensive CSS (200+ lines) with:
  - CSS variables for all colors
  - Complete layout styling
  - Button and interactive element styles
  - Typography matching
- Creates semantic HTML structure
- Adds JavaScript for interactivity

### Phase 3: Comparison & Iteration
- Screenshots the generated output
- Compares visually with original
- Identifies CSS/layout differences
- Makes targeted fixes
- Repeats up to 3 times until match achieved

## Troubleshooting

### ❌ "Pages do not match the CSS and layout"

**Solution**: The agent needs better guidance. It will now:

1. **Take longer to analyze** - Spends more time extracting exact colors and measurements
2. **Build more detailed CSS** - 200+ lines minimum with all properties
3. **Compare more rigorously** - Multiple screenshot comparisons
4. **Iterate automatically** - Fixes CSS based on visual comparison

**What to do**:
- Let the agent run through multiple iterations (may take 5-10 minutes)
- Watch the console for THINK steps - they show what the agent is analyzing
- If it gets stuck, try a simpler website first (like example.com) to test
- Check the `output/` folder for generated files

### ❌ "Screenshot failed" or "Timeout"

**Possible causes**:
- Website is blocked or requires authentication
- Network timeout (try again)
- Browser resource issue

**Solutions**:
```bash
# Restart the agent
npm start

# Try a different website
# Or try a URL that loads faster
```

### ❌ "Colors are wrong"

**The agent now**:
- Extracts exact hex codes (#RRGGBB format)
- Uses CSS variables for all colors
- Compares side-by-side visually
- Iterates to fix color mismatches

**If still wrong**:
- Colors might be gradients - the agent extracts start/end colors
- Some websites use complex effects - agent tries to approximate
- Check the screenshot in `output/` folder to see what it's comparing against

### ❌ "Layout is broken" or "Spacing wrong"

**The agent now**:
- Estimates measurements from screenshots
- Uses flexbox/grid appropriately
- Maintains proportional spacing
- Verifies with multiple comparisons

**If still wrong**:
- Website might use custom fonts or responsive breakpoints
- Agent estimates spacing; some precision loss is normal
- Check `output/screenshot.png` vs `output/output-screenshot.png`

### ❌ "Agent loops forever" or "Too many iterations"

**What's happening**:
- Agent is trying to fix mismatches (up to 40 iterations max)
- If it can't match after iterations, it stops automatically

**What to do**:
- Let it complete (usually 5-15 minutes per clone)
- If it hits max iterations, files are still created in `output/`
- Try opening the generated `index.html` in browser anyway - it might look good

## Understanding the Agent's Output

### Console Messages

```
[START] Clone scaler.com
🤖 AGENT STARTED

[THINK] Analyzing the website...
[TOOL] Calling screenshotWebsite...
[RESULT] Screenshot captured. Analyzing colors and layout...
[THINK] Extracting colors: primary #0066ff, secondary #ff6b35...
[TOOL] Calling createFile...
[RESULT] File "style.css" created successfully...
[TOOL] Calling screenshotOwnOutput...
[THINK] Comparing outputs. Header matches. Footer needs fixing...
[TOOL] Calling createFile... (fixing CSS)
[RESULT] Fixed CSS. Colors now match...
[TOOL] Calling openInBrowser...
[OUTPUT] ✅ DONE - Files created successfully
```

### File Information

Each agent run creates:
- **style.css** - Your complete stylesheet (view to see extracted colors)
- **index.html** - Full HTML structure (inspect to see semantic markup)
- **script.js** - Interactive JavaScript (handles scrolling, menu toggle)
- **screenshot.png** - Target website screenshot (reference)
- **output-screenshot.png** - Generated page screenshot (for comparison)

## Advanced Tips

### 1. Monitor Iterations
Watch for the [THINK] steps - they show the agent's reasoning:
```
[THINK] Comparing outputs. Colors match! Layout matches! Footer looks good!
```

### 2. Check Extracted Colors
Open the generated `style.css` and look at the `:root` section:
```css
:root {
  --primary-color: #0066ff;      /* From analysis */
  --secondary-color: #ff6b35;    /* From analysis */
  --text-color: #ffffff;         /* From analysis */
}
```

### 3. Validate HTML Structure
Open `index.html` in editor to see the semantic structure:
```html
<header class="navbar">...</header>
<section class="hero">...</section>
<footer class="footer">...</footer>
```

### 4. Test in Browser
The agent automatically opens the result, but you can also:
```bash
# Manually open the file
open output/index.html           # macOS
xdg-open output/index.html       # Linux
start output/index.html          # Windows
```

## Website Cloning Guide

For best results when cloning websites:

### Scaler Academy (Primary Target)
- Website has clear sections: header, hero, footer
- Dark theme with blue/orange accents
- Refer to `SCALER_GUIDE.md` for specific details

### Other Websites
- **YouTube**: Focus on header (search bar, nav), main content area
- **Amazon**: Header with logo/search, product grid
- **Simple Sites**: Usually work best (clear colors, good contrast)

### What Works Best
✅ Websites with:
- Clear sections (header, main, footer)
- Simple color schemes (3-5 colors max)
- Standard fonts (Poppins, Inter, Arial)
- Good color contrast
- No heavy animations

❌ Difficult websites:
- Heavy JavaScript animations
- Complex gradients or effects
- Custom fonts that load slowly
- Dynamic content
- Authentication required

## Configuration

### Agent Settings (in agent.js)

```javascript
const MODEL = "google/gemini-2.0-flash-001";  // Change model here
const MAX_ITERATIONS = 40;                     // Max iterations before stop
const temperature = 0.2;                       // Lower = more consistent
```

### Tool Settings (in tools.js)

```javascript
const OUTPUT_DIR = path.resolve("./output");   // Output folder
// Puppeteer viewport size
await page.setViewport({ width: 1440, height: 900 });
```

## Performance Tips

1. **Faster Cloning**:
   - Use simpler websites
   - Websites with good contrast load screenshots faster
   - Reduce MAX_ITERATIONS if needed

2. **Better Results**:
   - Let agent run for full iterations (don't interrupt)
   - Use specific URLs (scaler.com not scalerproduction.com)
   - Check browser console for loading errors

3. **Save on API Calls**:
   - Each iteration uses 1-2 API calls
   - Simpler websites = fewer iterations needed
   - Watch for parse errors (they trigger retries)

## Project Structure

```
ai-cli-agent/
├── agent.js              # Main agent loop and CLI
├── prompt.js             # System prompt with detailed workflow
├── tools.js              # Tool implementations
├── ui.js                 # Terminal UI and colors
├── package.json          # Dependencies
├── .env                  # API key configuration
├── SCALER_GUIDE.md       # Scaler-specific reference
├── README.md             # This file
└── output/               # Generated files (auto-created)
    ├── index.html
    ├── style.css
    ├── script.js
    ├── screenshot.png
    └── output-screenshot.png
```

## Common Questions

**Q: How long does cloning take?**  
A: 5-15 minutes depending on website complexity. Agent does multiple comparison iterations.

**Q: Can I use custom API keys?**  
A: Yes! Update the OpenRouter API key in `.env` file.

**Q: What if generation fails?**  
A: Check console for error. Usually API key issue or network timeout. Restart and try again.

**Q: Can I clone any website?**  
A: Any public website, but results depend on complexity. Simple sites work better.

**Q: How can I improve results?**  
A: Let agent iterate fully, use simpler websites to test, check the comparison screenshots.

## Support & Debugging

**Enable Debug Mode** - Add logging to agent.js:
```javascript
console.log("DEBUG: Analyzing colors from screenshot...", extractedColors);
console.log("DEBUG: Building CSS with", cssLines.length, "lines");
```

**Check Generated Files** - Always review output:
```bash
cd output/
ls -la                    # See all files
cat style.css             # Check CSS extraction
cat index.html            # Check HTML structure
```

**Verify Screenshots** - Compare visually:
- `screenshot.png` = target website
- `output-screenshot.png` = generated page

## Next Steps

1. **Test the agent**: `npm start`
2. **Try simple clone**: "Clone example.com"
3. **Clone Scaler**: "Clone scaler.com"
4. **Iterate if needed**: Watch console, let it refine

## License

ISC - See package.json

---

**Need help?** Check the console output for specific error messages. The agent logs detailed information about what it's analyzing and building.

// ── ANSI Color Helpers ─────────────────────────────────────────────

export const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
  white: "\x1b[37m",
  bgBlue: "\x1b[44m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
};

/**
 * Logs a colored, labeled message to the console.
 */
export function colorLog(color, label, message) {
  console.log(`${color}${colors.bold}[${label}]${colors.reset} ${message}`);
}

/**
 * Prints the welcome banner when the CLI starts.
 */
export function printBanner() {
  console.log(`
${colors.bold}${colors.blue}╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ${colors.cyan}🚀  AI CLI Agent — Website Cloner${colors.blue}                     ║
║                                                          ║
║   ${colors.white}Clone any website with pixel-perfect accuracy!${colors.blue}         ║
║   ${colors.white}The agent screenshots, analyzes, builds,${colors.blue}              ║
║   ${colors.white}and self-reviews the output.${colors.blue}                           ║
║                                                          ║
║   ${colors.white}Examples: "Clone scaler.com"${colors.blue}                           ║
║   ${colors.white}          "Clone youtube.com"${colors.blue}                          ║
║                                                          ║
║   ${colors.dim}Type "exit" or "quit" to leave.${colors.blue}${colors.bold}                       ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝${colors.reset}
`);
}


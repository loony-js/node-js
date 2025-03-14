class TerminalColors {
  styles: Record<string, string>
  colors: Record<string, string>
  bgColors: Record<string, string>

  constructor() {
    this.styles = {
      reset: "\x1b[0m",
      bold: "\x1b[1m",
      underline: "\x1b[4m",
    }

    this.colors = {
      black: "\x1b[30m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",
    }

    this.bgColors = {
      black: "\x1b[40m",
      red: "\x1b[41m",
      green: "\x1b[42m",
      yellow: "\x1b[43m",
      blue: "\x1b[44m",
      magenta: "\x1b[45m",
      cyan: "\x1b[46m",
      white: "\x1b[47m",
    }
  }

  color(text: string, color: string) {
    return `${this.colors[color] || ""}${text}${this.styles.reset}`
  }

  bgColor(text: string, bgColor: string) {
    return `${this.bgColors[bgColor] || ""}${text}${this.styles.reset}`
  }

  bold(text: string) {
    return `${this.styles.bold}${text}${this.styles.reset}`
  }

  underline(text: string) {
    return `${this.styles.underline}${text}${this.styles.reset}`
  }
}

export default new TerminalColors()

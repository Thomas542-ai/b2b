export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  log(message: string) {
    console.log(`[${this.context}] ${message}`);
  }

  error(message: string, error?: any) {
    console.error(`[${this.context}] ${message}`, error);
  }

  warn(message: string) {
    console.warn(`[${this.context}] ${message}`);
  }

  debug(message: string) {
    console.debug(`[${this.context}] ${message}`);
  }
}

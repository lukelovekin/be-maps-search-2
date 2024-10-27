import winston from 'winston'

export class LoggerService {
  private logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(   
          winston.format.timestamp(),
          winston.format.json()   
        )
      })
    ]
  });

  private readonly path: string;

  constructor(path: string) {
    this.path = path
  }

  error(message: string) {
    this.logger.error(message, this.path);
  }

  warn(message: string) {
    this.logger.warn(message, this.path);
  }

  info(message: string) {
    this.logger.info(message, this.path);
  }

  debug(message: string) {
    this.logger.debug(message, this.path);
  }
}
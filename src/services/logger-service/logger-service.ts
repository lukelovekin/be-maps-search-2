import winston from 'winston'

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(   
        winston.format.timestamp(),
        winston.format.json()   
      )
    })
  ]
});
export class LoggerService {
  constructor(private readonly path: string) {
    this.path = path
  }

  error(message: string) {
    // TODO Notify monitoring tool (New relic e.g)
    logger.error(message, this.path);
  }

  warn(message: string) {
    // TODO Maybe Notify monitoring tool (New relic e.g)
    logger.warn(message, this.path);
  }

  info(message: string) {
    logger.info(message, this.path);
  }

  debug(message: string) {
    logger.debug(message, this.path);
  }
}
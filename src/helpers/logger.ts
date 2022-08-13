import { createLogger, transports, format, Logger } from "winston";

const logger: Logger = createLogger({
  transports: [new transports.Console()],
  format: format.combine(
    format.metadata(),
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message, metadata }) => {
      // Using logfmt format. Helps with log aggregation tools.
      return `timestamp=[${timestamp}] level=${level} message="${message}" metadata=${JSON.stringify(metadata)}`;
    })
  ),
});

export default logger
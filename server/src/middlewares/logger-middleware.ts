import winston from "winston";
import expressWinston from "express-winston";
import "winston-daily-rotate-file";

export const requestsLogger = expressWinston.logger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "logs/requests-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: 30,
    }),
  ],
  format: winston.format.json(),
});

export const errorsLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "logs/errors-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: 30,
    }),
  ],
  format: winston.format.json(),
});

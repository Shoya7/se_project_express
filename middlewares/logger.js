const winston = require("winston");
const expressWinston = require("express-winston");

// Create request logger
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: "request.log",
    }),
  ],
  format: winston.format.json(),
});

// Create error logger
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: "error.log",
    }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};

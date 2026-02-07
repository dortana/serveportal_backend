import winston from "winston";

const isDebug = process.env.APP_DEBUG === "true";

const logLevels = {
  error: 0, // highest priority
  warning: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logger = winston.createLogger({
  levels: logLevels,
  level: isDebug ? "debug" : process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS",
    }),

    // 🔑 stack traces only in debug
    isDebug ? winston.format.errors({ stack: true }) : winston.format.errors(),

    // 🔑 readable dev, structured prod
    isDebug
      ? winston.format.printf(
          ({ timestamp, level, message, stack, ...meta }) =>
            `${timestamp} ${level}: ${message} ${
              stack ?? ""
            } ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`,
        )
      : winston.format.json(),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;

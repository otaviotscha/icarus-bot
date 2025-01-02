import { createLogger, transports } from 'winston'

import { isProductionEnvironment, isTestEnvironment } from '~/configs/env'

/**
 * Logging levels.
 */
const DEBUG_LEVEL = 'debug' as const

/**
 * Console options.
 */
export const consoleOptions = {
  level: DEBUG_LEVEL,
  silent: isTestEnvironment(),
}

/**
 * Log transports.
 */
const transportsLogger =
  /**
   * TODO: add production transports
   */
  isProductionEnvironment()
    ? [new transports.Console(consoleOptions)]
    : [new transports.Console(consoleOptions)]

export interface ILogger {
  debug(message: string): void
  info(message: string): void
  warn(message: string): void
  error(message: string): void
}

/**
 * Creates logger.
 */
export const logger: ILogger = createLogger({
  transports: transportsLogger,
})

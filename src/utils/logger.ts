import winston from 'winston'

import { isProductionEnvironment } from '~/configs/env'

export interface ILogger {
  debug(message: string): void
  info(message: string): void
  warn(message: string): void
  error(message: string): void
}

const { combine, timestamp, printf, colorize } = winston.format

const myFormat = printf(({ level, message, timestamp }) => {
  const colorizer = colorize()
  const levelStr = colorizer.colorize(level, `[${level.toUpperCase()}]`)
  return `${levelStr}: ${timestamp}: ${message}`
})

const level = isProductionEnvironment() ? 'info' : 'debug'

export const logger: ILogger = winston.createLogger({
  format: combine(timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }), myFormat),
  transports: [new winston.transports.Console()],
  level,
})

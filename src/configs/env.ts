import { config } from 'dotenv'
import { resolve } from 'path'

/**
 * Environment types.
 */
export enum EnvironmentType {
  DEV = 'development',
  TEST = 'test',
  PRODUCTION = 'production',
}

/**
 * .env file defaults.
 */
export enum EnvironmentDefault {
  NODE_ENV = EnvironmentType.DEV,
  DISCORD_APP_ID = '',
  DISCORD_GUILD_ID = '',
  DISCORD_APP_TOKEN = '',
  GEMINI_API_KEY = '',
}

export const isProductionEnvironment = () =>
  process.env.NODE_ENV === EnvironmentType.PRODUCTION
export const isDevelopmentEnvironment = () =>
  process.env.NODE_ENV === EnvironmentType.DEV
export const isTestEnvironment = () =>
  process.env.NODE_ENV === EnvironmentType.TEST

/**
 * Loading .env file.
 */
config({ path: resolve(__dirname, '..', '..', '.env') })

export const {
  NODE_ENV = EnvironmentDefault.NODE_ENV as const,
  DISCORD_APP_ID = EnvironmentDefault.DISCORD_APP_ID as const,
  DISCORD_GUILD_ID = EnvironmentDefault.DISCORD_GUILD_ID as const,
  DISCORD_APP_TOKEN = EnvironmentDefault.DISCORD_APP_TOKEN as const,
  GEMINI_API_KEY = EnvironmentDefault.GEMINI_API_KEY as const,
} = process.env

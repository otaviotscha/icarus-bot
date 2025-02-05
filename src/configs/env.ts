import { config as readDotEnvFile } from 'dotenv'
import { resolve } from 'path'
import { z } from 'zod'

export const ENV_TYPES = ['dev', 'test', 'prod'] as const
export const environmentTypeEnum = z.enum(ENV_TYPES).Enum

const envVariablesSchema = z.object({
  NODE_ENV: z.enum(ENV_TYPES).default(environmentTypeEnum.dev),
  DISCORD_APP_ID: z.string().nonempty(),
  DISCORD_APP_TOKEN: z.string().nonempty(),
  GEMINI_API_KEY: z.string().nonempty(),
  YOUTUBE_API_KEY: z.string().nonempty(),
})
export type EnvVariables = z.infer<typeof envVariablesSchema>

export const isDevelopmentEnvironment = () =>
  process.env.NODE_ENV === environmentTypeEnum.dev
export const isProductionEnvironment = () =>
  process.env.NODE_ENV === environmentTypeEnum.prod
export const isTestEnvironment = () =>
  process.env.NODE_ENV === environmentTypeEnum.test

const config = (): EnvVariables => {
  readDotEnvFile({ path: resolve(__dirname, '..', '..', '.env') })
  const botConfig = envVariablesSchema.safeParse(process.env)
  if (!botConfig.success) {
    console.error('Invalid environment variables. Check your ".env" file')
    process.exit(1)
  }
  return botConfig.data
}

/**
 * Loading .env file.
 */
export const {
  NODE_ENV,
  DISCORD_APP_ID,
  DISCORD_APP_TOKEN,
  GEMINI_API_KEY,
  YOUTUBE_API_KEY,
} = config()

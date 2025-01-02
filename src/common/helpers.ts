import { logger } from '~/common/logger'

/**
 * Default error message when not an instance of Error.
 */
const NOT_AN_ERROR_MSG =
  'Error handler received something that is not an instance of Error' as const

/**
 * Checks if structure is instance of Error and converts it to ErrnoException.
 */
export const isError = (
  structure: unknown
): structure is NodeJS.ErrnoException => structure instanceof Error

/**
 * Logs and converts errors.
 */
export const handleThrownError = (error: unknown): Error => {
  if (!isError(error)) {
    logger.error(NOT_AN_ERROR_MSG)
    return new Error(NOT_AN_ERROR_MSG)
  }

  /**
   * If it is a simple error, just logs and then returns it.
   */
  logger.error(error.message)
  return error
}

import {
  GuildMember,
  type APIInteractionGuildMember,
  type CommandInteraction,
  type VoiceBasedChannel,
} from 'discord.js'

import { logger } from './logger'
import JukeBox from '~/music/jukebox'

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

export type UserInput = string | number | boolean

export const validateUserInput = (input?: UserInput): UserInput => {
  if (typeof input === 'string') {
    input = input?.toString().trim()
  }
  if (!input) {
    throw new Error('Missing prompt for GPT')
  }

  return input
}

export const getUserNicknameFromInteraction = (
  interaction: CommandInteraction
) => {
  if (interaction.member) {
    if (interaction.member && interaction.member instanceof GuildMember) {
      return interaction.member.displayName
    }
  }
  return interaction.user.displayName
}

export const validateGuildId = (guildId?: string): string => {
  if (!guildId) {
    throw new Error('Bot is not currently in a guild.')
  }
  return guildId
}

export const validateGuildIdFromInteraction = (
  interaction: CommandInteraction
): string => {
  const validGuildId = validateGuildId(interaction.guild?.id)
  return validGuildId
}

export const validateMemberVoiceChannelId = (
  voiceChannelId?: string
): string => {
  if (!voiceChannelId) {
    throw new Error('User should be in a voice channel.')
  }
  return voiceChannelId
}

export const getMemberVoiceChannelFromInteraction = (
  interaction: CommandInteraction
): VoiceBasedChannel => {
  const guildMember = validateGuildMemberFromInteraction(interaction)
  const memberVoiceChannelId = validateMemberVoiceChannelId(
    guildMember.voice.channel?.id
  )
  return guildMember.voice.channel!
}

export const validateMemberVoiceChannelFromInteraction = (
  interaction: CommandInteraction
): string => {
  const voiceChannel = getMemberVoiceChannelFromInteraction(interaction)
  return voiceChannel.id
}

export const validateGuildMember = (
  guildMember?: GuildMember | APIInteractionGuildMember | null
): GuildMember => {
  if (!guildMember || !(guildMember instanceof GuildMember)) {
    throw new Error('Dont know waht to do')
  }
  return guildMember
}

export const validateGuildMemberFromInteraction = (
  interaction: CommandInteraction
): GuildMember => {
  const guildMember = validateGuildMember(interaction.member)
  return guildMember
}

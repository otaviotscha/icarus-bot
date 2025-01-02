import {
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js'

import { sendPromptToGemini } from '~/gemini'

const ICARUS_DEFAULT_PROMPT =
  'Act like you are an AI bot called Icarus. By default, respond users in Portuguese, but if they talk to you in other languages, respond accordingly' as const

const getUserNicknameFromInteraction = (interaction: CommandInteraction) => {
  if (interaction.member) {
    if (interaction.member && interaction.member instanceof GuildMember) {
      return interaction.member.displayName
    }
  }
  return interaction.user.displayName
}

const command = {
  data: new SlashCommandBuilder()
    .setName('gpt')
    .setDescription('Asks AI')
    .addStringOption((option) =>
      option
        .setName('prompt')
        .setDescription('The prompt to be sent to the AI')
        .setMaxLength(256)
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    const userInput = interaction.options
      .get('prompt')
      ?.value?.toString()
      .trim()
    if (!userInput) {
      throw new Error('Missing prompt for GPT')
    }
    const userNickname = getUserNicknameFromInteraction(interaction)
    const fullPrompt = `${ICARUS_DEFAULT_PROMPT}. The "${userNickname}" user has sent you this message: "${userInput}"`
    const geminiResponse = await sendPromptToGemini(fullPrompt)
    await interaction.reply(
      `${userNickname}: "${userInput}"

${geminiResponse}`
    )
  },
}

export default command

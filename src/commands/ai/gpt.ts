import { CommandInteraction, SlashCommandBuilder } from 'discord.js'

import {
  getUserNicknameFromInteraction,
  validateUserInput,
} from '~/utils/helpers'
import { sendPromptToGemini } from '~/gemini'

const ICARUS_DEFAULT_PROMPT =
  'Act like you are an AI bot called Icarus. By default, respond users in Portuguese, but if they talk to you in other languages, respond accordingly' as const

const command = {
  data: new SlashCommandBuilder()
    .setName('gpt')
    .setDescription('Asks AI')
    .addStringOption((option) =>
      option
        .setName('prompt')
        .setDescription('The prompt to be sent to the AI')
        .setMaxLength(250)
        .setRequired(true)
    ),

  async execute(interaction: CommandInteraction) {
    const userInput = validateUserInput(
      interaction.options.get('prompt')?.value
    )
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

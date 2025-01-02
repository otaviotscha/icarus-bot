import { CommandInteraction, SlashCommandBuilder } from 'discord.js'

import { logger } from '~/common/logger'

const command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction: CommandInteraction) {
    logger.info(`${interaction.user.tag} used ping command`)
    await interaction.reply('Pong!')
  },
}

export default command

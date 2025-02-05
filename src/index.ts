import '~/configs/aliases'
import '~/configs/env'

import {
  Client,
  Events,
  GatewayIntentBits,
  MessageFlags,
  type InteractionReplyOptions,
} from 'discord.js'

import { DISCORD_APP_TOKEN } from '~/configs/env'
import { logger } from '~/utils/logger'
import { handleThrownError } from './utils/helpers'
import {
  addOrRefreshCommands,
  CommandCollection,
  getCommandsCollection,
} from '~/commands'

class ClientWithCommands extends Client {
  commands: CommandCollection = new CommandCollection()
}

const client = new ClientWithCommands({ intents: [GatewayIntentBits.Guilds] })
client.commands = getCommandsCollection()
addOrRefreshCommands(client.commands)

/**
 * When the client is ready, run this code (only once).
 */
client.once(Events.ClientReady, (readyClient) => {
  logger.info(`Ready! Logged in as ${readyClient.user.tag}`)
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return
  try {
    const command = client.commands.get(interaction.commandName)

    if (!command) {
      throw new Error(
        `No command matching ${interaction.commandName} was found.`
      )
    }

    await command.execute(interaction)
  } catch (error) {
    handleThrownError(error)

    const errorReply: InteractionReplyOptions = {
      content: 'There was an error while executing this command!',
      flags: MessageFlags.Ephemeral,
    }

    if (interaction.replied || interaction.deferred) {
      return await interaction.followUp(errorReply)
    }
    await interaction.reply(errorReply)
  }
})

/**
 * Log in to Discord with your client's token
 */
client.login(DISCORD_APP_TOKEN).catch((error) => {
  logger.error(`Failed to start. Error ${error}`)
})

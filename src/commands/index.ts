import fs from 'node:fs'
import path from 'node:path'

import {
  Collection,
  CommandInteraction,
  InteractionResponse,
  REST,
  Routes,
  SlashCommandBuilder,
} from 'discord.js'

import { logger } from '~/common/logger'
import { handleThrownError } from '~/common/helpers'
import { DISCORD_APP_ID, DISCORD_APP_TOKEN } from '~/configs/env'

const COMMANDS_FOLDER_PATH = path.join(__dirname)

export type Command = {
  data: SlashCommandBuilder
  execute: (
    interaction: CommandInteraction
  ) => Promise<InteractionResponse<boolean>>
}

export type CommandFromFile = {
  default: Command
}

export class CommandCollection extends Collection<string, Command> {}

const getCommandFolders = (): string[] => {
  const commandFolders = fs.readdirSync(COMMANDS_FOLDER_PATH)
  return commandFolders
}

const getCommandFilesFromFolder = (folderName: string) => {
  const commandsPath = path.join(COMMANDS_FOLDER_PATH, folderName)
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => {
    return file.endsWith('.js') || file.endsWith('.ts')
  })
  return commandFiles
}

const getFullCommandPath = (folderName: string, fileName: string): string => {
  return path.join(COMMANDS_FOLDER_PATH, folderName, fileName)
}

const getCommandFromFile = (
  folderName: string,
  fileName: string
): Command | void => {
  const filePath = getFullCommandPath(folderName, fileName)
  const command = require(filePath) as CommandFromFile
  if (!command.default.data || !command.default.execute) {
    return logger.warn(
      `The command at "${filePath}" is missing a required "data" or "execute" property.`
    )
  }
  return command.default
}

export const getCommandsCollection = (): CommandCollection => {
  const collection = new CommandCollection()
  const commandFolders = getCommandFolders()
  for (const folderName of commandFolders) {
    if (folderName == 'index.js' || folderName == 'index.ts') continue
    const commandFiles = getCommandFilesFromFolder(folderName)
    for (const fileName of commandFiles) {
      const command = getCommandFromFile(folderName, fileName)
      if (command != null) collection.set(command.data.name, command)
    }
  }
  return collection
}

export const addOrRefreshCommands = async (
  commandsArg: CommandCollection | SlashCommandBuilder[]
) => {
  try {
    const rest = new REST().setToken(DISCORD_APP_TOKEN)
    const commands =
      commandsArg instanceof CommandCollection
        ? commandsArg.map((command) => command.data)
        : commandsArg

    logger.info(
      `Started refreshing ${commands.length} application (/) commands.`
    )
    logger.info(`Commands: ${JSON.stringify(commands)}`)

    await rest.put(Routes.applicationCommands(DISCORD_APP_ID), {
      body: commands,
    })

    logger.info(
      `Successfully reloaded ${commands.length} application (/) commands.`
    )
  } catch (error) {
    handleThrownError(error)
  }
}

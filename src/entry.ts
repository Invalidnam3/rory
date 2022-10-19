import { Command } from '../types/global'

// load .env file into process.env
import { config } from 'dotenv'
config()

import fs from 'node:fs'
import path from 'node:path'

import { Collection, GatewayIntentBits } from 'discord.js'
import { QueueManager } from './utils/queue-manager'
import { ExtendedClient } from './utils/client'

const client = new ExtendedClient({
  // Define bot intectactions scope
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ]
})

// We have to disable ts checks here until we know how to extend Client
client.commands = new Collection()
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath)
  .filter(file => file.endsWith('ts'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  // Is this the only way to dynamic import ?
  const command: Command = require(filePath)
  client.commands.set(command.default.data.name, command)
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`)
  // Create a QueueManager for each Guild the bot is in
  client.queues = new Map()
  client.guilds.cache.forEach(guild => {
    client.queues.set(guild.id, new QueueManager())
  })
})

// listen to command execution and get it from its dictionary
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.default.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
})

client.login(process.env.TOKEN)
// load .env file into process.env
import { config } from 'dotenv'
config()

import fs from 'node:fs'
import path from 'node:path'

import { Client, Collection, GatewayIntentBits } from 'discord.js'

const client = new Client({
  // Define bot intectactions scope
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ]
})

// We have to disable ts checks here until we know how to extend Client
// @ts-ignore
client.commands = new Collection()
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath)
  .filter(file => file.endsWith('ts'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  // Is this the only way to dynamic import ?
  // @ts-ignore
  const command: Command = require(filePath)
  // @ts-ignore
  client.commands.set(command.default.data.name, command)
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`)
})

// listen to command execution and get it from its dictionary for its callback
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  // @ts-ignore
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
import fs from 'node:fs'
import path from 'node:path'
import { config } from 'dotenv'
import { Client, Collection, GatewayIntentBits } from 'discord.js'
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnection,
} from '@discordjs/voice'
import * as youtubedl from 'youtube-dl-exec'

// load .env file into process.env
config()

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
  client.commands.set(command.data.name, command)
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`)
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  // @ts-ignore
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
})

// Create a join command where the bot will join said user channel
client.on('messageCreate', (message) => {
  // // Check if member is part of the current guild and its in a voice channel
  // const channel  = message.member?.voice?.channel
  // const audioPlayer = createAudioPlayer()
  // let voiceConnection: VoiceConnection
  // if (channel) {
  //   voiceConnection = joinVoiceChannel({
  //     channelId: channel.id,
  //     guildId: channel.guild.id,
  //     adapterCreator: channel.guild.voiceAdapterCreator
  //   })
  //   // Sample resource afterdark
  //   const process = youtubedl.exec('https://www.youtube.com/watch?v=Cl5Vkd4N03Q', {
  //     format: 'ba',
  //     output: '-'
  //   })
  //   if (!process.stdout) return
  //   const resource = createAudioResource(process.stdout)
  //   audioPlayer.play(resource)
  //   voiceConnection.subscribe(audioPlayer)
  // }
})

client.login(process.env.TOKEN)
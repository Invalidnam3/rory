import { config } from 'dotenv'
import { Client, GatewayIntentBits } from 'discord.js'
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnection,
  demuxProbe
} from '@discordjs/voice'
import * as youtubedl from 'youtube-dl-exec'
import fs from 'fs'


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

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`)
})

// Create a join command where the bot will join said user channel
client.on('messageCreate', (message) => {
  // Check if member is part of the current guild
  if (message.member) {
    const { channel } = message.member.voice
    const audioPlayer = createAudioPlayer()
    audioPlayer.on('error', error => {
      console.log(error)
    })
    audioPlayer.on('stateChange', stateChange => {
      console.log(stateChange.status)
    })
    let voiceConnection: VoiceConnection
    if (channel) {
      voiceConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
      })
      // Sample resource afterdark
      const process = youtubedl.exec('https://www.youtube.com/watch?v=Cl5Vkd4N03Q', {
        format: 'ba',
        output: '-'
      })
      if (!process.stdout) return
      const resource = createAudioResource(process.stdout)
      audioPlayer.play(resource)
      voiceConnection.subscribe(audioPlayer)
    }
  }
})

client.login(process.env.TOKEN)
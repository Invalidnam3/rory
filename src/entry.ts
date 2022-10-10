import { config } from 'dotenv'
import { Client, GatewayIntentBits } from 'discord.js'
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnection
} from '@discordjs/voice'
import { join } from 'node:path'
import { exec } from 'child_process'

// load .env file into process.env
config()

// Test for downloading an mp3 file from spotify
exec('spotifydl https://open.spotify.com/track/0x7vEcjqMVjuKvvsIUGEPT?si=5738563cb4e74c12', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    console.log(err)
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`)
  console.log(`stderr: ${stderr}`)
})

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
    // audioPlayer.on('error', error => {
    //   console.log(error)
    // })
    // audioPlayer.on('stateChange', stateChange => {
    //   console.log(stateChange.status)
    // })
    let voiceConnection: VoiceConnection
    if (channel) {
      voiceConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
      })
      // Sample resource afterdark
      console.log(join(__dirname, 'afterdark.mp3'))
      const resource = createAudioResource(join(__dirname, 'afterdark.mp3'))
      // console.log(resource)
      audioPlayer.play(resource)
      voiceConnection.subscribe(audioPlayer)
    }
  }
})

// client.login(process.env.TOKEN)
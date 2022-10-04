import { config } from 'dotenv'
import { Client, GatewayIntentBits } from 'discord.js'
import { joinVoiceChannel, DiscordGatewayAdapterCreator } from '@discordjs/voice'

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
    if (channel) {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
      })
    }
  }
})

client.login(process.env.TOKEN)
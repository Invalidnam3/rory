import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import  { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnection } from '@discordjs/voice'

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays provided Youtube song'),
  // Verify if this is the intended type
  async execute(interation: ChatInputCommandInteraction) {
    await interation.reply('Pong!')
  }
}
// // Create a join command where the bot will join said user channel
// client.on('messageCreate', (message) => {
//   // Check if member is part of the current guild and its in a voice channel
//   const channel = message.member?.voice?.channel
//   const audioPlayer = createAudioPlayer()
//   let voiceConnection: VoiceConnection
//   if (channel) {
//     voiceConnection = joinVoiceChannel({
//       channelId: channel.id,
//       guildId: channel.guild.id,
//       adapterCreator: channel.guild.voiceAdapterCreator
//     })
//     // Sample resource afterdark
//     const process = youtubedl.exec('https://www.youtube.com/watch?v=Cl5Vkd4N03Q', {
//       format: 'ba',
//       output: '-'
//     })
//     if (!process.stdout) return
//     const resource = createAudioResource(process.stdout)
//     audioPlayer.play(resource)
//     voiceConnection.subscribe(audioPlayer)
//   }
// })
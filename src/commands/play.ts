import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js'
import { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnection } from '@discordjs/voice'
import * as youtubedl from 'youtube-dl-exec'

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays provided Youtube song')
    .addStringOption(option => 
      option
        .setName('url')
        .setDescription('Provide a Youtube URL to reproduce')
        .setRequired(true)),
  // Verify if this is the intended type
  async execute(interation: ChatInputCommandInteraction) {
    const youtubeUrl = interation.options.getString('url')

    const guild = interation.client.guilds.cache.get(interation.guildId)
    const member = guild.members.cache.get(interation.member.user.id)
    const audioPlayer = createAudioPlayer()

    // For debuggin purpose 
    audioPlayer.on('stateChange', async (newState) => {
      console.log(newState.status)
    })

    if (!member.voice.channel) return

    const { channel } = member.voice
    const voiceConnection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator
    })

    const process = youtubedl.exec(youtubeUrl, {
      format: 'ba',
      output: '-'
    })

    const resource = createAudioResource(process.stdout)
    audioPlayer.play(resource)
    voiceConnection.subscribe(audioPlayer)

    await interation.reply('Trying to reproduce provided song')
  }
}
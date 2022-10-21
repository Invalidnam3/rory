import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { joinVoiceChannel } from '@discordjs/voice'
import ytdl from 'ytdl-core'
import ytsr, { Video } from 'ytsr'

import { ExtendedClient } from '../utils/client'
import { isValidYoutubeUrl } from '../utils/utils'
import { Song } from '../utils/song'

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays provided Youtube song')
    .addStringOption(option => 
      option
        .setName('query')
        .setDescription('Provide a query Youtube URL to reproduce')
        .setRequired(true)),
  // Verify if this is the intended type
  async execute(interation: ChatInputCommandInteraction) {
    const client: ExtendedClient = interation.client
    const queueManager = client.queues.get(interation.guildId)
    const query = interation.options.getString('query')
    const guild = interation.client.guilds.cache.get(interation.guildId)
    const member = guild.members.cache.get(interation.member.user.id)

    if (!member.voice.channel) {
      await interation.reply('User is not in a voice channel')
      return
    }

    const { channel } = member.voice
    joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator
    })

    let song: Song
    const validYoutubeUrl = isValidYoutubeUrl(query)
    // Get first result of youtube if it wasn't a URL
    if (!validYoutubeUrl) {
      const youtubeResult = await ytsr(query, { limit:1 })
      const youtubeItem = youtubeResult.items[0] as Video
      // console.log(youtubeResult.items)
      song = new Song({
        title: youtubeItem.title,
        url:  youtubeItem.url
      })
    } else {
      const youtubeInfo = await ytdl.getInfo(query)
      song = new Song({
        title: youtubeInfo.videoDetails.title,
        url: query
      })
    }
    // Add requested  song to the Guild queue
    client.queues.get(guild.id).queue.push(song)
    queueManager.play(song)
    await interation.reply({
      content:`Added ${song.title} to the queue.`
    })
  }
}
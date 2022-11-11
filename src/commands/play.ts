import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice'
import ytpl from 'ytpl'
import ytdl from 'ytdl-core'
import ytsr, { Video } from 'ytsr'

import { ExtendedClient } from '../utils/client'
import { getYoutubePlaylistId, isValidYoutubeUrl } from '../utils/utils'
import { Song } from '../utils/song'

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays provided Youtube song')
    .addStringOption(option => 
      option
        .setName('query')
        .setDescription('Provide a query or Youtube URL to reproduce')
        .setRequired(true)),
  async execute(interation: ChatInputCommandInteraction) {
    const client: ExtendedClient = interation.client
    const queueManager = client.queues.get(interation.guildId)
    const query = interation.options.getString('query')
    const guild = client.guilds.cache.get(interation.guildId)
    const member = guild.members.cache.get(interation.member.user.id)

    if (!member.voice.channel) {
      await interation.reply('User is not in a voice channel')
      return
    }

    const voiceChannel = getVoiceConnection(guild.id)
    const { channel } = member.voice

    if (!voiceChannel || voiceChannel.state.status === 'disconnected') {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator
      })
    }
    
    queueManager.registerVoiceConnectionEvents()
    
    let song: Song
    const validYoutubeUrl = isValidYoutubeUrl(query)
    // Get first result of youtube if it wasn't a Youtube URL
    if (!validYoutubeUrl) {
      const youtubeResult = await ytsr(query, { limit:1 })
      const youtubeItem = youtubeResult.items[0] as Video
      song = new Song({
        title: youtubeItem.title,
        url:  youtubeItem.url
      })
    } else {
      const playlistId = getYoutubePlaylistId(query)
      console.log(playlistId)
      if (playlistId) {
        const youtubePlaylist = await ytpl(playlistId, { limit: Infinity })
        youtubePlaylist.items.forEach(youtubeSong =>
          queueManager.queue.push(new Song({
            title: youtubeSong.title,
            url: youtubeSong.shortUrl
          }))
        )
        await interation.reply({
          content:`Added ${youtubePlaylist.items.length} Songs to the queue.`
        })
        queueManager.play(queueManager.queue[0])
        return
      } else {
        const youtubeInfo = await ytdl.getInfo(query)
        song = new Song({
          title: youtubeInfo.videoDetails.title,
          url: query
        })
      }
    }
    // Add requested  song to the Guild queue
    queueManager.queue.push(song)
    queueManager.play(song)
    await interation.reply({
      content:`Added ${song.title} to the queue.`
    })
  }
}
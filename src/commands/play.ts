import { ExtendedClient } from '../utils/client'

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { joinVoiceChannel } from '@discordjs/voice'

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

    // Add requested song to the Guild queue
    queueManager.queue.push(query)

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

    
    await interation.reply('Trying to reproduce provided song')
    queueManager.play()
  }
}
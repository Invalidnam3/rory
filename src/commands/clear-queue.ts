import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { ExtendedClient } from '../utils/client'

export default {
  data: new SlashCommandBuilder()
    .setName('clear-queue')
    .setDescription('Clears the current queue of songs'),
  async execute(interation: ChatInputCommandInteraction) {
    const client: ExtendedClient = interation.client
    const queueManager = client.queues?.get(interation.guildId)
    queueManager.queue = []
    queueManager.audioPlayer.stop(true)
    await interation.reply('Queue has been cleared')
  }
}
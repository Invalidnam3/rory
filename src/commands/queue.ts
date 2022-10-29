import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ExtendedClient } from '../utils/client'

export default {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Display queue status'),
  async execute(interation: ChatInputCommandInteraction) {
    const client: ExtendedClient = interation.client
    const queue = client.queues.get(interation.guildId).queue

    if (queue.length === 0) {
      await interation.reply('Queue is empty')
      return
    }

    let queueMessage = '```' 
    for (let i = 0; i < queue.length; i++) {
      const songText = `${i+1}.${queue[i].title}\n`
      // If the new songText will overflow discord 2000 character limit, stop
      if (queueMessage.length + songText.length > 1996) continue
      queueMessage += songText
    }
    queueMessage += '```'
    // Discord 2000 characters limit
    if (queueMessage.length > 2000) queueMessage = queueMessage.slice(0, 1996) + '```'
    await interation.reply(queueMessage)
  }
}
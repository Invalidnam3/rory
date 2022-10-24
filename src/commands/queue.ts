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
      queueMessage += `${i+1}.${queue[i].title}\n`
    }
    queueMessage += '```'
    await interation.reply(queueMessage)
  }
}
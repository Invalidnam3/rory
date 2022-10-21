import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ExtendedClient } from '../utils/client'

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips current song'),
  async execute(interation: ChatInputCommandInteraction) {
    const client: ExtendedClient = interation.client
    const queueManager = client.queues.get(interation.guildId)
    const song = queueManager.queue[0]
    queueManager.skip()
    const message = song ?
      `Skipped ${song.title}` :
      'No song is currently playing'
    await interation.reply(message)
  }
}
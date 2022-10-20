import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ExtendedClient } from '../utils/client'

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips current song'),
  async execute(interation: ChatInputCommandInteraction) {
    const client: ExtendedClient = interation.client
    client.queues.get(interation.guildId).skip()
    await interation.reply('Skipped current song')
  }
}
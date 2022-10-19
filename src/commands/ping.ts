import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interation: ChatInputCommandInteraction) {
    await interation.reply('Pong!')
  }
}
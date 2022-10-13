import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  // Verify if this is the intended type
  async execute(interation: ChatInputCommandInteraction) {
    await interation.reply('Pong!')
  }
}
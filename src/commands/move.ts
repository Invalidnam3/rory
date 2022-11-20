import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { ExtendedClient } from '../utils/client'

export default {
  data: new SlashCommandBuilder()
    .setName('move')
    .setDescription('Moves Songs positions in the current Queue')
    .addNumberOption(option => 
      option
        .setName('from')
        .setDescription('from')
        // Don't allow user input to replace current playing song (YET)
        .setMinValue(2)
        .setRequired(true)
    )
    .addNumberOption(option => 
      option
        .setName('to')
        .setDescription('to')
        .setMinValue(1)
        .setRequired(true)
    )
  ,
  async execute(interation: ChatInputCommandInteraction) {
    const client: ExtendedClient = interation.client
    const queueManager = client.queues?.get(interation.guildId)
    const from = interation.options.getNumber('from')
    const to = interation.options.getNumber('to')
    console.log(from, to)
    //Translate Queue spot to array indexes
    queueManager.move(from-1, to-1)
    await interation.reply(
      `Song was moved from ${from} to ${to}`
    )
  }
}
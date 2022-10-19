import { SlashCommandBuilder } from "discord.js"

export interface Command {
  default: {
    data: SlashCommandBuilder
    execute: (message: any) => Promise<any>
  }
}


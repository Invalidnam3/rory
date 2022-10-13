import fs from 'node:fs'
import path from 'node:path'
import { REST, Routes } from 'discord.js'
import { config } from 'dotenv'

config()

const commands:any = []
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath)
  .filter(file =>  file.endsWith('.ts'))
  
console.log(path.join(__dirname, 'commands'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)
  console.log(command)
  commands.push(command.data.toJSON())
}

// @ts-ignore
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

// @ts-ignore
rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error)
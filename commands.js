import {REST, Routes, ApplicationCommandOptionType} from 'discord.js'
import 'dotenv/config'

const commands = [
    {
        name: 'ping',
        description: 'Check bot latency'
    },

    {
        name: 'merits',
        description: 'Check the standing of all factions'
    },

    {
        name: 'merit',
        description: 'Add points to a faction',
        options: [
            {
                name: 'faction',
                description: 'Faction to add points to',
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: 'Loch',
                        value: 'Loch'
                    },
                    {
                        name: 'Petrichor',
                        value: 'Petrichor'
                    },
                    {
                        name: 'Zircon',
                        value: 'Zircon'
                    },
                    {
                        name: 'Cosmos',
                        value: 'Cosmos'
                    }
                ]
            },
            {
                name: 'points',
                description: 'Amount of points to be added',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ]
    },

    {
        name: 'demerit',
        description: 'Subtract points from a faction',
        options: [
            {
                name: 'faction',
                description: 'Faction to add points to',
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: 'Loch',
                        value: 'Loch'
                    },
                    {
                        name: 'Petrichor',
                        value: 'Petrichor'
                    },
                    {
                        name: 'Zircon',
                        value: 'Zircon'
                    },
                    {
                        name: 'Cosmos',
                        value: 'Cosmos'
                    }
                ]
            },
            {
                name: 'points',
                description: 'Amount of points to be added',
                type: ApplicationCommandOptionType.Integer,
                required: true 
            }
        ]
    },
]

const rest = new REST({version: '10'}).setToken(process.env.TOKEN)

try {
    console.log('Started refreshing application (/) commands.');
  
    await rest.put(Routes.applicationCommands("1349427486290874398"), { body: commands });
  
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
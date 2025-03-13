import {Client, GatewayIntentBits, EmbedBuilder, Embed} from 'discord.js'
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lzqsvshyhbobnfrycmqv.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply("Bot latency returned with " + client.ws.ping + "ms")
    }

    if (interaction.commandName === 'merits') {
        await interaction.deferReply()
        const { data, error } = await supabase
            .from('merits')
            .select()

        let lochpoints = data.find(f => f.factionname === "Loch")?.points || 0;
        let petrpoints = data.find(f => f.factionname === "Petrichor")?.points || 0;
        let zircpoints = data.find(f => f.factionname === "Zircon")?.points || 0;
        let cosmpoints = data.find(f => f.factionname === "Cosmos")?.points || 0;

        let factions = {
            "Loch": lochpoints,
            "Petrichor": petrpoints,
            "Zircon": zircpoints,
            "Cosmos": cosmpoints
        };

        const factionColors = {
            "Loch": "#305CDE",
            "Petrichor": "#9B1C31",
            "Zircon": "#EFE0BB",
            "Cosmos": "#6C3BAA"
        };
        
        const hexToRgb = (hex) => {
            let bigint = parseInt(hex.substring(1), 16);
            return { 
                r: (bigint >> 16) & 255, 
                g: (bigint >> 8) & 255, 
                b: bigint & 255 
            };
        };
        
        const rgbToHex = (r, g, b) => {
            return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
        };
        
        const mixColors = (colors) => {
            let total = colors.length;
            let avgR = Math.round(colors.reduce((sum, c) => sum + c.r, 0) / total);
            let avgG = Math.round(colors.reduce((sum, c) => sum + c.g, 0) / total);
            let avgB = Math.round(colors.reduce((sum, c) => sum + c.b, 0) / total);
            return rgbToHex(avgR, avgG, avgB);
        };

        let highestFaction = data.reduce((max, faction) => 
            faction.points > max.points ? faction : max
        );        

        const willWeApplyHighest = () => {
            // Step 1: Find the highest points
            let maxPoints = Math.max(...data.map(f => f.points));

            // Step 2: Get all factions with the highest points
            let highestFactions = data.filter(f => f.points === maxPoints);

            // Step 3: If all four factions have the same points, return "No faction"
            if (highestFactions.length === data.length) {
                return "No faction";
            }

            // Step 4: Return faction names if there is a tie among some but not all
            return highestFactions.map(f => f.factionname).join(", ");
        }

        const highestFactionColor = () => {
            let maxPoints = Math.max(...data.map(f => f.points));
            let highestFactions = data.filter(f => f.points === maxPoints);

            if (highestFactions.length === data.length) return "#FFFFFF"; // All tied → white

            let colors = highestFactions.map(f => hexToRgb(factionColors[f.factionname]));
            return highestFactions.length > 1 ? mixColors(colors) : factionColors[highestFactions[0].factionname];
        }

        const embed = new EmbedBuilder()
            .setAuthor({
                name: "Bateau de L'âme des Rhams (Boat of the Soul of Rhams)",
            })
            .setTitle("Merits")
            .setDescription(`**${willWeApplyHighest()}** is in the lead!`)
            .addFields(
                {
                name: "Loch",
                value: lochpoints.toString(),
                inline: true
                },
                {
                name: "Petrichor",
                value: petrpoints.toString(),
                inline: true
                },
                {
                name: "Zircon",
                value: zircpoints.toString(),
                inline: true
                },
                {
                name: "Cosmos",
                value: cosmpoints.toString(),
                inline: true
                },
            )
            .setColor(highestFactionColor())
            .setFooter({
                text: "Les bénédictions de Rhams s'étendent à toute la consort",
            })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] })
    }

    if (interaction.commandName === 'merit') {
        if (interaction.member.roles.cache.some(r => r.name === "Arbor: House of Authority") === true) {
            const whatToIncrement = (name) => {
                const factionIds = {
                    "Loch": 2,
                    "Petrichor": 3,
                    "Zircon": 4,
                    "Cosmos": 5
                };
    
                return factionIds[name]
            }
            const { data, error } = await supabase
                .rpc('increment_counter', { p_id: whatToIncrement(interaction.options.getString('faction')), p_increment: interaction.options.getInteger('points') });
            await interaction.reply(`🎉 **${interaction.options.getInteger('points')} Merits** added to **${interaction.options.getString('faction')}**`)
        } else {await interaction.reply(`⛔ **You are not authorized to run this command!**`)}
    }

    if (interaction.commandName === 'demerit') {
        if (interaction.member.roles.cache.some(r => r.name === "Arbor: House of Authority") === true) {
            const whatToIncrement = (name) => {
                const factionIds = {
                    "Loch": 2,
                    "Petrichor": 3,
                    "Zircon": 4,
                    "Cosmos": 5
                };
    
                return factionIds[name]
            }
            const { data, error } = await supabase
                .rpc('anti_counter', { p_id: whatToIncrement(interaction.options.getString('faction')), p_increment: interaction.options.getInteger('points') });
            await interaction.reply(`❌ **${interaction.options.getInteger('points')} Demerits** to **${interaction.options.getString('faction')}**`)
        } else {await interaction.reply(` **You are not authorized to run this command!**`)}
    }
})

client.login(process.env.TOKEN);
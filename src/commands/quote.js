const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, time, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Creates a new quote'),
    async execute(interaction) {
        const fields = {
            body: new TextInputBuilder()
                .setCustomId('quoteBodyInput')
                .setLabel('Quote body: ')
                .setPlaceholder('"Four-score and seven years ago, I started making this bot lmao"')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true),
            name: new TextInputBuilder()
                .setCustomId('quoteNameInput')
                .setLabel('Quote name: ')
                .setPlaceholder('Malarix')
                .setStyle(TextInputStyle.Short)
                .setRequired(true),
            year: new TextInputBuilder()
                .setCustomId('quoteYearInput')
                .setLabel('Quote year: ')
                .setPlaceholder(new Date().getFullYear().toString())
                .setStyle(TextInputStyle.Short)
                .setMaxLength(4)
                .setMinLength(4)
                .setRequired(true)
        }

        const modal = new ModalBuilder()
            .setCustomId('quoteModal')
            .setTitle('Add a new quote');

        const firstActionRow = new ActionRowBuilder().addComponents(fields.body);
        const secondActionRow = new ActionRowBuilder().addComponents(fields.name);
        const thirdActionRow = new ActionRowBuilder().addComponents(fields.year);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        await interaction.showModal(modal);

        const submitted = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.user.id === interaction.user.id
        }).catch(error => {
            console.error(error)
            return null;
        })

        if(submitted) {
            const body = submitted.fields.getTextInputValue('quoteBodyInput');
            const name = submitted.fields.getTextInputValue('quoteNameInput');
            const year = submitted.fields.getTextInputValue('quoteYearInput');

            const quoteEmbed = new EmbedBuilder()
                .setColor('Red')
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: ' ', value: `>>> **${body}** \n` },
                    { name: ' ', value: `${name} - ${year}` },
                    { name: '\u200B', value: '\u200B' }
                )
                .setFooter({ text: submitted.user.tag, iconURL: submitted.user.displayAvatarURL() })
                .setTimestamp();

            //await submitted.reply({ embeds: [quoteEmbed] });
            await submitted.reply({ content: 'Quote successfully added!', ephemeral: true })
            await submitted.guild.channels.cache.get('1081809089199349774').send({ embeds: [quoteEmbed] });
        }
    }
}
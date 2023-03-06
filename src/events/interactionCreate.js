const { Events, InteractionType } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        //if(!interaction.isChatInputCommand) return;
        switch (interaction.type) {
            case(InteractionType.ApplicationCommand):
                const command = interaction.client.commands.get(interaction.commandName);

                if(!command) {
                    console.error(`No command matching ${interaction.commandName} was found.`)
                }
        
                try {
                    await command.execute(interaction);
                } catch(error) {
                    console.error(error);
                    await interaction.followUp({ content: 'An error occurred while executing this command.', ephemeral: true });
                }
            case(InteractionType.ModalSubmit):
                return;
            default:
                interaction.error();
        }
    }
}
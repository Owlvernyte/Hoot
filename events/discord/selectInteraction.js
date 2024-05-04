const { InteractionType, ComponentType } = require("discord-api-types/v10");
const ErrorEmbed = require("../../constants/embeds/ErrorEmbed");

module.exports = {
	name: "interactionCreate",
	async execute(interaction) {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is a select menu interaction (to prevent weird bugs)

		if (interaction.type !== InteractionType.MessageComponent) return;

		if (interaction.componentType !== ComponentType.SelectMenu) return;

		const command = client.selectCommands.get(interaction.customId);

		// If the interaction is not a command in cache, return error message.
		// You can modify the error message at ./messages/defaultSelectError.js file!

		if (!command) {
			await require("../../messages/defaultSelectError").execute(interaction);
			return;
		}

		// A try to execute the interaction.

		try {
			await command.execute(interaction);
			return;
		} catch (err) {
			console.error(
				`guildId=${interaction.guildId}/channelId=${interaction.channelId}/userId=${interaction.user.id}/cmdName=${interaction.commandName}&cmdType=${interaction.commandType}`,
				err
			);
			await interaction.reply({
				embeds: [
					new ErrorEmbed(
						"There was an issue while executing that select menu option!"
					),
				],
				ephemeral: true,
			});
			return;
		}
	},
};

const { InteractionType, ComponentType } = require("discord-api-types/v10");
const ErrorEmbed = require("../../constants/embeds/ErrorEmbed");

module.exports = {
	name: "interactionCreate",
	async execute(interaction) {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is a button interaction (to prevent weird bugs)

		if (interaction.type !== InteractionType.MessageComponent) return;

		if (interaction.componentType !== ComponentType.Button) return;

		const command = client.buttonCommands.get(interaction.customId);

		// If the interaction is not a command in cache, return error message.
		// You can modify the error message at ./messages/defaultButtonError.js file!

		if (!command) {
			await require("../../messages/defaultButtonError").execute(interaction);
			return;
		}

		if (command.inVoiceChannel && !interaction.member.voice.channel) {
			return interaction.reply({
				embeds: [new ErrorEmbed(`You must be in a voice channel!`)],
				ephemeral: true,
			});
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
					new ErrorEmbed(err?.message || `There was an issue while executing that button!`),
				],
				ephemeral: true,
			});
			return;
		}
	},
};

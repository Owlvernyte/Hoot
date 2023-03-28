const {
	InteractionType,
	ApplicationCommandType,
} = require("discord-api-types/v10");
const ErrorEmbed = require("../../constants/embeds/ErrorEmbed");

module.exports = {
	name: "interactionCreate",
	async execute(interaction) {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is a command (to prevent weird bugs)

		if (interaction.type !== InteractionType.ApplicationCommand) return;

		if (interaction.commandType !== ApplicationCommandType.ChatInput) return;

		const command = client.slashCommands.get(interaction.commandName);

		// If the interaction is not a command in cache.

		if (!command) return;

		// A try to executes the interaction.

		if (command.inVoiceChannel && !interaction.member.voice.channel) {
			return interaction.reply({
				embeds: [new ErrorEmbed(`You must be in a voice channel!`)],
				ephemeral: true,
			});
		}

		if (command.queueRequired) {
			const queue = client.distube.getQueue(interaction.guildId);
			if (!queue)
				return interaction.reply({
					embeds: [new ErrorEmbed("There is nothing playing!")],
					ephemeral: true,
				});
		}

		try {
			await command.execute(interaction);
		} catch (err) {
			console.error(
				`guildId=${interaction.guildId}/channelId=${interaction.channelId}/userId=${interaction.user.id}/cmdName=${interaction.commandName}&cmdType=${interaction.commandType}`,
				err
			);
			if (interaction.isRepliable() && !interaction.replied)
				await interaction
					.reply({
						embeds: [
							new ErrorEmbed(
								err.message ||
									"There was an issue while executing that command!"
							),
						],
						ephemeral: true,
					})
					.catch(console.error);
		}
	},
};

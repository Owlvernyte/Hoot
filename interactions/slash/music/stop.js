// Deconstructed the constants we need in this file.

const { SlashCommandBuilder } = require("@discordjs/builders");
const ErrorEmbed = require("../../../constants/embeds/ErrorEmbed");
const SuccessEmbed = require("../../../constants/embeds/SuccessEmbed");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("Stop the queue"),
	inVoiceChannel: true,
	category: "music",
	async execute(interaction) {
		const { client, message, guild } = interaction;

		const queue = client.distube.getQueue(guild);

		if (!queue)
			return interaction.reply({
				embeds: [new ErrorEmbed("There is nothing playing!")],
				ephemeral: true,
			});

		queue.stop();

		interaction.reply({
			embeds: [
				new SuccessEmbed("Stopped the queue!"),
			],
		});
	},
};

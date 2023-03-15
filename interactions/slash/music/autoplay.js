// Deconstructed the constants we need in this file.

const { SlashCommandBuilder } = require("@discordjs/builders");
const ErrorEmbed = require("../../../constants/embeds/ErrorEmbed");
const InfoEmbed = require("../../../constants/embeds/InfoEmbed");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("autoplay")
		.setDescription("Toggle autoplay mode"),
	category: "music",
	inVoiceChannel: true,

	async execute(interaction) {
		const { client, message, guild } = interaction;

		const queue = client.distube.getQueue(guild);

		if (!queue)
			return interaction.reply({
				embeds: [new ErrorEmbed("There is nothing playing!")],
				ephemeral: true,
			});

		const autoplay = queue.toggleAutoplay();

		interaction.reply({
			embeds: [new InfoEmbed(`Autoplay: ${autoplay ? "On" : "Off"}`)],
		});
	},
	async server(queue) {
		const autoplay = queue.toggleAutoplay();

		return {
			on: autoplay,
		};
	},
};

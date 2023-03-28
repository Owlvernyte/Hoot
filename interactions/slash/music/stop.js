// Deconstructed the constants we need in this file.

const { SlashCommandBuilder } = require("@discordjs/builders");
const SuccessEmbed = require("../../../constants/embeds/SuccessEmbed");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("Stop the queue"),
	inVoiceChannel: true,
	category: "music",
	queueRequired: true,
	async execute(interaction) {
		const { client, guild } = interaction;

		const queue = client.distube.getQueue(guild);

		queue.stop();

		interaction.reply({
			embeds: [
				new SuccessEmbed("Stopped the queue!"),
			],
		});
	},
};

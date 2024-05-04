// Deconstructed the constants we need in this file.

const { SlashCommandBuilder } = require("@discordjs/builders");
const SuccessEmbed = require("../../../constants/embeds/SuccessEmbed");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("leave")
		.setDescription("Leave the current voice"),
	inVoiceChannel: true,
	category: "music",
	queueRequired: true,
	async execute(interaction) {
		const { client, message, guild } = interaction;

		const queue = client.distube.getQueue(guild);

		if (queue.starter.user.id != interaction.user.id)
			throw new Error(`You have no right to do this!`);

		client.distube.voices.leave(guild);

		interaction.reply({
			embeds: [new SuccessEmbed(`See yah!`)],
		});
	},
};

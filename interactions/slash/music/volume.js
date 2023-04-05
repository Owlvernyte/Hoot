// Deconstructed the constants we need in this file.

const { SlashCommandBuilder } = require("@discordjs/builders");
const SuccessEmbed = require("../../../constants/embeds/SuccessEmbed");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("volume")
		.setDescription("Seek to a position of song")
		.addIntegerOption((option) =>
			option
				.setName("amount")
				.setDescription("Position in seconds")
				.setMinValue(0)
				.setMaxValue(100)
				.setRequired(true)
		),
	inVoiceChannel: true,
	category: "music",
	queueRequired: true,
	async execute(interaction) {
		const { client, message, guild } = interaction;

		const queue = client.distube.getQueue(guild);

		const amount = interaction.options.getInteger("amount");

		queue.setVolume(amount);

		interaction.reply({
			embeds: [
				new SuccessEmbed(`Volume set to \`${amount}\``),
			],
		});

        client.emit("updatePanel", interaction);
	},
};

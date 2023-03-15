// Deconstructed the constants we need in this file.

const { SlashCommandBuilder } = require("@discordjs/builders");
const SuccessEmbed = require("../../../constants/embeds/SuccessEmbed");
const ErrorEmbed = require("../../../constants/embeds/ErrorEmbed");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("Pause the queue"),
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

		if (queue.paused) {
			queue.resume();
			return interaction.reply({
				embeds: [
					new SuccessEmbed("Resumed the song!").setAuthor({
						name: `${interaction.user.tag}`,
						iconURL: `${interaction.user.displayAvatarURL()}`,
					}),
				],
			});
		}

		queue.pause();

		interaction.reply({
			embeds: [new ErrorEmbed("Paused the song!")],
		});
	},
};

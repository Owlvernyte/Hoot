// Deconstructed the constants we need in this file.

const { SlashCommandBuilder } = require("@discordjs/builders");
const ErrorEmbed = require("../../../constants/embeds/ErrorEmbed");
const SuccessEmbed = require("../../../constants/embeds/SuccessEmbed");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("remove")
		.setDescription("Remove a song from queue")
		.addIntegerOption((option) =>
			option
				.setName("position")
				.setMinValue(1)
				.setDescription("Song position")
				.setRequired(true)
		),
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

		const position = interaction.options.getInteger("position");

		if (position > queue.songs.length - 1)
			return interaction.reply({
				embeds: [
					new ErrorEmbed(
						`The position you entered (\`${position}\`) is bigger than the queue length (\`${
							queue.songs.length - 1
						}\`)`
					),
				],
				ephemeral: true,
			});

		const removed = queue.songs.splice(position, 1).shift();

		interaction.reply({
			embeds: [
				new SuccessEmbed(
					`Removed [\`${removed.name}\`](${removed.url}) from the queue`
				),
			],
		});
	},
};

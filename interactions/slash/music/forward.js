// Deconstructed the constants we need in this file.

const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("forward")
		.setDescription("Forward to time of a song")
		.addIntegerOption((option) =>
			option
				.setName("time")
				.setMinValue(0)
				.setDescription("Time in seconds")
				.setRequired(true)
		),
	inVoiceChannel: true,
	category: "music",
	async execute(interaction) {
		const { client, message, guild } = interaction;

		const queue = client.distube.getQueue(guild);

		if (!queue)
			return interaction.reply({
				content: `${client.emotes.error} | There is nothing playing!`,
				ephemeral: true,
			});

		const time = interaction.options.getInteger("time");
		const seekedTime = queue.currentTime + time;

		if (seekedTime > queue.songs[0].duration)
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setDescription(
							`The time you entered (\`${time}s\`) is not suitable!`
						),
				],
				ephemeral: true,
			});

		queue.seek(seekedTime);

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor("Random")
					.setDescription(`Forwarded the song for \`${time}s\`!`),
			],
		});
	},
};

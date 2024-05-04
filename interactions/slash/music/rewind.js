// Deconstructed the constants we need in this file.

const { SlashCommandBuilder } = require("@discordjs/builders");
const SuccessEmbed = require("../../../constants/embeds/SuccessEmbed");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("rewind")
		.setDescription("Rewind to time of a song")
		.addIntegerOption((option) =>
			option
				.setName("time")
				.setMinValue(0)
				.setDescription("Time in seconds")
				.setRequired(true)
		),
	inVoiceChannel: true,
	category: "music",
	queueRequired: true,
	async execute(interaction) {
		const { client, message, guild } = interaction;

		const queue = client.distube.getQueue(guild);

        if (queue.starter.user.id != interaction.user.id)
			throw new Error(`You have no right to do this!`);

		const time = interaction.options.getInteger("time");
		const seekedTime = queue.currentTime - time;

		if (seekedTime > queue.songs[0].duration || seekedTime < 0)
			throw new Error(`The time you entered (\`${time}s\`) is not suitable!`);

		queue.seek(seekedTime);

		interaction.reply({
			embeds: [new SuccessEmbed(`Rewinded the song for \`${time}s\`!`)],
		});
	},
};

const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play music")
		.addStringOption((option) =>
			option
				.setName("song")
				.setDescription("Song name or URL")
				.setAutocomplete(true)
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName("position")
				.setDescription("Select the position you want to add to the queue")
				.setMinValue(1)
		)
		.addBooleanOption((option) =>
			option
				.setName("skip")
				.setDescription("Whether to skip the current song or not")
		),
	inVoiceChannel: true,
	checkFocused: true,
	category: "music",
	async execute(interaction) {
		const { client, guild } = interaction;
		await interaction.deferReply()
		const songName = interaction.options.getString("song");
		const skip = interaction.options.getBoolean("skip") || false;
		let position = interaction.options.getInteger("position") || 0;
		const voiceChannel = interaction.member.voice.channel;

		client.distube.play(voiceChannel, songName, {
			member: interaction.member,
			textChannel: interaction.channel,
			skip: skip,
			position: position,
			metadata: {
				i: interaction,
			},
		});
        return;
	},
	async autocomplete(interaction) {
		const { client, guild } = interaction;

		const focusedValue = interaction.options.getFocused();
		// console.log(focusedValue);
		const searchResults =
			(await client.distube.search(focusedValue).catch(() => [])) || [];

		await interaction.respond(
			searchResults.map((result) => ({
				name: `${result.name}`,
				value: `${result.url}`,
			}))
		);
	},
};

const lyricsFinder = require("lyrics-finder");
const _ = require("lodash");
const { EmbedBuilder } = require("discord.js");
const pageModule = require("../../../modules/util/page");

module.exports = {
	id: "lyrics",

	async execute(interaction) {
		const { client, guild, message } = interaction;
		await interaction.deferReply({ ephemeral: true });

		let song = message.embeds[0].title.toLowerCase();

		song = song.replace(
			/lyrics|lyric|lyrical|official music video|\(official music video\)|audio|official|official video|official video hd|official hd video|offical video music|\(offical video music\)|extended|hd|:|(\[.+\])/gi,
			""
		);

		let lyrics = await lyricsFinder(song);

		if (!lyrics) throw new Error(`No lyrics found for \`${song}\`!`);

		lyrics = lyrics.split("\n");
		let splitedLyrics = _.chunk(lyrics, 40);

		let pages = splitedLyrics.map((ly) =>
			new EmbedBuilder()
				.setTitle(`Lyrics for: ${song}`)
				.setColor("Random")
				.setDescription(ly.join("\n"))
		);

		if (!pages.length) throw new Error(`No lyrics found for \`${song}\`!`);

		if (pages.length < 2)
			return interaction.editReply({
				embeds: pages,
			});
		else {
			const filter = (i) => i.user.id == interaction.user.id;
			pageModule(interaction, pages, 60000, true, filter, true);
		}
	},
};

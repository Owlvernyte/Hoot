const { EmbedBuilder } = require("discord.js");


/**
 *
 * @param {import("distube").Song[]} songs - The songs in the queue.
 * @param {string} name - The name of the playlist.
 * @returns
 */
module.exports = (songs, name) => [
	new EmbedBuilder()
		.setColor("Random")
		.setTitle(`${name}`)
		.setDescription(`${songs.length ? `${songs.length}/100 songs` : "Empty"}`),
];
/**
 * const color = name === "Favorite" ? "Red" : "Random";

	if (!songs.length)
		return [
			new EmbedBuilder()
				.setColor(color)
				.setTitle(name)
				.setDescription("`Empty`")
				.setFooter({
					text: `${songs.length} songs`,
				}),
		];

	const tempSongs = [...songs];

	const playlist = await distube.createCustomPlaylist(tempSongs, {
		properties: { name: `${name}` },
		parallel: true,
	});

	const playlistSongs = playlist.map(
		(song, i) =>
			`${`\`${i + 1}\`. [${song.name}](${song.url}) - \`${
				song.formattedDuration
			}\``}`
	);

	const splittedPlaylistSongs = _.chunk(playlistSongs, 10);

	const pages = splittedPlaylistSongs.map((c) =>
		new EmbedBuilder()
			.setTitle(`${playlist.name}`)
			.setDescription(`${c.join("\n")}`)
			.setColor(color)
	);

	return [pages];
 */

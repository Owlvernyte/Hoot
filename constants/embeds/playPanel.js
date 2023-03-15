const { EmbedBuilder } = require("discord.js");
/**
 *
 * @param {import ("distube").Song} song
 * @param {import ("distube").Queue} queue
 * @param {import('discord.js').Client} client
 * @returns
 */
module.exports = (song, queue, client) => [
	new EmbedBuilder()
		.setColor(queue.paused ? "Red" : "Random")
		.setAuthor({
			name: `${song.user.tag}`,
			iconURL: `${song.user.displayAvatarURL()}`,
		})
		.setTitle(`${song.name} - ${song.formattedDuration}`)
		.setURL(song.url)
		.setThumbnail(song.thumbnail)
		.setFooter({
			text: `${
				queue.starter.user.tag
			} | ${client.status(queue)}`,
            iconURL: `${queue.starter.user.displayAvatarURL()}`
		}),
];

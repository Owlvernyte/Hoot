const { EmbedBuilder } = require("discord.js");
const getQueueStatus = require("../../modules/util/getQueueStatus");
/**
 *
 * @param {import ("distube").Song} song - The song in the queue.
 * @param {import ("distube").Queue} queue - The queue object from the distube library.
 * @param {import('discord.js').Client} client - The Discord client object.
 * @returns
 */
module.exports = (song, queue, client) => {
	const { autoplay, filter, loop, volume } = getQueueStatus(queue);
	const firstLine = [`⌛ **${song.formattedDuration}**`, volume, loop, filter]
		.filter((x) => !!x.length)
		.join(" | ");
	return [
		new EmbedBuilder()
			.setColor(queue.paused ? "Red" : "Random")
			.setAuthor({
				name: `${song.user.tag}`,
				iconURL: `${song.user.displayAvatarURL()}`,
			})
			.setTitle(`${song.name}`)
			.setURL(song.url)
			.setThumbnail(song.thumbnail)
			.setDescription(`${firstLine}\n\n${autoplay}`)
			.setFooter({
				text: `${queue.starter.user.tag} 💂‍♂️`,
				iconURL: `${queue.starter.user.displayAvatarURL()}`,
			}),
	];
};

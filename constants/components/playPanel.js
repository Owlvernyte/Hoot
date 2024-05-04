const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

/**
 * Returns an array of ActionRowBuilder objects that contain the buttons for the playback controls.
 *
 * @param {boolean} state - The state of the buttons.
 * @param {import("distube").Queue} queue - The queue object from the distube library.
 * @param {import("discord.js").Client} client - The Discord client object.
 * @return {import("discord.js").ActionRowData<import("discord.js").ButtonBuilder>[]} An array of ActionRowBuilder objects that contain the buttons for the playback controls.
 */
module.exports = (state, queue, client) => [
	new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId("pause")
			.setDisabled(state)
			.setEmoji(client.emotes.playorpause)
			.setStyle(queue.paused ? ButtonStyle.Danger : ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("next-track")
			.setDisabled(state)
			.setEmoji(client.emotes.next)
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("volumeup")
			.setDisabled(queue.volume >= 100 ? true : state)
			.setEmoji(client.emotes.volume.high)
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("shuffle")
			.setDisabled(state)
			.setEmoji(client.emotes.shuffle)
			.setStyle(ButtonStyle.Secondary)
		// new ButtonBuilder()
		// 	.setCustomId("addtopl")
		// 	.setDisabled(state)
		// 	.setEmoji(client.emotes.addtoplaylist)
		// 	.setStyle(ButtonStyle.Primary)
	),
	new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId("autoplay")
			.setDisabled(state)
			.setEmoji("🅰")
			.setStyle(queue.autoplay ? ButtonStyle.Success : ButtonStyle.Danger),
		new ButtonBuilder()
			.setCustomId("pre-track")
			.setDisabled(state)
			.setEmoji(client.emotes.previous)
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("volumedown")
			.setDisabled(queue.volume <= 0 ? true : state)
			.setEmoji(client.emotes.volume.medium)
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("loop")
			.setDisabled(state)
			.setEmoji(
				queue.repeatMode
					? queue.repeatMode === 2
						? client.emotes.loop.queue
						: client.emotes.loop.song
					: client.emotes.loop.queue
			)
			.setStyle(queue.repeatMode ? ButtonStyle.Secondary : ButtonStyle.Danger)
		// new ButtonBuilder()
		// 	.setCustomId("lyrics")
		// 	.setDisabled(state)
		// 	.setEmoji(client.emotes.lyrics)
		// 	.setStyle(ButtonStyle.Secondary)
	),
];

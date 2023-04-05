// const { EmbedBuilder } = require("discord.js");

module.exports = {
	id: "pause",

	async execute(interaction) {
		const { client, guild } = interaction;

		const queue = client.distube.getQueue(guild);

		if (!queue) throw new Error("There is nothing playing!");

		if (
			!queue.starter ||
			queue.starter.id !== interaction.user.id ||
			!queue.panelId ||
			interaction.message.id !== queue.panelId
		)
			throw new Error(`You don't own this panel!`);

		// console.log(queue);

		if (queue.paused) {
			queue.resume();
		} else {
			queue.pause();
		}

		client.emit("updatePanel", interaction);
	},
};

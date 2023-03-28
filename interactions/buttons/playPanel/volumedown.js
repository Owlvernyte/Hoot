module.exports = {
	id: "volumedown",

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

		if (queue.volume <= 0)
			throw new Error(`Cannot down volume anymore!`)

		queue.setVolume(queue.volume - 10);

		client.emit("updatePanel", interaction, queue);
		return;
	},
};

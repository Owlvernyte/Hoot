module.exports = {
	id: "autoplay",
	/**
	 *
	 * @param {*} interaction
	 * @returns
	 */
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

		queue.toggleAutoplay();

		client.emit("updatePanel", interaction);
		return;
	},
};

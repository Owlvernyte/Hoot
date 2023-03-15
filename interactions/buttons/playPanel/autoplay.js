const ErrorEmbed = require("../../../constants/embeds/ErrorEmbed");

module.exports = {
	id: "autoplay",

	async execute(interaction) {
		const { client, guild } = interaction;
		const queue = client.distube.getQueue(guild);

		if (!queue)
			return interaction.reply({
				embeds: [new ErrorEmbed("There is nothing playing!")],
				ephemeral: true,
			});

		if (
			!queue.starter ||
			queue.starter.id !== interaction.user.id ||
			!queue.panelId ||
			interaction.message.id !== queue.panelId
		)
			return interaction.reply({
				embeds: [new ErrorEmbed(`You don't own this panel!`)],
				ephemeral: true,
			});

		queue.toggleAutoplay();

		client.emit("updatePanel", interaction, queue);
		return;
	},
};

const ErrorEmbed = require("../../../constants/embeds/ErrorEmbed");

module.exports = {
	id: "volumeup",

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

		if (queue.volume >= 100)
			return interaction.reply({
				embeds: [new ErrorEmbed(`Cannot up volume anymore!`)],
				ephemeral: true,
			});

		queue.setVolume(queue.volume + 10);

		client.emit("updatePanel", interaction, queue);
		return;
	},
};

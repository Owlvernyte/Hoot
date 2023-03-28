const { EmbedBuilder } = require("discord.js");

const SuccessEmbed = require("../../../constants/embeds/SuccessEmbed");

module.exports = {
	id: "shuffle",

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

		queue.shuffle();

		interaction.reply({
			embeds: [
				new SuccessEmbed("Shuffled songs in queue!").setAuthor({
					name: `${interaction.user.tag}`,
					iconURL: `${interaction.user.displayAvatarURL()}`,
				}),
			],
		});
		return;
	},
};

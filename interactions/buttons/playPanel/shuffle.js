const { EmbedBuilder } = require("discord.js");
const ErrorEmbed = require("../../../constants/embeds/ErrorEmbed");
const SuccessEmbed = require("../../../constants/embeds/SuccessEmbed");

module.exports = {
	id: "shuffle",

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

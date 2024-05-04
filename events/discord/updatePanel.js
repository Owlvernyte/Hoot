const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
	name: "updatePanel",
	/**
	 *
	 * @param {import('discord.js').Interaction} interaction
	 */
	async execute(interaction) {
		const { client, guild } = interaction;
		const queue = client.distube.getQueue(guild);

		const Embed = require("../../constants/embeds/playPanel")(
			queue.songs[0],
			queue,
			client
		);

		const components = require("../../constants/components/playPanel")(
			false,
			queue,
			client
		);

        if (!interaction.isRepliable() || interaction.replied) return;

        if (interaction.isButton()) {
            await interaction.update({
				embeds: Embed,
				components: components,
			});
            return;
        }

		if (interaction.isChatInputCommand()) {
			const panelMessage = await queue.textChannel.messages.fetch(
				queue.panelId
			);
			await panelMessage.edit({
				embeds: Embed,
				components: components,
			});
            return;
		}
	},
};

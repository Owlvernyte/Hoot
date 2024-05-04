/**
 * @file Default Error Message On Error Button Interaction
 * @author Naman Vrati
 * @since 3.0.0
 */

const ErrorEmbed = require("../constants/embeds/ErrorEmbed");

module.exports = {
	/**
	 * @description Executes when the button interaction could not be fetched.
	 * @author Naman Vrati
	 * @param {import('discord.js').ButtonInteraction} interaction The Interaction Object of the command.
	 */

	async execute(interaction) {
		await interaction.reply({
			embeds: [
				new ErrorEmbed("There was an issue while fetching this button!"),
			],
			ephemeral: true,
		});
		return;
	},
};

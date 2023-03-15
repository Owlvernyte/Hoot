/**
 * @file Default Error Message On Error Select Menu Interaction
 * @author Naman Vrati
 * @since 3.0.0
 */

const ErrorEmbed = require("../constants/embeds/ErrorEmbed");

module.exports = {
	/**
	 * @description Executes when the select menu interaction could not be fetched.
	 * @author Naman Vrati
	 * @param {import('discord.js').SelectMenuInteraction} interaction The Interaction Object of the command.
	 */

	async execute(interaction) {
		await interaction.reply({
			embeds: [
				new ErrorEmbed(
					"There was an issue while fetching this select menu option!"
				),
			],
			ephemeral: true,
		});
		return;
	},
};

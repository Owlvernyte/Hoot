const { EmbedBuilder } = require("discord.js");
const { emoji } = require("../../config.json");

class ErrorEmbed extends EmbedBuilder {
	/**
	 *
	 * @param {string | null} description
	 */
	constructor(description) {
		super();
		this.setColor("Red");
		this.setDescription(`${emoji.error} | ${description}`);
	}
}

module.exports = ErrorEmbed;

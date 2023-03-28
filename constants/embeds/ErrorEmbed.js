const { EmbedBuilder } = require("discord.js");
const { error } = require("../../emojies.json");

class ErrorEmbed extends EmbedBuilder {
	/**
	 *
	 * @param {string | null} description
	 */
	constructor(description) {
		super();
		this.setColor("Red");
		this.setDescription(`${error} | ${description}`);
	}
}

module.exports = ErrorEmbed;

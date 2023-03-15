const { EmbedBuilder } = require("discord.js");
const { emoji } = require("../../config.json");

class WarningEmbed extends EmbedBuilder {
    /**
     *
     * @param {string | null} description
     */
	constructor(description) {
		super();
		this.setColor("Orange");
		this.setDescription(`${emoji.warning} | ${description}`);
	}
}

module.exports = WarningEmbed;

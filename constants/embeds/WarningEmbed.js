const { EmbedBuilder } = require("discord.js");
const { warning } = require("../../emojies.json");

class WarningEmbed extends EmbedBuilder {
    /**
     *
     * @param {string | null} description
     */
	constructor(description) {
		super();
		this.setColor("Orange");
		this.setDescription(`${warning} | ${description}`);
	}
}

module.exports = WarningEmbed;

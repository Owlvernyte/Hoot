const { EmbedBuilder } = require("discord.js");
const { emoji } = require("../../config.json");

class SuccessEmbed extends EmbedBuilder {
    /**
     *
     * @param {string | null} description
     */
	constructor(description) {
		super();
		this.setColor("Green");
		this.setDescription(`${emoji.success} | ${description}`);
	}
}

module.exports = SuccessEmbed;

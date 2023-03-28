const { EmbedBuilder } = require("discord.js");
const { success } = require("../../emojies.json");

class SuccessEmbed extends EmbedBuilder {
    /**
     *
     * @param {string | null} description
     */
	constructor(description) {
		super();
		this.setColor("Green");
		this.setDescription(`${success} | ${description}`);
	}
}

module.exports = SuccessEmbed;

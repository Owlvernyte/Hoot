const { EmbedBuilder } = require("discord.js");
const { emoji } = require("../../config.json");

class WarningEmbed extends EmbedBuilder {
	constructor(description) {
		super();
		this.setColor("Orange");
		this.setDescription(`${emoji.warning} | ${description}`);
	}
}

module.exports = WarningEmbed;

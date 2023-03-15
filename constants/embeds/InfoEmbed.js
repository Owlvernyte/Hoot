const { EmbedBuilder } = require("discord.js");

class InfoEmbed extends EmbedBuilder {
    /**
     * 
     * @param {string | null} description 
     */
	constructor(description) {
		super();
		this.setColor("Blurple");
		this.setDescription(`ℹ | ${description}`);
	}
}

module.exports = InfoEmbed;

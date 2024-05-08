import { EmbedBuilder } from 'discord.js';
import { info } from '../../lib/emojies.json';

export class InfoEmbed extends EmbedBuilder {
	constructor(description: string, noIcon: boolean = false) {
		super();
		this.setColor('Blurple');
		if (!noIcon) {
			description = `${info} | ${description}`;
		}
		this.setDescription(description);
	}
}

import { EmbedBuilder } from 'discord.js';
import { warning } from '../../lib/emojies.json';

export class WarningEmbed extends EmbedBuilder {
	constructor(description: string, noIcon: boolean = false) {
		super();
		this.setColor('Orange');
		if (!noIcon) {
			description = `${warning} | ${description}`;
		}
		this.setDescription(description);
	}
}

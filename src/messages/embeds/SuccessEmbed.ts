import { EmbedBuilder } from 'discord.js';
import { success } from '../../lib/emojies.json';

export class SuccessEmbed extends EmbedBuilder {
	constructor(description: string, noIcon: boolean = false) {
		super();
		this.setColor('Green');
		if (!noIcon) {
			description = `${success} | ${description}`;
		}
		this.setDescription(description);
	}
}

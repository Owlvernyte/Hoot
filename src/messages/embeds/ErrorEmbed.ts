import { EmbedBuilder } from 'discord.js';
import { error } from '../../lib/emojies.json';

export class ErrorEmbed extends EmbedBuilder {
	constructor(description: string, noIcon: boolean = false) {
		super();
		this.setColor('Red');
		if (!noIcon) {
			description = `${error} | ${description}`;
		}
		this.setDescription(description);
	}
}

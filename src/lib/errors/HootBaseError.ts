import { Interaction } from 'discord.js';
import { ErrorEmbed } from '../../messages';

export class HootBaseError extends Error {
	constructor(
		message: any,
		public interaction?: Interaction
	) {
		super(message);
		this._reply();
	}

	private async _reply() {
		if (!this.interaction) return;

		if (!this.interaction.isRepliable()) return;

		if (this.interaction.replied) {
			await this.interaction.editReply({
				embeds: [new ErrorEmbed(this.message)]
			});
		} else {
			await this.interaction.reply({
				embeds: [new ErrorEmbed(this.message)],
				ephemeral: true
			});
		}
	}
}

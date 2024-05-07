import { Precondition } from '@sapphire/framework';
import type { ChatInputCommandInteraction, ContextMenuCommandInteraction, Guild, Message } from 'discord.js';

export class UserPrecondition extends Precondition {
	#message = 'There is nothing playing!';
	public override messageRun(message: Message) {
		return this.checkGuildHasQueue(message.guild);
	}

	public override chatInputRun(interaction: ChatInputCommandInteraction) {
		return this.checkGuildHasQueue(interaction.guild);
	}

	public override contextMenuRun(interaction: ContextMenuCommandInteraction) {
		return this.checkGuildHasQueue(interaction.guild);
	}

	private async checkGuildHasQueue(guild: Guild | null) {
		if (!guild) return this.error({ message: this.#message });
		const queue = await this.container.distube.getQueue(guild.id);
		return queue ? this.ok() : this.error({ message: this.#message });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		InQueue: never;
	}
}

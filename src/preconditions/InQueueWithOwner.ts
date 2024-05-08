import { Precondition } from '@sapphire/framework';
import type { ChatInputCommandInteraction, ContextMenuCommandInteraction, Message, Snowflake } from 'discord.js';
import { Guild } from 'discord.js';

export class InQueueWithOwnerPrecondition extends Precondition {
	#message = 'Only the owner of the queue can use this!';
	public override messageRun(message: Message) {
		return this.doCheck(message.guild, message.author.id);
	}

	public override chatInputRun(interaction: ChatInputCommandInteraction) {
		return this.doCheck(interaction.guild, interaction.user.id);
	}

	public override contextMenuRun(interaction: ContextMenuCommandInteraction) {
		return this.doCheck(interaction.guild, interaction.user.id);
	}

	private async doCheck(guild: Guild | null, userId: Snowflake) {
		if (!guild) return this.error({ message: this.#message });
		const queue = await this.container.distube.getQueue(guild.id);
		return queue?.owner?.user.id === userId ? this.ok() : this.error({ message: this.#message });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		InQueueWithOwner: never;
	}
}

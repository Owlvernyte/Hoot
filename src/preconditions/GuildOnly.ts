import { AllFlowsPrecondition } from '@sapphire/framework';
import type { ChatInputCommandInteraction, ContextMenuCommandInteraction, Message } from 'discord.js';

export class UserPrecondition extends AllFlowsPrecondition {
	#message: string = 'This command can only be used in guilds!';

	public override messageRun(message: Message) {
		return message.inGuild() ? this.ok() : this.error({ message: this.#message });
	}

	public override chatInputRun(interaction: ChatInputCommandInteraction) {
		return interaction.inGuild() ? this.ok() : this.error({ message: this.#message });
	}

	public override contextMenuRun(interaction: ContextMenuCommandInteraction) {
		return interaction.inGuild() ? this.ok() : this.error({ message: this.#message });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		GuildOnly: never;
	}
}

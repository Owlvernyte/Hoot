import { Precondition } from '@sapphire/framework';
import type { ChatInputCommandInteraction, GuildMember } from 'discord.js';

export class UserPrecondition extends Precondition {
	#message = 'This command can only be used in a voice channel.';

	public override chatInputRun(interaction: ChatInputCommandInteraction) {
		const member = interaction.member as GuildMember | undefined;
		if (!member) return this.error({ message: this.#message });

		return member.voice.channel != null && member.voice.channel.isVoiceBased() && !member.voice.channel.isDMBased() ? this.ok() : this.error({ message: this.#message });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		InVoice: never;
	}
}

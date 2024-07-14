import { Collection, GuildMember, Interaction, Snowflake, User } from 'discord.js';
import { GuildIdResolvable } from 'distube';
import { HootQueue } from '../distube/HootQueue';

declare module '@sapphire/pieces' {
	interface Container {
		distube: import('distube').DisTube;
		youtubePlugin: import('@distube/youtube').YouTubePlugin;
	}
}

declare module '@sapphire/framework' {
	interface Container {
		distube: import('distube').DisTube;
	}
}

declare module 'distube' {
	interface DisTube {
		getQueue(guild: GuildIdResolvable): HootQueue | undefined;
		updatePanel(interaction: Interaction): Promise<void>;
	}

	interface Queue {
		owner?: GuildMember;
		skipVotes: Collection<Snowflake, GuildMember | User>;
		backVotes: Collection<Snowflake, GuildMember | User>;
		panelId?: Snowflake;
	}
}

export type QueueMetadata = {
	queueStarter?: GuildMember;
	i?: import('discord.js').Interaction;
};

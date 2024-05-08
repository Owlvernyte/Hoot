import { ApplicationCommandRegistries, SapphireClient, container } from '@sapphire/framework';
import { ClientOptions } from 'discord.js';
import { DisTube, DisTubeOptions } from 'distube';

const dev = process.env.NODE_ENV !== 'production';

export class HootClient extends SapphireClient {
	distube: DisTube;

	constructor(
		options: ClientOptions,
		distubeOptions: DisTubeOptions = {
			leaveOnStop: false,
			plugins: []
		}
	) {
		super(options);
		const distube = new DisTube(this, distubeOptions);
		this.distube = distube;
		container.distube = distube;

		ApplicationCommandRegistries.setDefaultGuildIds(dev ? [process.env.DEV_GUILD_ID] : undefined);
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		distube: import('distube').DisTube;
	}
}

declare module 'distube' {
	interface DisTube {
		getQueue(guildId: import('discord.js').Snowflake): import('./distube/HootQueue').HootQueue | undefined;
	}
}

export type QueueMetadata = {
	queueStarter?: import('discord.js').GuildMember | import('discord.js').User;
	i?: import('discord.js').Interaction;
};

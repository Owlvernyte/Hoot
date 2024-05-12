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

		dev && ApplicationCommandRegistries.setDefaultGuildIds([process.env.DEV_GUILD_ID]);

        for (const command of container.stores.get('commands').values()) {
            command.applicationCommandRegistry.registerChatInputCommand((b) => b.setDMPermission(false));
        }

		ApplicationCommandRegistries.registries.forEach((r) => r.registerChatInputCommand((b) => b.setDMPermission(false)));
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

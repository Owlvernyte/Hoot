import { ApplicationCommandRegistries, SapphireClient, container } from '@sapphire/framework';
import { ClientOptions } from 'discord.js';
import { DisTube, DisTubeOptions } from 'distube';

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

		ApplicationCommandRegistries.setDefaultGuildIds(process.env.NODE_ENV === 'development' ? [process.env.DEV_GUILD_ID] : null);
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		distube: import('distube').DisTube;
	}
}

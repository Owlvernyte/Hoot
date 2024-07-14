import { ApplicationCommandRegistries, SapphireClient, container } from '@sapphire/framework';
import { ClientOptions } from 'discord.js';
import { DisTube } from 'distube';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { DirectLinkPlugin } from '@distube/direct-link';
import { YouTubePlugin } from '@distube/youtube';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { SpotifyPlugin } from '@distube/spotify';
import { CustomEvents } from './constants';

const dev = process.env.NODE_ENV !== 'production';

export class HootClient extends SapphireClient {
	distube: DisTube;
	youtubePlugin = new YouTubePlugin();

	constructor(options: ClientOptions) {
		super(options);
		const distube = new DisTube(this, {
			plugins: [new YtDlpPlugin({ update: true }), new DirectLinkPlugin(), this.youtubePlugin, new SoundCloudPlugin(), new SpotifyPlugin()]
		});
		this.distube = distube;
		distube.updatePanel = async (interaction) => {
			this.emit(CustomEvents.UpdatePanel, interaction);
		};
		container.distube = distube;
		container.youtubePlugin = this.youtubePlugin;

		dev && ApplicationCommandRegistries.setDefaultGuildIds([process.env.DEV_GUILD_ID]);

		for (const command of container.stores.get('commands').values()) {
			command.applicationCommandRegistry.registerChatInputCommand((b) => b.setDMPermission(false));
		}

		ApplicationCommandRegistries.registries.forEach((r) => r.registerChatInputCommand((b) => b.setDMPermission(false)));
	}
}

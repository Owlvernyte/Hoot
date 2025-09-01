import { SapphireClient, container } from '@sapphire/framework';
import { ClientOptions } from 'discord.js';
import { DisTube } from 'distube';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { DirectLinkPlugin } from '@distube/direct-link';
import { YouTubePlugin } from '@distube/youtube';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { SpotifyPlugin } from '@distube/spotify';
import { CustomEvents } from './constants';
import fs from 'fs';

export class HootClient extends SapphireClient {
	distube: DisTube;
	// https://github.com/skick1234/DisTube/wiki/Projects-Hub#official-plugins
	// Extractor Plugins
	youtubePlugin: YouTubePlugin;
	soundCloudPlugin = new SoundCloudPlugin();
	// Info Extractor Plugins
	spotifyPlugin = new SpotifyPlugin();

	constructor(options: ClientOptions) {
		super(options);
		this.youtubePlugin = this.getYoutubePlugin();
		const distube = new DisTube(this, {
			plugins: [new DirectLinkPlugin(), this.youtubePlugin, this.soundCloudPlugin, this.spotifyPlugin, new YtDlpPlugin({ update: true })]
		});
		this.distube = distube;
		distube.updatePanel = async (interaction) => {
			this.emit(CustomEvents.UpdatePanel, interaction);
		};
		container.distube = distube;
		container.youtubePlugin = this.youtubePlugin;
	}

	getYoutubePlugin() {
		return process.env.COOKIE_FILE
			? new YouTubePlugin({ cookies: JSON.parse(fs.readFileSync(process.env.COOKIE_FILE, 'utf8')) })
			: new YouTubePlugin();
	}
}

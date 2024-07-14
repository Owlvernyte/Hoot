import { Collection, GuildTextBasedChannel } from 'discord.js';
import DisTube, { DisTubeVoice, Queue, Song } from 'distube';
import { QueueMetadata } from '../@types';

export class HootQueue extends Queue {
	override songs: Song<QueueMetadata>[] = [];

	constructor(distube: DisTube, voice: DisTubeVoice, textChannel?: GuildTextBasedChannel | undefined) {
		super(distube, voice, textChannel);
		this.skipVotes = new Collection();
		this.backVotes = new Collection();
	}
}

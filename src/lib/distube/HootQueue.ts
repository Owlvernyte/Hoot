import DisTube, { DisTubeVoice, Queue, Song } from 'distube';
import { GuildMember, User, Collection, Snowflake } from 'discord.js';
import { GuildTextBasedChannel } from 'discord.js';

export class HootQueue extends Queue {
	owner?: GuildMember;
	skipVotes: Collection<Snowflake, GuildMember | User>;
	backVotes: Collection<Snowflake, GuildMember | User>;
    panelId?: Snowflake;

	constructor(distube: DisTube, voice: DisTubeVoice, song: Song | Song[], textChannel?: GuildTextBasedChannel | undefined) {
		super(distube, voice, song, textChannel);
		this.skipVotes = new Collection();
		this.backVotes = new Collection();
	}
}

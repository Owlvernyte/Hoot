import { EmbedBuilder } from 'discord.js';
import { Song } from 'distube';
import { HootQueue } from '../../lib/distube/HootQueue';
import { getQueueStatus } from '../../lib/utils';

export class PlayPanelEmbed {
	static create(song: Song, queue: HootQueue) {
		const { upNext, filter, loop, volume } = getQueueStatus(queue);
		const firstLine = [`⌛ **${song.formattedDuration}**`, volume, loop, filter].filter((x) => !!x.length).join(' | ');
		return new EmbedBuilder()
			.setColor(queue.paused ? 'Red' : 'Random')
			.setAuthor({
				name: `${song.user?.tag}`,
				iconURL: `${song.user?.displayAvatarURL()}`
			})
			.setTitle(song.name || null)
			.setURL(song.url || null)
			.setThumbnail(song.thumbnail || null)
			.setDescription(`${firstLine}\n\n${upNext}`)
			.setFooter({
				text: `${queue.owner?.user.tag} 💂‍♂️`,
				iconURL: `${queue.owner?.user.displayAvatarURL()}`
			});
	}
}

import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Events, Playlist } from 'distube';
import { HootQueue } from '../../lib/distube/HootQueue';
import { QueueMetadata } from '../../lib/HootClient';
import { maxSongs } from '../../lib/constants';
import { AutocompleteInteraction, EmbedBuilder } from 'discord.js';

@ApplyOptions<Listener.Options>(({ container }) => ({
	emitter: container.distube,
	event: Events.ADD_LIST
}))
export class UserEvent extends Listener {
	public override async run(queue: HootQueue, playlist: Playlist<QueueMetadata>) {
		let playlistLength = playlist.songs.length;

		if (queue.songs.length - 1 > maxSongs) {
			const exceptLength = queue.songs.splice(maxSongs + 1).length;
			queue.textChannel?.send({
				embeds: [
					new EmbedBuilder()
						.setColor('Red')
						.setDescription(
							`Your queue length meets limitation (\`${maxSongs}\`), some of your songs (\`${exceptLength}\` songs) were removed.`
						)
				]
			});
			playlistLength -= exceptLength;
		}

		const embed = new EmbedBuilder()
			.setColor('Random')
			.setDescription(
				`Added [\`${playlist.name}\`](${playlist.url}) playlist (\`${playlistLength}\` songs) to queue for total \`${
					queue.songs.length - 1
				}\` songs in queue`
			);
		// .setAuthor({
		// 	name: `${playlist.user.tag}`,
		// 	iconURL: `${playlist.user.displayAvatarURL()}`,
		// });

		if (playlist.metadata.i && !(playlist.metadata.i instanceof AutocompleteInteraction)) {
			await playlist.metadata.i.editReply({
				embeds: [embed]
			});
		}
	}
}

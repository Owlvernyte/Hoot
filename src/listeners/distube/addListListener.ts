import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { AutocompleteInteraction } from 'discord.js';
import { Events, Playlist } from 'distube';
import { maxSongs } from '../../lib/constants';
import { HootQueue } from '../../lib/distube/HootQueue';
import { ErrorEmbed, SuccessEmbed } from '../../messages';
import { QueueMetadata } from '../../lib/@types';

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
					new ErrorEmbed(
						`Your queue length meets limitation (\`${maxSongs}\`), some of your songs (\`${exceptLength}\` songs) were removed.`
					)
				]
			});
			playlistLength -= exceptLength;
		}

		if (playlist.metadata.i && !(playlist.metadata.i instanceof AutocompleteInteraction)) {
			await playlist.metadata.i.editReply({
				embeds: [
					new SuccessEmbed(
						`Added [\`${playlist.name}\`](${playlist.url}) playlist (\`${playlistLength}\` songs) to queue for total \`${
							queue.songs.length - 1
						}\` songs in queue`
					)
				]
			});
		}
	}
}

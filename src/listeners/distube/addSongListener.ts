import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Events, Song } from 'distube';
import { HootQueue } from '../../lib/distube/HootQueue';
import { AutocompleteInteraction, EmbedBuilder } from 'discord.js';
import { QueueMetadata } from '../../lib/HootClient';
import { maxSongs } from '../../lib/constants';

@ApplyOptions<Listener.Options>(({ container }) => ({
	emitter: container.distube,
	event: Events.ADD_SONG
}))
export class AddSongListener extends Listener {
	public override async run(queue: HootQueue, song: Song<QueueMetadata>) {
		if (queue.songs.length - 1 > maxSongs) {
			queue.songs.splice(maxSongs + 1);

			queue.textChannel?.send({
				embeds: [
					new EmbedBuilder()
						.setColor('Red')
						.setTitle('FAILED TO ADD SONG')
						.setDescription(
							`Cannot add [\`${song.name}\`](${song.url}) to queue as your queue length meets limitation (\`${maxSongs}\`).`
						)
				]
			});
			return;
		}

		const embed = new EmbedBuilder()
			.setColor('Random')
			.setDescription(
				`Added **[${song.name}](${song.url})** - \`${song.formattedDuration}\` to the queue${
					queue.songs.length <= 1 ? '' : ` at position \`${queue.songs.findIndex((s) => s === song)}\``
				}`
			);
		// .setAuthor({
		// 	name: `${song.user.tag}`,
		// 	iconURL: `${song.user.displayAvatarURL()}`,
		// });
		if (song.metadata.i && !(song.metadata.i instanceof AutocompleteInteraction)) {
			await song.metadata.i.editReply({
				embeds: [embed]
			});
		}
	}
}

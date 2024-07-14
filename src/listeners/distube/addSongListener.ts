import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { AutocompleteInteraction } from 'discord.js';
import { Events } from 'distube';
import { maxSongs } from '../../lib/constants';
import { HootQueue } from '../../lib/distube/HootQueue';
import { ErrorEmbed, SuccessEmbed } from '../../messages';

@ApplyOptions<Listener.Options>(({ container }) => ({
	emitter: container.distube,
	event: Events.ADD_SONG
}))
export class AddSongListener extends Listener {
	public override async run(queue: HootQueue, song: HootQueue['songs'][number]) {
		if (queue.songs.length - 1 > maxSongs) {
			queue.songs.splice(maxSongs + 1);

			queue.textChannel?.send({
				embeds: [
					new ErrorEmbed(`Cannot add [\`${song.name}\`](${song.url}) to queue as your queue length meets limitation (\`${maxSongs}\`).`)
				]
			});
			return;
		}

		if (song.metadata.i && !(song.metadata.i instanceof AutocompleteInteraction)) {
			await song.metadata.i.editReply({
				embeds: [
					new SuccessEmbed(
						`Added **[${song.name}](${song.url})** - \`${song.formattedDuration}\` to the queue${
							queue.songs.length <= 1 ? '' : ` at position \`${queue.songs.findIndex((s) => s === song)}\``
						}`
					)
				]
			});
		}
	}
}

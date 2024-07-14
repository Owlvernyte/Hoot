import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Events } from 'distube';
import { HootQueue } from '../../lib/distube/HootQueue';
import { PlayPanelComponents } from '../../messages/components/PlayPanelComponents';
import { PlayPanelEmbed } from '../../messages/embeds/PlayPanelEmbed';

@ApplyOptions<Listener.Options>(({ container }) => ({
	emitter: container.distube,
	event: Events.PLAY_SONG
}))
export class PlaySongListener extends Listener {
	async run(queue: HootQueue, song: HootQueue['songs'][number]) {
		if (!queue.owner) {
			queue.owner = song.metadata.queueStarter;
		}

		const embeds = [PlayPanelEmbed.create(song, queue)];

		const components = PlayPanelComponents.create(false, queue);

		if (queue.panelId) {
			const oldPanel = await queue.textChannel?.messages.fetch(queue.panelId);
			if (oldPanel && oldPanel.deletable) oldPanel.delete();
		}

		const msg = await queue.textChannel?.send({
			embeds,
			components
		});

		queue.panelId = msg?.id;
		queue.skipVotes.clear();
		queue.backVotes.clear();
	}
}

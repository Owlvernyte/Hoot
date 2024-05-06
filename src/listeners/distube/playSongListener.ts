import { Song } from 'distube';
import { HootQueue } from '../../lib/distube/HootQueue';
import { BaseDisTubeListener } from './baseDisTubeListener';
import PlayPanelEmbed from '../../messages/embeds/PlayPanelEmbed';
import { PlayPanelComponents } from '../../messages/components/PlayPanelComponents';

export class PlaySongListener extends BaseDisTubeListener<'playSong'> {
	async run(queue: HootQueue, song: Song) {
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

import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Events } from 'distube';
import { HootQueue } from '../../lib/distube/HootQueue';
import { ErrorEmbed } from '../../messages';

@ApplyOptions<Listener.Options>(({ container }) => ({
	emitter: container.distube,
	event: Events.EMPTY
}))
export class UserEvent extends Listener {
	public override async run(queue: HootQueue) {
		const embed = new ErrorEmbed('Voice channel is empty! Leaving the channel...', true);

		try {
			if (!queue.panelId) throw new Error('No queue panelId');
			const oldPanel = await queue.textChannel?.messages.fetch(queue.panelId);
			if (oldPanel && oldPanel.editable)
				oldPanel.edit({
					embeds: [embed],
					components: []
				});
		} catch (error) {
			queue.textChannel?.send({
				embeds: [embed]
			});
		}
	}
}

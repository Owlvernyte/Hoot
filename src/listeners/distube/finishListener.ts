import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';
import { Events } from 'distube';
import { HootQueue } from '../../lib/distube/HootQueue';

@ApplyOptions<Listener.Options>(({ container }) => ({
	emitter: container.distube,
	event: Events.FINISH
}))
export class UserEvent extends Listener {
	public override async run(queue: HootQueue) {
		const embed = new EmbedBuilder().setColor('Red').setDescription('This is the end of queue. Add more with `play` command.');

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

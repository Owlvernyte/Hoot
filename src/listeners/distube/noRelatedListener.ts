import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Events } from 'distube';
import { HootQueue } from '../../lib/distube/HootQueue';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<Listener.Options>(({ container }) => ({
	emitter: container.distube,
	event: Events.NO_RELATED
}))
export class UserEvent extends Listener {
	public override run(queue: HootQueue) {
		const embed = new EmbedBuilder().setColor('Red').setDescription("Can't find related video to play.");

		queue.textChannel?.send({
			embeds: [embed]
		});
	}
}

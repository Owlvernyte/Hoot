import { Listener } from '@sapphire/framework';
import { Events } from 'distube';
import { HootQueue } from '../../lib/distube/HootQueue';
import { ApplyOptions } from '@sapphire/decorators';
import { Collection } from 'discord.js';

@ApplyOptions<Listener.Options>(({ container }) => ({
	emitter: container.distube,
	event: Events.INIT_QUEUE
}))
export class InitQueueListener extends Listener {
	run(queue: HootQueue) {
		queue.owner = queue.songs[0].member;
		queue.skipVotes = new Collection();
		queue.backVotes = new Collection();

		// this.container.logger.debug('InitQueueListener', queue);
	}
}

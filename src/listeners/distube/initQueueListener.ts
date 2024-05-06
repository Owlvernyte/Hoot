import { HootQueue } from '../../lib/distube/HootQueue';
import { BaseDisTubeListener } from './baseDisTubeListener';

export class InitQueueListener extends BaseDisTubeListener<'initQueue'> {
	run(queue: HootQueue) {
		queue.owner = queue.songs[0].member;
	}
}

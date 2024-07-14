import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Events } from 'distube';
import { ErrorEmbed } from '../../messages';
import { HootQueue } from '../../lib/distube/HootQueue';

@ApplyOptions<Listener.Options>(({ container }) => ({
	emitter: container.distube,
	event: Events.ERROR
}))
export class UserEvent extends Listener {
	public override run(e: unknown, queue: HootQueue) {
		try {
			const embed = new ErrorEmbed(`An error encountered: \`\`\`${(e as Error).toString().slice(0, 1974)}\`\`\``);
			queue.textChannel?.send({
				embeds: [embed]
			});
		} catch (error) {
			this.container.logger.error(error);
		}
	}
}

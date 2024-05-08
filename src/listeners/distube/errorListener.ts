import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Channel } from 'discord.js';
import { Events } from 'distube';
import { ErrorEmbed } from '../../messages';

@ApplyOptions<Listener.Options>(({ container }) => ({
	emitter: container.distube,
	event: Events.ERROR
}))
export class UserEvent extends Listener {
	public override run(channel: Channel, e: unknown) {
		const embed = new ErrorEmbed(`An error encountered: \`\`\`${(e as Error).toString().slice(0, 1974)}\`\`\``);

		if (channel && channel.isTextBased())
			channel.send({
				embeds: [embed]
			});
		else this.container.logger.error(e);
	}
}

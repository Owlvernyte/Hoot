import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Message } from 'discord.js';
import { Events } from 'distube';
import { ErrorEmbed } from '../../messages';

@ApplyOptions<Listener.Options>(({ container }) => ({
	emitter: container.distube,
	event: Events.SEARCH_NO_RESULT
}))
export class UserEvent extends Listener {
	public override run(message: Message, query: string) {
		const embed = new ErrorEmbed(`No result found for \`${query}\`!`);

		message.channel.send({
			embeds: [embed]
		});
	}
}

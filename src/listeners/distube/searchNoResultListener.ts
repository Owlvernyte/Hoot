import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { EmbedBuilder, Message } from 'discord.js';
import { Events } from 'distube';

@ApplyOptions<Listener.Options>(({ container }) => ({
	emitter: container.distube,
	event: Events.SEARCH_NO_RESULT
}))
export class UserEvent extends Listener {
	public override run(message: Message, query: string) {
		const embed = new EmbedBuilder().setColor('Red').setTitle(`ERROR`).setDescription(`No result found for \`${query}\`!`);

		message.channel.send({
			embeds: [embed]
		});
	}
}

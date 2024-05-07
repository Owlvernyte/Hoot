import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Channel, EmbedBuilder } from 'discord.js';
import { Events } from 'distube';

@ApplyOptions<Listener.Options>(({ container }) => ({
	emitter: container.distube,
	event: Events.ERROR
}))
export class UserEvent extends Listener {
	public override run(channel: Channel, e) {
		const embed = new EmbedBuilder()
			.setColor('Red')
			.setTitle(`ERROR`)
			.setDescription(`An error encountered: \`\`\`${e.toString().slice(0, 1974)}\`\`\``);

		if (channel && channel.isTextBased())
			channel.send({
				embeds: [embed]
			});
		else this.container.logger.error(e);
	}
}

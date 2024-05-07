import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Interaction } from 'discord.js';
import { CustomEvents } from '../../lib/constants';
import { PlayPanelComponents, PlayPanelEmbed } from '../../messages';

@ApplyOptions<Listener.Options>({
	event: CustomEvents.UpdatePanel
})
export class UpdatePanelEvent extends Listener {
	public override async run(interaction: Interaction) {
		const { guild } = interaction;

		if (!guild) return;

		const queue = this.container.distube.getQueue(guild.id);

		if (!queue) throw new Error('There is nothing playing!');

		const embeds = [PlayPanelEmbed.create(queue.songs[0], queue)];

		const components = PlayPanelComponents.create(false, queue);

		if (!interaction.isRepliable() || interaction.replied) return;

		if (interaction.isButton()) {
			await interaction.update({
				embeds,
				components
			});
			return;
		}

		if (interaction.isChatInputCommand() && queue.panelId) {
			const panelMessage = await queue.textChannel?.messages.fetch(queue.panelId);
			await panelMessage?.edit({
				embeds,
				components
			});
			return;
		}
	}
}

declare module 'distube' {
	interface DisTube {
		getQueue(guildId: import('discord.js').Snowflake): import('../../lib/distube/HootQueue').HootQueue | undefined;
	}
}

import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';
import { ButtonCustomIds, CustomEvents } from '../../lib/constants';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public async run(interaction: ButtonInteraction) {
		const { guild } = interaction;

		if (!guild) return;

		const queue = this.container.distube.getQueue(guild.id);

		if (!queue) throw new Error('There is nothing playing!');

		if (!queue.owner || queue.owner.id !== interaction.user.id || !queue.panelId || interaction.message.id !== queue.panelId)
			throw new Error(`You don't own this panel!`);

		if (queue.paused) {
			queue.resume();
		} else {
			queue.pause();
		}

		this.container.client.emit(CustomEvents.UpdatePanel, interaction);
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== ButtonCustomIds.Pause) return this.none();

		return this.some();
	}
}

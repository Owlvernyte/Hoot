import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';
import { ButtonCustomIds, CustomEvents } from '../../lib/constants';
import { HootBaseError } from '../../lib/errors/HootBaseError';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public async run(interaction: ButtonInteraction) {
		const { guild } = interaction;

		if (!guild) return;

		const queue = this.container.distube.getQueue(guild.id);

		if (!queue) throw new HootBaseError('There is nothing playing!', interaction);

		if (!queue.owner || queue.owner.id !== interaction.user.id || !queue.panelId || interaction.message.id !== queue.panelId)
			throw new HootBaseError(`You don't own this panel!`, interaction);

		queue.toggleAutoplay();

		this.container.client.emit(CustomEvents.UpdatePanel, interaction);
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== ButtonCustomIds.AutoPlay) return this.none();

		return this.some();
	}
}

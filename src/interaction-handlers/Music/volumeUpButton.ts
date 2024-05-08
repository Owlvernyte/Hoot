import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';
import { HootBaseError } from '../../lib/errors/HootBaseError';
import { ButtonCustomIds, CustomEvents } from '../../lib/constants';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public async run(interaction: ButtonInteraction) {
		const { guild } = interaction;

		const queue = this.container.distube.getQueue(guild!.id)!;

		if (!queue) throw new HootBaseError('There is nothing playing!', interaction);

		if (!queue.owner || queue.owner.id !== interaction.user.id || !queue.panelId || interaction.message.id !== queue.panelId)
			throw new HootBaseError(`You don't own this panel!`, interaction);

		if (queue.volume >= 100) throw new HootBaseError(`Cannot up volume anymore!`, interaction);

		queue.setVolume(queue.volume + 10);

		this.container.client.emit(CustomEvents.UpdatePanel, interaction);
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== ButtonCustomIds.VolumeUp) return this.none();

		return this.some();
	}
}

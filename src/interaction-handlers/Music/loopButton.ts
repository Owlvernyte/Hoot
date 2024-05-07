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

		const queue = this.container.distube.getQueue(guild!.id)!;

		if (!queue) throw new HootBaseError('There is nothing playing!', interaction);

		if (!queue.owner || queue.owner.id !== interaction.user.id || !queue.panelId || interaction.message.id !== queue.panelId)
			throw new HootBaseError(`You don't own this panel!`, interaction);

		let mode = queue.repeatMode + 1;
		if (mode >= 3) mode = 0;
		queue.setRepeatMode(mode);
		this.container.client.emit(CustomEvents.UpdatePanel, interaction);
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== ButtonCustomIds.Loop) return this.none();

		return this.some();
	}
}

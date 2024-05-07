import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';
import { ButtonCustomIds } from '../../lib/constants';
import { voteAction } from '../../lib/distube/voteAction';
import { HootBaseError } from '../../lib/errors/HootBaseError';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public async run(interaction: ButtonInteraction) {
		const { guild } = interaction;
		const queue = this.container.distube.getQueue(guild!.id)!;

		if (!queue) throw new HootBaseError('There is nothing playing!', interaction);
        
		voteAction(interaction, 'skip');
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== ButtonCustomIds.NextTrack) return this.none();

		return this.some();
	}
}

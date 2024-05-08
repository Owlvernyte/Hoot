import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';
import { ButtonCustomIds } from '../../lib/constants';
import { HootBaseError } from '../../lib/errors/HootBaseError';
import { SuccessEmbed } from '../../messages';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public async run(interaction: ButtonInteraction) {
		const { guild } = interaction;

		const queue = this.container.distube.getQueue(guild!.id)!;

		if (!queue) throw new Error('There is nothing playing!');

		if (!queue.owner || queue.owner.id !== interaction.user.id || !queue.panelId || interaction.message.id !== queue.panelId)
			throw new HootBaseError(`You don't own this panel!`, interaction);

		queue.shuffle();

		await interaction.reply({
			embeds: [
				new SuccessEmbed('Shuffled songs in queue!').setAuthor({
					name: `${interaction.user.tag}`,
					iconURL: `${interaction.user.displayAvatarURL()}`
				})
			]
		});
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== ButtonCustomIds.Shuffle) return this.none();

		return this.some();
	}
}

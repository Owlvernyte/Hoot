import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { CustomEvents } from '../../lib/constants';
import { SuccessEmbed } from '../../messages';

@ApplyOptions<Command.Options>({
	description: 'Adjust the queue volume',
	preconditions: ['InVoice', 'InQueue'],
    runIn: ['GUILD_ANY']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addIntegerOption((option) =>
					option.setName('amount').setDescription('Volume amount').setMinValue(0).setMaxValue(100).setRequired(true)
				)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { guild } = interaction;

		const queue = this.container.distube.getQueue(guild!)!;

		const amount = interaction.options.getInteger('amount')!;

		queue.setVolume(amount);

		this.container.client.emit(CustomEvents.UpdatePanel, interaction);

		return interaction.reply({
			embeds: [new SuccessEmbed(`Volume set to \`${amount}\``)]
		});
	}
}

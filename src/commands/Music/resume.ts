import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { CustomEvents } from '../../lib/constants';
import { SuccessEmbed } from '../../messages';

@ApplyOptions<Command.Options>({
	description: 'Resume the queue',
	preconditions: ['InVoice', 'InQueue']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { guild } = interaction;

		const queue = this.container.distube.getQueue(guild!)!;

		queue.resume();

		this.container.client.emit(CustomEvents.UpdatePanel, interaction);

		return interaction.reply({
			embeds: [new SuccessEmbed('Resumed the song!')]
		});
	}
}

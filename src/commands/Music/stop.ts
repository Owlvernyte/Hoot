import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { SuccessEmbed } from '../../messages';
import { HootBaseError } from '../../lib/errors/HootBaseError';
import { CustomEvents } from '../../lib/constants';

@ApplyOptions<Command.Options>({
	description: 'Stop the queue',
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

		const queue = this.container.distube.getQueue(guild!.id)!;

		if (queue?.owner?.user.id != interaction.user.id) throw new HootBaseError(`You have no right to do this!`, interaction);

		queue.stop();

		this.container.client.emit(CustomEvents.UpdatePanel, interaction);

		return interaction.reply({
			embeds: [new SuccessEmbed('Stopped the queue!')]
		});
	}
}

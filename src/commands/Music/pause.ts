import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ErrorEmbed } from '../../messages';
import { HootBaseError } from '../../lib/errors/HootBaseError';

@ApplyOptions<Command.Options>({
	description: 'Pause the queue',
	preconditions: ['InVoice', 'InQueueWithOwner']
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

		queue.pause();

		this.container.client.emit('updatePanel', interaction);

		return interaction.reply({
			embeds: [new ErrorEmbed('Paused the song!')]
		});
	}
}

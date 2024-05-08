import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { HootBaseError } from '../../lib/errors/HootBaseError';
import { SuccessEmbed } from '../../messages';

@ApplyOptions<Command.Options>({
	description: 'Shuffle the queue',
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

		queue.shuffle();

		return interaction.reply({
			embeds: [new SuccessEmbed('Shuffled songs in queue!')]
		});
	}
}

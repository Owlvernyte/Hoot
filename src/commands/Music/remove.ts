import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { SuccessEmbed } from '../../messages';
import { HootBaseError } from '../../lib/errors/HootBaseError';

@ApplyOptions<Command.Options>({
	description: 'Remove a song from queue',
	preconditions: ['InVoice', 'InQueueWithOwner']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addIntegerOption((option) => option.setName('position').setMinValue(1).setDescription('Song position').setRequired(true))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { guild } = interaction;

		const queue = this.container.distube.getQueue(guild!.id)!;

		if (queue?.owner?.user.id != interaction.user.id) throw new HootBaseError(`You have no right to do this!`);

		const position = interaction.options.getInteger('position')!;

		if (position > queue.songs.length - 1)
			throw new HootBaseError(
				`The position you entered (\`${position}\`) is bigger than the queue length (\`${queue.songs.length - 1}\`)`,
				interaction
			);

		const removed = queue.songs.splice(position, 1).shift();

		if (!removed) throw new HootBaseError(`Nothing removed`, interaction);

		return interaction.reply({
			embeds: [new SuccessEmbed(`Removed [\`${removed.name}\`](${removed.url}) from the queue`)]
		});
	}
}

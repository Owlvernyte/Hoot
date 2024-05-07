import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { HootBaseError } from '../../lib/errors/HootBaseError';
import { SuccessEmbed } from '../../messages';

@ApplyOptions<Command.Options>({
	description: 'Seek to a position of song',
	preconditions: ['InVoice', 'InQueueWithOwner']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addIntegerOption((option) => option.setName('time').setMinValue(0).setDescription('Position in seconds').setRequired(true))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { guild } = interaction;

		const queue = this.container.distube.getQueue(guild!)!;

		if (queue?.owner?.user.id != interaction.user.id) throw new HootBaseError(`You have no right to do this!`, interaction);

		const time = interaction.options.getInteger('time')!;

		if (time > queue.songs[0].duration)
			throw new HootBaseError(
				`The time you entered (second \`${time}\`) is bigger than the song duration (\`${queue.songs[0].duration}\`)`,
				interaction
			);

		queue.seek(time);

		return interaction.reply({
			embeds: [new SuccessEmbed(`Seeked to second \`${time}\``)]
		});
	}
}

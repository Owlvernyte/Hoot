import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { SuccessEmbed } from '../../messages';
import { HootBaseError } from '../../lib/errors/HootBaseError';

@ApplyOptions<Command.Options>({
	description: 'Forward to time of a song',
	preconditions: ['InVoice', 'InQueue'],
    runIn: ['GUILD_ANY']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addIntegerOption((option) => option.setName('time').setMinValue(0).setDescription('Time in seconds').setRequired(true))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { guild } = interaction;

		if (!guild) throw new HootBaseError('Guild should not be null');

		const queue = this.container.distube.getQueue(guild.id);

		if (!queue) throw new HootBaseError('There is nothing playing!');

		if (queue?.owner?.user.id != interaction.user.id) throw new Error(`You have no right to do this!`);

		const time = interaction.options.getInteger('time')!;
		const seekedTime = queue.currentTime + time;

		if (seekedTime > queue.songs[0].duration) throw new HootBaseError(`The time you entered (\`${time}s\`) is not suitable!`, interaction);

		queue.seek(seekedTime);

		return interaction.reply({
			embeds: [new SuccessEmbed(`Forwarded the song for \`${time}s\`!`)]
		});
	}
}

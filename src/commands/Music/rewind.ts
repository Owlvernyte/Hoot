import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { HootBaseError } from '../../lib/errors/HootBaseError';
import { SuccessEmbed } from '../../messages';

@ApplyOptions<Command.Options>({
	description: 'Rewind to time of playing song',
	preconditions: ['InVoice', 'InQueueWithOwner'],
    runIn: ['GUILD_ANY']
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

		const time = interaction.options.getInteger('time')!;
		const seekedTime = queue.currentTime - time;

		if (seekedTime > queue.songs[0].duration || seekedTime < 0)
			throw new HootBaseError(`The time you entered (\`${time}s\`) is not suitable!`, interaction);

		queue.seek(seekedTime);

		return interaction.reply({
			embeds: [new SuccessEmbed(`Rewinded the song for \`${time}s\`!`)]
		});
	}
}

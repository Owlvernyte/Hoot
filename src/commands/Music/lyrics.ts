import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { HootBaseError } from '../../lib/errors/HootBaseError';

@ApplyOptions<Command.Options>({
	description: 'Search lyrics of a song',
	preconditions: ['GuildOnly'],
	runIn: ['GUILD_ANY']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) => option.setName('song').setDescription('Song name/related string to search'))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { guild } = interaction;
		let song = interaction.options.getString('song');
		const queue = this.container.distube.getQueue(guild!.id);

		if (!song) {
			if (!queue || !queue.songs.length) {
				throw new HootBaseError('There is nothing playing!', interaction);
			}

			const np = queue.songs[0];
			song = np.name?.toLowerCase() || np.url;
		}

		song = song.replace(
			/lyrics|lyric|lyrical|official music video|\(official music video\)|audio|official|official video|official video hd|official hd video|offical video music|\(offical video music\)|extended|hd|(\[.+\])/gi,
			''
		);

		return interaction.reply({ content: 'Hello world!' });
	}
}

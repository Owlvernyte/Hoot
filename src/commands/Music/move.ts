import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { SuccessEmbed } from '../../messages';
import { Song } from 'distube';

@ApplyOptions<Command.Options>({
	description: 'Move the song to other position',
	preconditions: ['InVoice', 'InQueueWithOwner']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addIntegerOption((option) => option.setName('old_position').setMinValue(1).setDescription('Current song position').setRequired(true))
				.addIntegerOption((option) => option.setName('new_position').setMinValue(1).setDescription('New position').setRequired(true))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { guild } = interaction;

		const old_position = interaction.options.getInteger('old_position')!;
		const new_position = interaction.options.getInteger('new_position')!;

		if (old_position === new_position) throw new Error(`Nothing changed`);

		const queue = this.container.distube.getQueue(guild!);

		if (queue?.owner?.user.id != interaction.user.id) throw new Error(`You have no right to do this!`);

		if (old_position > queue.songs.length - 1 || new_position > queue.songs.length - 1)
			throw new Error(
				`One of two positions you entered (Old: \`${old_position}\`, New: \`${new_position}\`) is bigger than the queue length (\`${
					queue.songs.length - 1
				}\`)`
			);

		function array_move(arr: (Song | undefined)[], old_index: number, new_index: number) {
			if (new_index >= arr.length) {
				var k = new_index - arr.length + 1;
				while (k--) {
					arr.push(undefined);
				}
			}
			arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
			return arr; // for testing
		}

		array_move(queue.songs, old_position, new_position);

		const song = queue.songs[new_position];

		return interaction.reply({
			embeds: [new SuccessEmbed(`Moved [\`${song.name}\`](${song.url}) to \`${new_position}\``)]
		});
	}
}

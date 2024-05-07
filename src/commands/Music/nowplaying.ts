import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';
import { getQueueStatus } from '../../lib/utils';
import { millify } from 'millify';

@ApplyOptions<Command.Options>({
	description: 'Whats the playing song?',
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

		const song = queue.songs[0];

		const descriptionArray = [];

		if (song.isLive) descriptionArray.push(`🔴 \`Live\``);
		else {
			descriptionArray.push(`⌛ \`${queue.formattedCurrentTime}\``);
		}

		if (song.views) descriptionArray.push(`👁 \`${millify(song.views)}\``);

		if (song.likes || song.dislikes)
			descriptionArray.push(`👍 \`${song.likes ? millify(song.likes) : '-'}\`/👎 \`${song.dislikes ? millify(song.dislikes) : '-'}\``);

		if (song.uploader) {
			descriptionArray.push(
				`🎙 ${
					song.uploader.url
						? `[${song.uploader.name ? song.uploader.name : 'Unknown'}](${song.uploader.url})`
						: `${song.uploader.name ? song.uploader.name : 'Unknown'}`
				}`
			);
		}

		if (song.member) descriptionArray.push(`🎧 ${song.member}`);

		const embed = new EmbedBuilder()
			.setColor('Random')
			.setTitle(`${song.name}`)
			.setURL(song.url)
			.setThumbnail(song.thumbnail || null)
			.setFooter({
				text: `${song.formattedDuration} | ${getQueueStatus(queue)}`
			});

		if (descriptionArray.length) {
			const stat = descriptionArray.join(' | ');
			embed.setDescription(`${stat}`);
		}

		return interaction.reply({
			embeds: [embed]
		});
	}
}

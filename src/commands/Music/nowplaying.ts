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

		const descriptionArray: string[][] = [[], [], []];

		if (song.views) descriptionArray[0].push(`👁 \`${millify(song.views)}\``);

		if (song.likes || song.dislikes)
			descriptionArray[0].push(`👍 \`${song.likes ? millify(song.likes) : '-'}\`/👎 \`${song.dislikes ? millify(song.dislikes) : '-'}\``);

		descriptionArray[1].push(
			`🎙 ${
				song.uploader.url
					? `[${song.uploader.name ? song.uploader.name : 'Unknown'}](${song.uploader.url})`
					: `${song.uploader.name ? song.uploader.name : 'Unknown'}`
			}`
		);
		if (song.member) descriptionArray[2].push(`🎧 ${song.member}`);

		const queueStatus = getQueueStatus(queue, false);

		const embed = new EmbedBuilder()
			.setColor('Random')
			.setTitle(`${song.name || 'Unknown'}`)
			.setURL(song.url || null)
			.setThumbnail(song.thumbnail || null)
			.setFooter({
				text: `${song.isLive ? `🔴 Live` : `⌛ ${queue.formattedCurrentTime}/${song.formattedDuration}`} | ${Object.values(queueStatus).filter((x) => !!x.length).join(' | ')}`
			});

		if (descriptionArray.length) {
			const stat = descriptionArray.map((x) => x.join(' | ')).join('\n');
			embed.setDescription(`${stat}`);
		}

		return interaction.reply({
			embeds: [embed]
		});
	}
}

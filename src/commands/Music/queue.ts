import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';
import _ from 'lodash';
import { replyLoadingChatInputInteraction } from '../../lib/utils';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';

@ApplyOptions<Command.Options>({
	description: 'Show music queue',
	preconditions: ['InVoice']
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

		if (!guild) {
			throw new Error('Guild should not be null');
		}

		const queue = this.container.distube.getQueue(guild.id);

		if (!queue) throw new Error('There is nothing playing!');

		const response = await replyLoadingChatInputInteraction(interaction);

		const songs = [...queue.songs];

		const np = songs.shift();

		const q = songs.map((song, i) => `${`\`${i + 1}\`. [${song.name}](${song.url}) - \`${song.formattedDuration}\``}`);

		const totalSongs = q.length;
		const splittedSongs = _.chunk(q, 10);

		const paginatedMessage = new PaginatedMessage({
			template: new EmbedBuilder()
				.setColor('Random')
				// Be sure to add a space so this is offset from the page numbers!
				.setFooter({ text: ` ${queue.owner?.user.tag} 💂‍♂️`, iconURL: `${queue.owner?.user.displayAvatarURL()}` })
		});

		splittedSongs.forEach((c) => {
			paginatedMessage.addPageEmbed((embed) =>
				embed
					.setTitle(`${totalSongs} songs in queue`)
					.addFields({
						name: `Now Playing`,
						value: `**[${np?.name}](${np?.url}) - \`${np?.formattedDuration}\`**`
					})
					.setDescription(`${c.reverse().join('\n')}`)
			);
		});

		await paginatedMessage.run(response, interaction.user);
		return response;
	}
}

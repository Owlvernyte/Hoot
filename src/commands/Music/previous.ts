import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ErrorEmbed, SuccessEmbed } from '../../messages';
import { HootBaseError } from '../../lib/errors/HootBaseError';

@ApplyOptions<Command.Options>({
	description: 'Play previous song',
	preconditions: ['InVoice', 'InQueue']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addBooleanOption((option) => option.setName('force').setDescription(`Force to previous a song (without vote)`))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { guild } = interaction;

		const force = interaction.options.getBoolean('force') || false;

		const queue = this.container.distube.getQueue(guild!)!;

		async function previous() {
			try {
				const song = await queue.previous();

				return interaction.reply({
					embeds: [
						new SuccessEmbed(`Backed!`).addFields({
							name: `Now Playing`,
							value: `[\`${song.name}\`](${song.url})`
						})
					]
				});
			} catch (e) {
				return interaction.reply({
					embeds: [new ErrorEmbed((e as Error)?.message || `There was an issue while executing that button!`)],
					ephemeral: true
				});
			}
		}

		if (force && interaction.user.id == queue?.owner?.user.id) return previous();

		const membersInVoice = queue.voiceChannel?.members.size || 0;

		const required = Math.ceil(membersInVoice / 2);

		if (queue.backVotes.has(interaction.user.id)) {
			if (queue?.owner?.user.id == interaction.user.id) {
				return previous();
			} else throw new HootBaseError(`You have already voted!`, interaction);
		}

		queue.backVotes.set(interaction.user.id, interaction.member);

		if (queue.backVotes.size < required)
			return interaction.reply({
				embeds: [new SuccessEmbed(`${queue.backVotes.size}/${required} back votes\nVotes: ${queue.backVotes.map((v) => `${v}`).join(', ')}`)]
			});
		else if (queue.backVotes.size >= required) {
			return previous();
		}
	}
}

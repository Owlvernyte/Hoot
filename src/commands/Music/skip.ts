import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ErrorEmbed, InfoEmbed, SuccessEmbed } from '../../messages';
import { HootBaseError } from '../../lib/errors/HootBaseError';

@ApplyOptions<Command.Options>({
	description: 'Skip currently playing song',
	preconditions: ['InVoice', 'InQueue']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addBooleanOption((option) => option.setName('force').setDescription(`Force to skip a song (without vote)`))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { guild } = interaction;

		const force = interaction.options.getBoolean('force') || false;

		const queue = this.container.distube.getQueue(guild!)!;

		async function skip() {
			try {
				const song = await queue.skip();

				return interaction.reply({
					embeds: [
						new SuccessEmbed(`Skipped!`).addFields({
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

		if (force && interaction.user.id == queue?.owner?.user.id) return skip();

		const membersInVoice = queue.voiceChannel?.members.size || 0;

		const required = Math.ceil(membersInVoice / 2);

		if (queue.skipVotes.has(interaction.user.id)) {
			if (queue?.owner?.user.id == interaction.user.id) {
				return skip();
			} else throw new HootBaseError(`You have already voted!`, interaction);
		}

		queue.skipVotes.set(interaction.user.id, interaction.member);

		if (queue.skipVotes.size < required)
			return interaction.reply({
				embeds: [new InfoEmbed(`${queue.skipVotes.size}/${required} skip votes\nVotes: ${queue.skipVotes.map((v) => `${v}`).join(', ')}`)]
			});
		else if (queue.skipVotes.size >= required) {
			return skip();
		}
	}
}

import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { SuccessEmbed } from '../../messages';
import { HootBaseError } from '../../lib/errors/HootBaseError';
import { RepeatMode } from 'distube';
import { CustomEvents } from '../../lib/constants';

@ApplyOptions<Command.Options>({
	description: 'Set repeat mode',
	preconditions: ['InVoice', 'InQueueWithOwner'],
    runIn: ['GUILD_ANY']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option
						.setName('mode')
						.setDescription('Repeat mode')
						.setRequired(true)
						.addChoices(
							{ name: RepeatMode[RepeatMode.DISABLED], value: `${RepeatMode.DISABLED}` },
							{ name: RepeatMode[RepeatMode.SONG], value: `${RepeatMode.SONG}` },
							{ name: RepeatMode[RepeatMode.QUEUE], value: `${RepeatMode.QUEUE}` }
						)
				)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { guild } = interaction;

		const queue = this.container.distube.getQueue(guild!.id)!;

		if (queue?.owner?.user.id != interaction.user.id) throw new HootBaseError(`You have no right to do this!`);

		let mode = parseInt(interaction.options.getString('mode')!);

		mode = queue.setRepeatMode(mode);

		this.container.client.emit(CustomEvents.UpdatePanel, interaction);

		const modeString = mode ? (mode === 2 ? 'Repeat queue' : 'Repeat song') : 'Off';

		interaction.reply({
			embeds: [new SuccessEmbed(`Set repeat mode to \`${modeString}\``)]
		});
	}
}

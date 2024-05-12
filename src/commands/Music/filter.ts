import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { defaultFilters as disTubeDefaultFilters } from 'distube';
import { SuccessEmbed } from '../../messages';
import { HootBaseError } from '../../lib/errors/HootBaseError';
import { CustomEvents } from '../../lib/constants';

const defaultFilters = Object.keys(disTubeDefaultFilters).map((mf) => {
	return {
		name: `${mf.toLocaleUpperCase()}`,
		value: mf
	};
});

@ApplyOptions<Command.Options>({
	description: 'Add or remove filter(s)',
	preconditions: ['InVoice', 'InQueue'],
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
						.setName('filter')
						.setDescription('Choose a filter')
						.setRequired(true)
						.addChoices({
							name: 'OFF',
							value: 'off'
						})
						.addChoices(...defaultFilters)
				)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { guild } = interaction;

		if (!guild) throw new HootBaseError('Guild should not be null');

		const queue = this.container.distube.getQueue(guild.id);

		if (queue?.owner?.user.id != interaction.user.id) throw new HootBaseError(`You have no right to do this!`, interaction);

		const filter = interaction.options.getString('filter')!;

		if (filter === 'off' && queue.filters.size) queue.filters.clear();
		else if (Object.keys(this.container.distube.filters).includes(filter)) {
			if (queue.filters.has(filter)) queue.filters.remove(filter);
			else queue.filters.add(filter);
		}

		this.container.client.emit(CustomEvents.UpdatePanel, interaction);

		return interaction.reply({
			embeds: [new SuccessEmbed(`\`${queue.filters.names.join(', ') || 'None'}\``).setTitle(`Current Queue Filter`)]
		});
	}
}

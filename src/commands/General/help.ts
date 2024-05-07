import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { APIApplicationCommandOptionChoice } from 'discord.js';

const choices: APIApplicationCommandOptionChoice<string>[] = [
	{ name: 'Get command list', value: 'commands' },
	// { name: 'Get relevant links', value: 'links' },
	{ name: 'Support server', value: 'support' }
];

@ApplyOptions<Command.Options>({
	description: 'This command will help you out'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option
						.setName('topic')
						.setDescription('Select a topic')
						.setRequired(true)
						.addChoices(...choices)
				)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		// const { guild } = interaction;

		const topic = interaction.options.getString('topic');

		switch (topic) {
			case 'commands':
				break;
			case 'support':
				break;
		}

		return interaction.reply({ content: 'Hello world!' });
	}
}

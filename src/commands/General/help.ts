import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { APIApplicationCommandOptionChoice, ApplicationCommandType, EmbedBuilder, chatInputApplicationCommandMention } from 'discord.js';

const dev = process.env.NODE_ENV !== 'production';

const choices: APIApplicationCommandOptionChoice<string>[] = [
	{ name: 'Get command list', value: 'commands' },
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
		const topic = interaction.options.getString('topic');

        if (topic === 'commands') {
            return this.commandsOptionRun(interaction);
        }

        return this.supportOptionRun(interaction);
	}

	private async commandsOptionRun(interaction: Command.ChatInputCommandInteraction) {
		const { guild } = interaction;
		const applicationCommands = (dev ? await guild!.commands.fetch() : await this.container.client.application!.commands.fetch())
			.filter((c) => c.type === ApplicationCommandType.ChatInput)
			.map(({ id, name, description }) => ({
				id,
				name,
				description
			}));

		const commandStore = this.container.stores.get('commands');

		const categorizedCommands = commandStore.categories.map((category) => ({
			categoryName: category,
			commands: commandStore
				.filter((command) => command.enabled && command.fullCategory.includes(category))
				.map((command) => applicationCommands.find((ac) => ac.name === command.name))
		}));

		const embed = new EmbedBuilder()
			.setColor('Random')
			.setTitle(`COMMAND LIST`)
			.setThumbnail(this.container.client.user?.displayAvatarURL() || null)
			.setDescription(
				`We use \`/command\` (Slash command) only! For further reason click [here](https://support-dev.discord.com/hc/en-us/articles/4404772028055).`
			)
			.addFields(
				...categorizedCommands.map((category) => ({
					name: category.categoryName,
					value: category.commands
						.map((command) => chatInputApplicationCommandMention(command?.name || 'unknownName', command?.id || 'unknownId'))
						.join(' • ')
				}))
			);

		return interaction.reply({
			embeds: [embed]
		});
	}

	private async supportOptionRun(interaction: Command.ChatInputCommandInteraction) {
		const supportGuild = await this.container.client.guilds.fetch(process.env.SUPPORT_SERVER_ID);

		return interaction.reply({
			content: `${await supportGuild.invites.create(supportGuild.rulesChannelId!)}`
		});
	}
}

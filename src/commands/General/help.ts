import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { APIApplicationCommandOptionChoice, EmbedBuilder } from 'discord.js';

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
		const messagePayload: { content?: string; embeds?: EmbedBuilder[] } = {
			content: undefined,
			embeds: undefined
		};
		const topic = interaction.options.getString('topic');

		switch (topic) {
			case 'commands': {
				const commandStore = this.container.stores.get('commands');

				const categoriedCommands = commandStore.categories.map((category) => ({
					categoryName: category,
					commands: commandStore
						.filter((command) => command.enabled && command.fullCategory.includes(category))
						.map((command) => ({
							name: command.name,
							preconditions: command.preconditions.entries
						}))
				}));

				const embed = new EmbedBuilder()
					.setColor('Random')
					.setTitle(`COMMAND LIST`)
					.setThumbnail(this.container.client.user?.displayAvatarURL() || null)
					.setDescription(
						`We use \`/command\` (Slash command) only! For further reason click [here](https://support-dev.discord.com/hc/en-us/articles/4404772028055).`
					)
					.addFields(
						...categoriedCommands.map((category) => ({
							name: category.categoryName,
							value: category.commands.map((command) => `\`${command.name}\``).join(' • ')
						}))
					);

				messagePayload.embeds = [embed];
				break;
			}
			case 'support': {
				const supportGuild = await this.container.client.guilds.fetch(process.env.SUPPORT_SERVER_ID);

				messagePayload.content = `${await supportGuild.invites.create(supportGuild.rulesChannelId!)}`;

				break;
			}
		}

		return interaction.reply(messagePayload);
	}
}

import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { Command } from '@sapphire/framework';
import { ApplicationCommandType, EmbedBuilder, chatInputApplicationCommandMention } from 'discord.js';
import { getRandomHoot, replyLoadingChatInputInteraction } from '../../lib/utils';

const dev = process.env.NODE_ENV !== 'production';

@ApplyOptions<Command.Options>({
	description: 'This command will help you out'
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
		const response = await replyLoadingChatInputInteraction(interaction);

		const paginatedMessage = new PaginatedMessage({
			template: new EmbedBuilder()
				.setColor('Random')
				// Be sure to add a space so this is offset from the page numbers!
				.setFooter({ text: ` ${getRandomHoot()}`, iconURL: `${interaction.user.displayAvatarURL()}` })
				.setThumbnail(this.container.client.user?.displayAvatarURL() || null)
		});

		paginatedMessage.addPageEmbed(this.getWelcomeEmbed());
        const commandEmbeds = await this.getCommandsEmbeds(interaction);
        commandEmbeds.forEach((embed) => paginatedMessage.addPageEmbed(embed));

		await paginatedMessage.run(response, interaction.user);

		return response;
	}

	private async getCommandsEmbeds(interaction: Command.ChatInputCommandInteraction) {
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

		const embeds = categorizedCommands.map((category) =>
			new EmbedBuilder()
				.setTitle(`${category.categoryName} Commands`)
				.setDescription(
					category.commands
						.map((command) => chatInputApplicationCommandMention(command?.name || 'unknownName', command?.id || 'unknownId'))
						.join(' • ')
				)
		);
		return embeds;
	}

	private getWelcomeEmbed() {
		const linkMardown = (name: string, url: string) => `[${name}](${url})`;
		const hootSlashReasonUrl = linkMardown('here', 'https://support-dev.discord.com/hc/en-us/articles/4404772028055');
		const hootSupportServerUrl = linkMardown('Support Server', process.env.SUPPORT_SERVER_INVITE_LINK);
		const hootFeedbackUrl = linkMardown('Feedback', process.env.SUPPORT_URL);
		const embed = new EmbedBuilder()
			.setTitle('HELP PANEL')
			.setDescription(
				[
					`Hoot uses \`/command\` (Slash command) only! For further reason click ${hootSlashReasonUrl}.`,
					`${hootFeedbackUrl} • ${hootSupportServerUrl}`
				].join('\n\n')
			);
		return embed;
	}
}

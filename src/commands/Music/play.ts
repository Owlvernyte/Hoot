import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { AutocompleteInteraction, GuildMember } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Play a song',
	preconditions: ['GuildOnly']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) => option.setName('song').setDescription('Song name or URL').setAutocomplete(true).setRequired(true))
				.addIntegerOption((option) =>
					option.setName('position').setDescription('Select the position you want to add to the queue').setMinValue(1)
				)
				.addBooleanOption((option) => option.setName('skip').setDescription('Whether to skip the current song or not'))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const member = interaction.member as GuildMember | undefined;
		if (!member) {
			throw new Error('Member should not be null');
		}

		await interaction.deferReply({ ephemeral: true });
		const songName = interaction.options.getString('song')!;
		const skip = interaction.options.getBoolean('skip') || false;
		const position = interaction.options.getInteger('position') ?? 0;
		const metadata: QueueMetadata = {
			i: interaction
		};

		const voiceChannel = !member.voice.channel?.isDMBased() && !member.voice.channel?.isTextBased() ? member.voice.channel : null;
		const textChannel = interaction.channel?.isTextBased() && !interaction.channel.isDMBased() ? interaction.channel : null;

		if (!voiceChannel || !textChannel) {
			throw new Error('Voice channel or text channel should not be null');
		}

		this.container.distube.play(voiceChannel, songName, {
			member,
			textChannel,
			skip,
			position: position,
			metadata
		});
	}

	public override async autocompleteRun(interaction: AutocompleteInteraction) {
		const focusedValue = interaction.options.getFocused();
		const searchResults = (await this.container.distube.search(focusedValue).catch(() => [])) || [];

		await interaction.respond(
			searchResults.map((result) => ({
				name: `${result.name}`,
				value: `${result.url}`
			}))
		);
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		distube: import('distube').DisTube;
	}
}

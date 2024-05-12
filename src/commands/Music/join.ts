import { ApplyOptions, RequiresClientPermissions, RequiresUserPermissions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ChannelType, Constants, PermissionFlagsBits } from 'discord.js';
import { SuccessEmbed } from '../../messages';
import { HootBaseError } from '../../lib/errors/HootBaseError';

@ApplyOptions<Command.Options>({
	description: 'Join a voice based channel',
	enabled: false,
    runIn: ['GUILD_ANY']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addChannelOption((option) =>
					option
						.setName('destination')
						.setDescription('Select a voice channel')
						.addChannelTypes(ChannelType.GuildStageVoice, ChannelType.GuildVoice)
				)
				.setDefaultMemberPermissions(PermissionFlagsBits.Connect)
		);
	}

	@RequiresClientPermissions([PermissionFlagsBits.Connect])
	@RequiresUserPermissions([PermissionFlagsBits.Connect])
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { guild } = interaction;

		if (!guild) throw new HootBaseError('Guild should not be null');

		const member = await interaction.guild?.members.fetch(interaction.user.id);

		if (!member) throw new HootBaseError('Member should not be null');

		const voiceChannel =
			interaction.options.getChannel('destination') ||
			(await interaction.guild?.channels.fetch(member.voice.channelId!)) ||
			interaction.channel;

		if (!voiceChannel || voiceChannel.type != ChannelType.GuildVoice || !Constants.VoiceBasedChannelTypes.includes(voiceChannel?.type)) {
			throw new HootBaseError(`${voiceChannel} is not a valid voice channel!`, interaction);
		}

		// @ts-ignore
		this.container.distube.voices.join(voiceChannel);

		return interaction.reply({
			embeds: [new SuccessEmbed(`Joined ${voiceChannel}`)]
			// ephemeral: true,
		});
	}
}

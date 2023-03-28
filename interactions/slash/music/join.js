// Deconstructed the constants we need in this file.

const { Constants, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { ChannelType } = require("discord-api-types/v10");
const { SlashCommandBuilder } = require("@discordjs/builders");
const SuccessEmbed = require("../../../constants/embeds/SuccessEmbed");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("join")
		.setDescription("Join a voice based channel")
		.addChannelOption((option) =>
			option
				.setName("destination")
				.setDescription("Select a voice channel")
				.addChannelTypes(ChannelType.GuildStageVoice, ChannelType.GuildVoice)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Connect),
	// inVoiceChannel: true,
    skip: true,
	category: "music",
	async execute(interaction) {
		const { client, message, guild } = interaction;

		let voiceChannel =
			interaction.options.getChannel("destination") ||
			interaction.member.voice.channel ||
			interaction.channel;

		if (!Constants.VoiceBasedChannelTypes.includes(voiceChannel?.type)) {
			throw new Error(`${voiceChannel} is not a valid voice channel!`)
		}

		interaction.reply({
			embeds: [new SuccessEmbed(`Joined ${voiceChannel}`)],
			// ephemeral: true,
		});

		client.distube.voices.join(voiceChannel);
	},
};

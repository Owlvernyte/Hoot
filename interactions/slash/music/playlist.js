// Deconstructed the constants we need in this file.

const { SlashCommandBuilder } = require("@discordjs/builders");
const SuccessEmbed = require("../../../constants/embeds/SuccessEmbed");
const { use_database } = require("../../../config.json");
const ErrorEmbed = require("../../../constants/embeds/ErrorEmbed");
const { playlistCreate } = require("../../../modules/playlist/playlistCreate");
const { playlistManage } = require("../../../modules/playlist/playlistManage");
const { playlistPlay } = require("../../../modules/playlist/playlistPlay");
const { playlistDelete } = require("../../../modules/playlist/playlistDelete");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("playlist")
		.setDescription("Playlist")
		.addSubcommand((sub) =>
			sub
				.setName("create")
				.setDescription("Create a new playlist")
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription("Enter playlist name")
						// .setMinLength(2)
						// .setMaxLength(100)
						.setRequired(true)
				)
		)
		.addSubcommand((sub) =>
			sub
				.setName("manage")
				.setDescription("Manage your playlists")
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription("Enter playlist name")
						.setRequired(true)
						.setAutocomplete(true)
				)
		)
		.addSubcommand((sub) =>
			sub
				.setName("play")
				.setDescription("Play your playlist")
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription("Enter playlist name")
						.setRequired(true)
						.setAutocomplete(true)
				)
		)
		.addSubcommand((sub) =>
			sub
				.setName("delete")
				.setDescription("Delete a playlist")
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription("Enter playlist name")
						.setRequired(true)
						.setAutocomplete(true)
				)
		),
	// inVoiceChannel: true,
	category: "music",
	skip: !use_database,
	// maintain: true,
	async execute(interaction) {
		const { client } = interaction;
		const subcommand = interaction.options.getSubcommand();
		const name = interaction.options.getString("name");
		await interaction.deferReply({ ephemeral: true });

		try {
			switch (subcommand) {
				case "create":
					await playlistCreate(interaction, name);
					break;
				case "manage":
					await playlistManage(interaction, name);
					break;
				case "play":
					await playlistPlay(interaction, name);
					break;
				case "delete":
					await playlistDelete(interaction, name);
					break;
			}
		} catch (error) {
			interaction.editReply({
				embeds: [new ErrorEmbed(`\`\`\`${error.message}\`\`\``)],
			});
			console.error(error);
		}
	},
	async autocomplete(interaction) {
		const { client } = interaction;
		const { db } = client;
		const subcommand = interaction.options.getSubcommand();

		const userPlaylistsModels = await db.models.Playlists.findAll({
			where: {
				playlistOwnerId: interaction.user.id,
			},
		});

		const userPlaylists = userPlaylistsModels.map((model) => ({
			name: model.dataValues.playlistId,
			length: model.dataValues.data.songs.length,
		}));

		await interaction.respond(
			userPlaylists.map((result) => ({
				name: `${result.name} - ${result.length} songs`,
				value: `${result.name}`,
			}))
		);
	},
};

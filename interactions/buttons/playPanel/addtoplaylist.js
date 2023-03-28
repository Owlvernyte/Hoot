const {
	ActionRowBuilder,
} = require("discord.js");
const InfoEmbed = require("../../../constants/embeds/InfoEmbed");

module.exports = {
	id: "addtopl",

	async execute(interaction) {
		const { client, guild, message } = interaction;

		let song = {
			name: message.embeds[0].title,
			url: message.embeds[0].url,
		};

		const userPlaylistsModels = await client.db.models.Playlists.findAll({
			where: {
				playlistOwnerId: interaction.user.id,
			},
		});

		if (!userPlaylistsModels.length)
			throw new Error(
				`You have no playlist! Create one by using \`/playlist create\``
			);

		const userPlaylistOpitons = userPlaylistsModels.map((model) => ({
			label: `${model.dataValues.playlistId}`,
			description: `${model.dataValues.data.songs.length} songs`,
			value: `${model.dataValues.playlistId}`,
		}));

		const Embed = new InfoEmbed(
			`Which playlist you want to add [\`${song.name}\`](${song.url}) to?`
		)
			.setTitle(song.name)
			.setURL(song.url);

		const row = (state) =>
			new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId("addtopl")
					.setPlaceholder("Select a playlist...")
					.setDisabled(state)
					.addOptions(userPlaylistOpitons)
			);

		await interaction.reply({
			embeds: [Embed],
			components: [row(false)],
			ephemeral: true,
		});

		return;
	},
};

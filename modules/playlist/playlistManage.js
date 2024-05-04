const playlistManagePanel = require("../../constants/embeds/playlistManage");
const playlistManageComponents = require("../../constants/components/playlistManage");
const ErrorEmbed = require("../../constants/embeds/ErrorEmbed");

/**
 * Asynchronously manages a playlist.
 *
 * @param {import('discord.js').Interaction} interaction - The interaction object.
 * @param {string} name - The name of the playlist to manage.
 * @return {Promise<void>} A promise that resolves after attempting to manage the playlist.
 */
async function playlistManage(interaction, name) {
	const { client } = interaction;

	const exist = await client.db.models.Playlists.findOne({
		where: {
			playlistOwnerId: interaction.user.id,
			playlistId: `${name}`,
		},
	});

	if (exist === null)
		return interaction.editReply({
			embeds: [new ErrorEmbed(`That playlist doesn't exist!`)],
		});

	await interaction.editReply({
		embeds: playlistManagePanel(
			exist.dataValues.data.songs,
			exist.dataValues.playlistId
		),
		components: [
			playlistManageComponents(
				false,
				exist.dataValues.data.songs,
				exist.dataValues.playlistId
			),
		],
		ephemeral: true,
	});
}

module.exports = { playlistManage };

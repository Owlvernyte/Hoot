const ErrorEmbed = require('../../constants/embeds/ErrorEmbed');
const SuccessEmbed = require('../../constants/embeds/SuccessEmbed');

/**
 * Deletes a playlist based on the provided name.
 *
 * @param {import('discord.js').Interaction} interaction - The interaction object.
 * @param {string} name - The name of the playlist to delete.
 * @return {Promise<void>} A promise that resolves after attempting to delete the playlist.
 */
async function playlistDelete(interaction, name) {
	const { client } = interaction;

	// if (name === "Favorite")
	// 	return interaction.editReply({
	// 		content: `${client.emotes.error} | That playlist is a default playlist! You cannot delete that!`,
	// 	});

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

	const deleted = await client.db.models.Playlists.destroy({
		where: {
			playlistOwnerId: interaction.user.id,
			playlistId: `${name}`,
		},
	});

	if (deleted > 0) {
		interaction.editReply({
			embeds: [new SuccessEmbed(`Deleted!`)],
		});
	} else {
		interaction.editReply({
			embeds: [new ErrorEmbed(`Failed to delete`)],
		});
	}
}

module.exports = { playlistDelete };

const ErrorEmbed = require('../../constants/embeds/ErrorEmbed');
const SuccessEmbed = require('../../constants/embeds/SuccessEmbed');

/**
 * Creates a new playlist based on the provided name.
 *
 * @param {import('discord.js').Interaction} interaction - The interaction object.
 * @param {string} name - The name of the playlist to create.
 * @return {Promise<void>} A promise that resolves after the playlist creation.
 */
async function playlistCreate(interaction, name) {
	const { client } = interaction;

	// if (name === "Favorite")
	// 	return interaction.editReply({
	// 		content: `${client.emotes.error} | Uh oh! You should not create this playlist due to it is default playlist!`,
	// 	});

	const count = await client.db.models.Playlists.count({
		where: { playlistOwnerId: interaction.user.id },
	});

	if (count > 10)
		return interaction.editReply({
			embeds: [
				new ErrorEmbed(
					`You have reached maximum playlists (\`10\`). Delete some before create a new one!`
				),
			],
		});

	const [playlist, created] = await client.db.models.Playlists.findOrCreate({
		where: {
			playlistOwnerId: interaction.user.id,
			playlistId: `${name}`,
		},
		defaults: {
			playlistOwnerId: interaction.user.id,
			playlistId: `${name}`,
		},
	});

	if (!created)
		return interaction.editReply({
			embeds: [new ErrorEmbed(`You already have that playlist!`)],
		});

	interaction.editReply({
		embeds: [
			new SuccessEmbed(`Created **${playlist.dataValues.playlistId}**!`),
		],
	});
}

module.exports = { playlistCreate };

const ErrorEmbed = require('../../constants/embeds/ErrorEmbed');

/**
 * Plays a playlist in a voice channel.
 *
 * @param {import('discord.js').Interaction} interaction - The interaction object.
 * @param {string} name - The name of the playlist to play.
 * @return {Promise<void>} A promise that resolves when the playlist is played.
 */
async function playlistPlay(interaction, name) {
	const { client } = interaction;

	if (!interaction.member.voice.channel) {
		return interaction.reply({
			embeds: [new ErrorEmbed(`You must be in a voice channel!`)],
			ephemeral: true,
		});
	}

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

	if (!exist.dataValues.data.songs.length)
		return interaction.editReply({
			embeds: [new ErrorEmbed(`This playlist is empty! Add some songs!`)],
		});

	const playlist = await client.distube.createCustomPlaylist(
		exist.dataValues.data.songs,
		{
			member: interaction.member,
			properties: { name: `${exist.dataValues.playlistId}` },
			parallel: true,
		}
	);

	client.distube.play(interaction.member.voice.channel, playlist, {
		member: interaction.member,
		textChannel: interaction.channel,
		metadata: {
			i: interaction,
		},
	});
}

module.exports = { playlistPlay };

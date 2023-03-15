const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");
const ErrorEmbed = require("../../../constants/embeds/ErrorEmbed");
const SuccessEmbed = require("../../../constants/embeds/SuccessEmbed");
const WarningEmbed = require("../../../constants/embeds/WarningEmbed");

module.exports = {
	id: "addtopl",

	async execute(interaction) {
		const { client, guild, message } = interaction;
		const song = message.embeds[0].url;

		const playlistId = interaction.values.shift();

		const exist = await client.db.models.Playlists.findOne({
			where: {
				playlistOwnerId: interaction.user.id,
				playlistId: `${playlistId}`,
			},
		});

		if (exist === null)
			return interaction.reply({
				embeds: [new ErrorEmbed(`This playlist doesn't exist!`)],
				ephemeral: true,
			});

		let duplicated = exist.dataValues.data.songs.includes(song);

		const components = (state) => [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId("voteYes")
					.setStyle(ButtonStyle.Success)
					.setDisabled(state)
					.setLabel("Yes"),
				new ButtonBuilder()
					.setCustomId("voteNo")
					.setStyle(ButtonStyle.Danger)
					.setDisabled(state)
					.setLabel("No")
			),
		];

		const Embed = new WarningEmbed(
			`That song is already been in your **Favorite** playlist! Are you sure that you want to add more?`
		).setFooter({
			text: `You have 30 secs to confirm!`,
		});

		if (duplicated) {
			interaction.reply({
				embeds: [Embed],
				components: components(false),
				ephemeral: true,
			});
			const msg = await interaction.fetchReply();
			const filter = (i) =>
				(i.customId === "voteYes" || i.customId === "voteNo") &&
				i.user.id === interaction.user.id;
			msg
				.awaitMessageComponent({ filter, time: 30_000 })
				.then(async (i) => {
					if (i.customId === "voteNo") {
						i.update({
							embeds: [new ErrorEmbed(`Cancelled!`)],
							components: [],
							ephemeral: true,
						});
					} else if (i.customId === "voteYes") {
						i.update({
							embeds: [await addSong()],
							components: [],
							ephemeral: true,
						});
					}
				})
				.catch((error) => {
					console.error(error.message);
					interaction.editReply({
						embeds: [
							Embed.setFooter({
								text: `Time out!`,
							}),
						],
						components: components(true),
					});
				});
		} else {
			await interaction.reply({
				embeds: [await addSong()],
				ephemeral: true,
			});
		}

		async function addSong() {
			const songsToAdd = [...exist.dataValues.data.songs, song];

			const affectedRows = await client.db.models.Playlists.update(
				{
					data: {
						songs: songsToAdd,
					},
				},
				{
					where: {
						playlistOwnerId: exist.dataValues.playlistOwnerId,
						playlistId: exist.dataValues.playlistId,
					},
				}
			);

			return affectedRows > 0
				? new SuccessEmbed(
						`Added \`${song}\` to your **${exist.dataValues.playlistId}** playlist!`
				  )
				: new ErrorEmbed(
						`Failed to add \`${song}\` to your **${exist.dataValues.playlistId}** playlist`
				  );
		}

		return;
	},
};

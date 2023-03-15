const {
	EmbedBuilder,
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require("discord.js");
const { URL } = require("url");
const ErrorEmbed = require("../../../constants/embeds/ErrorEmbed");
const SuccessEmbed = require("../../../constants/embeds/SuccessEmbed");

module.exports = {
	id: "pladdsong",

	async execute(interaction) {
		const { client, guild, message } = interaction;
		// console.log(client.distube.handler);
		const name = message.embeds[0].title;

		const exist = await client.db.models.Playlists.findOne({
			where: {
				playlistOwnerId: interaction.user.id,
				playlistId: `${name}`,
			},
		});

		if (exist === null)
			return interaction.reply({
				embeds: [new ErrorEmbed(`This playlist doesn't exist!`)],
				ephemeral: true,
			});

		const songsInput = new TextInputBuilder()
			.setCustomId("links")
			.setRequired(true)
			.setPlaceholder(
				"Enter song links...\nSupport YouTube and SoundCloud links only"
			)
			.setLabel("Song links (one link per line)")
			.setStyle(TextInputStyle.Paragraph);

		const modal = new ModalBuilder()
			.setCustomId("pladdsong")
			.setTitle(`Add song to Playlist`)
			.addComponents(new ActionRowBuilder().addComponents(songsInput));

		interaction.showModal(modal);

		const filter = (i) => i.customId === "pladdsong";

		interaction
			.awaitModalSubmit({ filter, time: 60_000 })
			.then(async (i) => {
				try {
					await i.deferReply({
						ephemeral: true,
					});

					const links = i.fields.getTextInputValue("links").trim().split("\n");

					const resolved = await client.distube.createCustomPlaylist(links);

					async function addSong() {
						const songsToAdd = [
							...exist.dataValues.data.songs,
							...resolved.songs.map((song) => song.url),
						];

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

						return `${
							affectedRows > 0
								? `${client.emotes.success} | Added \`${resolved.songs.length}\` songs to your **${exist.dataValues.playlistId}** playlist!`
								: `${client.emotes.error} | Failed to add \`${resolved.songs.length}\` to your **${exist.dataValues.playlistId}** playlist`
						}`;
					}

					await i.editReply({
						embeds: [new SuccessEmbed(`${await addSong()}`)],
					});
				} catch (error) {
					await i.editReply({
						embeds: [new ErrorEmbed(`${error.message}`)],
					});
				}
			})
			.catch(console.error);
	},
};

// function getValidLink(input) {
// 	if (typeof input !== "string" || input.includes(" ")) return false;
// 	try {
// 		const url = new URL(input);
// 		if (!["https:", "http:"].includes(url.protocol) || !url.host) return false;
// 	} catch {
// 		return false;
// 	}

// 	const url = new URL(input);
// 	const hostname = url.hostname.split(".").slice(-2).join(".");

// 	const acceptedYtHostname = ["youtube.com", "youtu.be"];
// 	const acceptedScHostname = ["soundcloud.com"];

// 	if (![...acceptedScHostname, ...acceptedYtHostname].includes(hostname))
// 		return false;

// 	if (hostname === "youtube.com") {
// 		if (url.pathname !== "/watch" || !url.searchParams.has("v")) return false;
// 		else return `https://${url.hostname}/watch?v=${url.searchParams.get("v")}`;
// 	} else if (hostname === "youtu.be")
// 		return `https://www.youtube.com/watch?v=${url.pathname.split("/")[1]}`;
// 	else if (hostname === "soundcloud.com") {
// 		const pathnameArray = url.pathname.split("/").slice(1);
// 		if (
// 			pathnameArray.length <= 0 ||
// 			pathnameArray.length > 2 ||
// 			pathnameArray[1] === "sets"
// 		)
// 			return false;
// 		else return `https://soundcloud.com${url.pathname}`;
// 	}
// }

// function isValidLink(input) {
// 	return typeof getValidLink(input) === "boolean" ||
// 		typeof getValidLink(input) === "Boolean"
// 		? false
// 		: true;
// }

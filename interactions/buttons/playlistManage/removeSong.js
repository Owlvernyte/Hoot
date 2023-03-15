const {
	EmbedBuilder,
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
} = require("discord.js");
const ErrorEmbed = require("../../../constants/embeds/ErrorEmbed");

module.exports = {
	id: "pldelsong",

	async execute(interaction) {
		const { client, guild, message } = interaction;
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
	},
};

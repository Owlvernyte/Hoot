module.exports = {
	id: "plrefresh",

	async execute(interaction) {
		const { client, guild, message } = interaction;
		const name = message.embeds[0].title;

		const exist = await client.db.models.Playlists.findOne({
			where: {
				playlistOwnerId: interaction.user.id,
				playlistId: `${name}`,
			},
		});

		if (exist === null) throw new Error(`This playlist doesn't exist!`);

		const managePanel = require("../../../constants/embeds/playlistManage");

		const components = require("../../../constants/components/playlistManage");

		await interaction.update({
			embeds: managePanel(
				exist.dataValues.data.songs,
				exist.dataValues.playlistId
			),
			components: [
				components(
					false,
					exist.dataValues.data.songs,
					exist.dataValues.playlistId
				),
			],
		});
	},
};

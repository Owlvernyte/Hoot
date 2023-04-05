module.exports = {
	id: "pre-track",

	async execute(interaction) {
        const {client, guild} = interaction
        const queue = client.distube.getQueue(guild);

		if (!queue) throw new Error("There is nothing playing!");
		require("../../slash/music/previous").execute(interaction)
	},
};

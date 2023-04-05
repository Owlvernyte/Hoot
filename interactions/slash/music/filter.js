// Deconstructed the constants we need in this file.

const { SlashCommandBuilder } = require("@discordjs/builders");
const SuccessEmbed = require("../../../constants/embeds/SuccessEmbed");
const defaultFilters = Object.keys(require("distube").defaultFilters).map(
	(mf) => {
		return {
			name: `${mf.toLocaleUpperCase()}`,
			value: mf,
		};
	}
);

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("filter")
		.setDescription("Add or remove filter(s)")
		.addStringOption((option) =>
			option
				.setName("filter")
				.setDescription("Choose a filter")
				.setRequired(true)
				.addChoices({
					name: "OFF",
					value: "off",
				})
				.addChoices(...defaultFilters)
		),
	inVoiceChannel: true,
	category: "music",
	queueRequired: true,
	async execute(interaction) {
		const { client, guild } = interaction;

		const queue = client.distube.getQueue(guild);

        if (queue.starter.user.id != interaction.user.id)
			throw new Error(`You have no right to do this!`);

		const filter = interaction.options.getString("filter");

		if (filter === "off" && queue.filters.size) queue.filters.clear();
		else if (Object.keys(client.distube.filters).includes(filter)) {
			if (queue.filters.has(filter)) queue.filters.remove(filter);
			else queue.filters.add(filter);
		}

		interaction.reply({
			embeds: [
				new SuccessEmbed(
					`\`${queue.filters.names.join(", ") || "None"}\``
				).setTitle(`Current Queue Filter`),
			],
		});

        client.emit("updatePanel", interaction);
	},
};

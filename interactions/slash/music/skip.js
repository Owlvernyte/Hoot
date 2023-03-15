// Deconstructed the constants we need in this file.

const { SlashCommandBuilder } = require("@discordjs/builders");
const SuccessEmbed = require("../../../constants/embeds/SuccessEmbed");
const ErrorEmbed = require("../../../constants/embeds/ErrorEmbed");
const InfoEmbed = require("../../../constants/embeds/InfoEmbed");
// const sequelize = require("sequelize");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skip currently playing song")
		.addBooleanOption((option) =>
			option
				.setName("force")
				.setDescription(`Force to skip a song (without vote)`)
		),
	inVoiceChannel: true,
	category: "music",
	async execute(interaction) {
		const { client, message, guild } = interaction;

		const force = interaction.options?.getBoolean
			? interaction.options.getBoolean("force")
			: false;
		const queue = client.distube.getQueue(guild);

		if (!queue)
			return interaction.reply({
				embeds: [new ErrorEmbed("There is nothing playing!")],
				ephemeral: true,
			});

		async function skip() {
			try {
				const song = await queue.skip();

				interaction.reply({
					embeds: [
						new SuccessEmbed(`Skipped!`).addFields({
							name: `Now Playing`,
							value: `[\`${song.name}\`](${song.url})`,
						}),
					],
				});
			} catch (error) {
				interaction.reply({
					embeds: [new ErrorEmbed(`${error.message}`)],
					ephemeral: true,
				});
			}
		}

		if (force && interaction.user.id == queue.starter.user.id) return skip();

		const membersInVoice = interaction.member.voice.channel.members.size;

		const required = Math.ceil(membersInVoice / 2);

		if (queue.skipVotes.has(interaction.user.id)) {
			if (queue.starter.user.id == interaction.user.id) {
				queue.skipVotes.clear();
				skip();
			} else
				return interaction.reply({
					embeds: [new ErrorEmbed(`You have already voted!`)],
					ephemeral: true,
				});
		}

		queue.skipVotes.set(interaction.user.id, interaction.member);

		if (queue.skipVotes.size < required)
			interaction.reply({
				embeds: [
					new InfoEmbed(
						`${
							queue.skipVotes.size
						}/${required} skip votes\nVotes: ${queue.skipVotes
							.map((v) => `${v}`)
							.join(", ")}`
					),
				],
			});
		else if (queue.skipVotes.size >= required) {
			queue.skipVotes.clear();
			skip();
		}
	},
};

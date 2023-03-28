// Deconstructed the constants we need in this file.

const { SlashCommandBuilder } = require("@discordjs/builders");
const SuccessEmbed = require("../../../constants/embeds/SuccessEmbed");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("previous")
		.setDescription("Play previous song")
		.addBooleanOption((option) =>
			option
				.setName("force")
				.setDescription(`Force to previous a song (without vote)`)
		),
	inVoiceChannel: true,
	category: "music",
	queueRequired: true,
	async execute(interaction) {
		const { client, message, guild } = interaction;

		const force = interaction.options?.getBoolean
			? interaction.options.getBoolean("force")
			: false;
		const queue = client.distube.getQueue(guild);

		async function previous() {
			const song = await queue.previous();

			interaction.reply({
				embeds: [
					new SuccessEmbed(`Backed!`).addFields({
						name: `Now Playing`,
						value: `[\`${song.name}\`](${song.url})`,
					}),
				],
			});
		}

		if (force && interaction.user.id == queue.starter.user.id)
			return previous();

		const membersInVoice = interaction.member.voice.channel.members.size;

		const required = Math.ceil(membersInVoice / 2);

		if (queue.backVotes.has(interaction.user.id)) {
			if (queue.starter.user.id == interaction.user.id) {
				queue.backVotes.clear();
				previous();
			} else throw new Error(`You have already voted!`);
		}

		queue.backVotes.set(interaction.user.id, interaction.member);

		if (queue.backVotes.size < required)
			interaction.reply({
				embeds: [
					new SuccessEmbed(
						`${
							queue.backVotes.size
						}/${required} back votes\nVotes: ${queue.backVotes
							.map((v) => `${v}`)
							.join(", ")}`
					),
				],
			});
		else if (queue.backVotes.size >= required) {
			queue.backVotes.clear();
			previous();
		}
	},
};

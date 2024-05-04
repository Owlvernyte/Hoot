// Deconstructed the constants we need in this file.

const { SlashCommandBuilder } = require("@discordjs/builders");
const SuccessEmbed = require("../../../constants/embeds/SuccessEmbed");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("claim")
		.setDescription("Claim the queue in case the owner left"),
	category: "music",
	inVoiceChannel: true,
	queueRequired: true,
	async execute(interaction) {
		const { client, guildId, member } = interaction;

		const queue = client.distube.getQueue(guildId);

        if(member.voice.channel.members.has(queue.starter.id))
            throw new Error(`You have no right to do this!`)

        queue.starter = member;

		interaction.reply({
			embeds: [new SuccessEmbed(`Claimed!`)],
		});

        client.emit("updatePanel", interaction);
	}
};

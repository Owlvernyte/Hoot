import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { codeBlock } from '@sapphire/utilities';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Check the bot uptime!'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const { client } = this.container

        let totalSeconds = (client.uptime || -1) / 1000
        let days = Math.floor(totalSeconds / 86400)
        totalSeconds %= 86400
        let hours = Math.floor(totalSeconds / 3600)
        totalSeconds %= 3600
        let minutes = Math.floor(totalSeconds / 60)
        let seconds = Math.floor(totalSeconds % 60)
        let uptime = `${days}d${hours}h${minutes}m${seconds}s`

        const embed = new EmbedBuilder().setColor('Random').addFields([
            {
                name: `Online`,
                value: codeBlock(uptime),
                inline: false,
            },
            {
                name: `API Latency`,
                value: codeBlock(Math.round(client.ws.ping) + 'ms'),
                inline: true,
            },
            {
                name: `Client Latency`,
                value: codeBlock(
                    Math.round(Date.now() - interaction.createdTimestamp) + 'ms'
                ),
                inline: true,
            },
        ])

        return interaction.reply({
            embeds: [embed],
        })
	}
}

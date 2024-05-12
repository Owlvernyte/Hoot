import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { SuccessEmbed } from '../../messages';
// import { HootBaseError } from '../../lib/errors/HootBaseError';

@ApplyOptions<Command.Options>({
	description: 'Leave the current voice',
	preconditions: ['InVoice', 'InQueueWithOwner'],
    runIn: ['GUILD_ANY']
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
		const { guild } = interaction;

		// const queue = this.container.distube.getQueue(guild!);

		// if (queue?.owner?.user.id != interaction.user.id) throw new HootBaseError(`You have no right to do this!`, interaction);

		this.container.distube.voices.leave(guild!);

		return interaction.reply({
			embeds: [new SuccessEmbed(`See yah!`)]
		});
	}
}

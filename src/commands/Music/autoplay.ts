import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { CustomEvents } from '../../lib/constants';
import { SuccessEmbed } from '../../messages';

@ApplyOptions<Command.Options>({
	description: "Toggle autoplay mode",
	preconditions: ['InVoice', 'InQueueWithOwner']
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

		if (!guild) throw new Error('Guild should not be null');

		const queue = this.container.distube.getQueue(guild);

		if (!queue) throw new Error('There is nothing playing!');

		const autoplay = queue.toggleAutoplay();

		this.container.client.emit(CustomEvents.UpdatePanel, interaction);

		return interaction.reply({
			embeds: [new SuccessEmbed(`Autoplay is now ${autoplay ? 'enabled' : 'disabled'}!`)]
		});
	}
}

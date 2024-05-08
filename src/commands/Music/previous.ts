import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { voteAction } from '../../lib/distube/voteAction';

@ApplyOptions<Command.Options>({
	description: 'Play previous song',
	preconditions: ['InVoice', 'InQueue']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addBooleanOption((option) => option.setName('force').setDescription(`Force to previous a song (without vote)`))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		return voteAction(interaction, 'previous');
	}
}

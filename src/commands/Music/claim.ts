import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { CustomEvents } from '../../lib/constants';
import { SuccessEmbed } from '../../messages';
import { HootBaseError } from '../../lib/errors/HootBaseError';

@ApplyOptions<Command.Options>({
	description: 'Claim the queue in case the owner left',
	preconditions: ['InVoice', 'InQueue']
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

		if (!guild) throw new HootBaseError('Guild should not be null');

		const member = await interaction.guild?.members.fetch(interaction.user.id);

		if (!member) throw new HootBaseError('Member should not be null');

		const queue = this.container.distube.getQueue(guild.id);

		if (!queue) throw new HootBaseError('There is nothing playing!');

		const voiceChannel = await interaction.guild?.channels.fetch(member.voice.channelId!);

		if (!voiceChannel?.isVoiceBased()) throw new HootBaseError('Should be a voice channel!');

		if (queue.owner && voiceChannel?.members.has(queue.owner.id)) throw new HootBaseError(`You have no right to do this!`, interaction);

		queue.owner = member;

		this.container.client.emit(CustomEvents.UpdatePanel, interaction);

		return interaction.reply({
			embeds: [new SuccessEmbed(`You are now the owner of the queue!`)]
		});
	}
}

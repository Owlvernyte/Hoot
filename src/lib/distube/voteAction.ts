import { ChatInputCommandInteraction, ButtonInteraction } from 'discord.js';
import { SuccessEmbed, InfoEmbed } from '../../messages';
import { HootBaseError } from '../errors/HootBaseError';
import { container } from '@sapphire/framework';

export type VoteAction = 'skip' | 'previous';
export type AcceptableInteraction = ChatInputCommandInteraction | ButtonInteraction;

/**
 * Handles the voting for skip and previous track buttons.
 *
 * If the interaction is a button interaction, it will not require a force flag.
 * If the interaction is a slash command, it will require a force flag.
 *
 * Checks if the vote already exists in the queue's skipVotes or backVotes collections.
 *
 * If the vote is successful, it will run the action function and reply with a SuccessEmbed.
 *
 * If the vote is not successful, it will reply with an InfoEmbed with the current vote count.
 *
 * @param interaction The interaction to handle.
 * @param action The vote action to take.
 */
export async function voteAction(interaction: AcceptableInteraction, action: VoteAction) {
	const { guild } = interaction;

	const force = interaction instanceof ButtonInteraction ? false : interaction.options.getBoolean('force') || false;

	const queue = container.distube.getQueue(guild!.id)!;

	async function actionFn() {
		const song = action === 'skip' ? await queue.skip() : await queue.previous();

		return interaction.reply({
			embeds: [
				new SuccessEmbed(action === 'skip' ? 'Skipped!' : 'Backed!').addFields({
					name: `Now Playing`,
					value: `[\`${song.name}\`](${song.url})`
				})
			]
		});
	}

	if (force && interaction.user.id == queue?.owner?.user.id) return actionFn();

	const membersInVoice = queue.voiceChannel?.members.filter((m) => !m.user.bot).size || 0;

	const requiredSize = Math.ceil(membersInVoice / 2);

	const checkExistedVote = action === 'skip' ? queue.skipVotes.has(interaction.user.id) : queue.backVotes.has(interaction.user.id);
	if (checkExistedVote) {
		if (queue?.owner?.user.id == interaction.user.id) {
			return actionFn();
		} else throw new HootBaseError(`You have already voted!`, interaction);
	}

	const member = await interaction.guild?.members.fetch(interaction.user.id);

	if (!member) {
		throw new HootBaseError('Member should not be null', interaction);
	}

	const voteList = action === 'skip' ? queue.skipVotes : queue.backVotes;

	voteList.set(member.id, member);

	const size = action === 'skip' ? queue.skipVotes.size : queue.backVotes.size;
	if (size < requiredSize) {
		return interaction.reply({
			embeds: [
				new InfoEmbed(
					`${size}/${requiredSize} ${action === 'skip' ? 'skip' : 'back'} votes\nVotes: ${voteList.map((v) => `${v}`).join(', ')}`
				)
			]
		});
	}

	return actionFn();
}

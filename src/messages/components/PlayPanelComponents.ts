import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder } from 'discord.js';
import emojiesJson from '../../lib/emojies.json';
import { HootQueue } from '../../lib/distube/HootQueue';

export class PlayPanelComponents {
	static create(state: boolean, queue: HootQueue): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
		return [
			new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId('pause')
					.setDisabled(state)
					.setEmoji(emojiesJson.playorpause)
					.setStyle(queue.paused ? ButtonStyle.Danger : ButtonStyle.Secondary),
				new ButtonBuilder().setCustomId('next-track').setDisabled(state).setEmoji(emojiesJson.next).setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('volumeup')
					.setDisabled(queue.volume >= 100 ? true : state)
					.setEmoji(emojiesJson.volume.high)
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder().setCustomId('shuffle').setDisabled(state).setEmoji(emojiesJson.shuffle).setStyle(ButtonStyle.Secondary)
			),
			new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId('autoplay')
					.setDisabled(state)
					.setEmoji(emojiesJson.autoplay)
					.setStyle(queue.autoplay ? ButtonStyle.Success : ButtonStyle.Danger),
				new ButtonBuilder().setCustomId('pre-track').setDisabled(state).setEmoji(emojiesJson.previous).setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('volumedown')
					.setDisabled(queue.volume <= 0 ? true : state)
					.setEmoji(emojiesJson.volume.medium)
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('loop')
					.setDisabled(state)
					.setEmoji(queue.repeatMode ? (queue.repeatMode === 2 ? emojiesJson.loop.queue : emojiesJson.loop.song) : emojiesJson.loop.queue)
					.setStyle(queue.repeatMode ? ButtonStyle.Secondary : ButtonStyle.Danger)
			)
		];
	}
}

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder } from 'discord.js';
import emojiesJson from '../../lib/emojies.json';
import { HootQueue } from '../../lib/distube/HootQueue';
import { ButtonCustomIds } from '../../lib/constants';

export class PlayPanelComponents {
	static create(state: boolean, queue: HootQueue): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
		return [
			new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId(ButtonCustomIds.Pause)
					.setDisabled(state)
					.setEmoji(emojiesJson.playorpause)
					.setStyle(queue.paused ? ButtonStyle.Danger : ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId(ButtonCustomIds.NextTrack)
					.setDisabled(state)
					.setEmoji(emojiesJson.next)
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId(ButtonCustomIds.VolumeUp)
					.setDisabled(queue.volume >= 100 ? true : state)
					.setEmoji(emojiesJson.volume.high)
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId(ButtonCustomIds.Shuffle)
					.setDisabled(state)
					.setEmoji(emojiesJson.shuffle)
					.setStyle(ButtonStyle.Secondary)
			),
			new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId(ButtonCustomIds.AutoPlay)
					.setDisabled(state)
					.setEmoji(emojiesJson.autoplay)
					.setStyle(queue.autoplay ? ButtonStyle.Success : ButtonStyle.Danger),
				new ButtonBuilder()
					.setCustomId(ButtonCustomIds.PreviousTrack)
					.setDisabled(state)
					.setEmoji(emojiesJson.previous)
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId(ButtonCustomIds.VolumeDown)
					.setDisabled(queue.volume <= 0 ? true : state)
					.setEmoji(emojiesJson.volume.medium)
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId(ButtonCustomIds.Loop)
					.setDisabled(state)
					.setEmoji(queue.repeatMode ? (queue.repeatMode === 2 ? emojiesJson.loop.queue : emojiesJson.loop.song) : emojiesJson.loop.queue)
					.setStyle(queue.repeatMode ? ButtonStyle.Secondary : ButtonStyle.Danger)
			)
		];
	}
}

import type { ChatInputCommandSuccessPayload, Command, ContextMenuCommandSuccessPayload, MessageCommandSuccessPayload } from '@sapphire/framework';
import { container } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Cron } from '@sapphire/time-utilities';
import { cyan } from 'colorette';
import {
	ActivityOptions,
	ActivityType,
	bold,
	ChatInputCommandInteraction,
	EmbedBuilder,
	type APIUser,
	type Guild,
	type Message,
	type User
} from 'discord.js';
import { schedule as cronSchedule } from 'node-cron';
import { RandomLoadingMessage, statusCronTime } from './constants';
import { HootQueue } from './distube/HootQueue';
import images from './images.json';

/**
 * Picks a random item from an array
 * @param array The array to pick a random item from
 * @example
 * const randomEntry = pickRandom([1, 2, 3, 4]) // 1
 */
export function pickRandom<T>(array: readonly T[]): T {
	const { length } = array;
	return array[Math.floor(Math.random() * length)];
}

/**
 * Sends a loading message to the current channel
 * @param message The message data for which to send the loading message
 */
export function sendLoadingMessage(message: Message): Promise<typeof message> {
	return send(message, { embeds: [new EmbedBuilder().setDescription(pickRandom(RandomLoadingMessage)).setColor('#FF0000')] });
}

/**
 * Reply interaction with a loading message
 * @param interaction The interaction data for which to send the loading message
 */
export function replyLoadingChatInputInteraction(interaction: ChatInputCommandInteraction): Promise<Message> {
	return interaction.reply({ embeds: [new EmbedBuilder().setDescription(pickRandom(RandomLoadingMessage)).setColor('#FF0000')], fetchReply: true });
}

export function logSuccessCommand(payload: ContextMenuCommandSuccessPayload | ChatInputCommandSuccessPayload | MessageCommandSuccessPayload): void {
	let successLoggerData: ReturnType<typeof getSuccessLoggerData>;

	if ('interaction' in payload) {
		successLoggerData = getSuccessLoggerData(payload.interaction.guild, payload.interaction.user, payload.command);
	} else {
		successLoggerData = getSuccessLoggerData(payload.message.guild, payload.message.author, payload.command);
	}

	container.logger.debug(`${successLoggerData.shard} - ${successLoggerData.commandName} ${successLoggerData.author} ${successLoggerData.sentAt}`);
}

export function getSuccessLoggerData(guild: Guild | null, user: User, command: Command) {
	const shard = getShardInfo(guild?.shardId ?? 0);
	const commandName = getCommandInfo(command);
	const author = getAuthorInfo(user);
	const sentAt = getGuildInfo(guild);

	return { shard, commandName, author, sentAt };
}

function getShardInfo(id: number) {
	return `[${cyan(id.toString())}]`;
}

function getCommandInfo(command: Command) {
	return cyan(command.name);
}

function getAuthorInfo(author: User | APIUser) {
	return `${author.username}[${cyan(author.id)}]`;
}

function getGuildInfo(guild: Guild | null) {
	if (guild === null) return 'Direct Messages';
	return `${guild.name}[${cyan(guild.id)}]`;
}

export function getQueueStatus(
	queue: HootQueue,
	isBold: boolean = true
): {
	volume: string;
	loop: string;
	filter: string;
	upNext: string;
} {
	const result = {
		volume: '',
		loop: '',
		filter: '',
		upNext: ''
	};

	const volumeIcon = queue.volume > 75 ? '🔊' : queue.volume > 25 ? '🔉' : queue.volume > 0 ? '🔈' : '🔇';

	result.volume = `${volumeIcon} ${queue.volume}%`;

	result.loop = queue.repeatMode ? (queue.repeatMode === 2 ? '🔁 Queue' : '🔂 This song') : '';

	result.filter = !queue.filters.names.length ? '' : `🎛 ${queue.filters.names.join(', ').toLocaleUpperCase()}`;

	if (isBold) {
		result.volume = bold(result.volume);
		if (!!result.filter) result.filter = bold(result.filter);
		if (!!result.loop) result.loop = bold(result.loop);
	}

	const nextSong = queue.songs[1];
	if (!nextSong || !nextSong.url || !nextSong.name) return result;

	// const upNextString = (name: string, url: string) => `\`🎵\` **Up Next**: [${name}](${url})`;

	result.upNext = `\`🎵\` **Up Next**: [\`${nextSong.name}\`](${nextSong.url})`;

	if (isBold) {
		result.upNext = bold(result.upNext);
	}

	return result;
}

export const getRandomActivity = (
	statuses: ActivityOptions[] = [
		{
			name: `${container.client.guilds.cache.size} servers | /play`,
			type: ActivityType.Watching
		},
		{
			name: `music | /play`,
			type: ActivityType.Listening
		},
		{
			name: `music in ${container.distube.queues.collection.size} servers | /play`,
			type: ActivityType.Playing
		}
	]
): ActivityOptions => pickRandom(statuses);

export function setupStatusChanger() {
	const { client } = container;

	client.user?.setActivity(getRandomActivity());

	const cronTime = new Cron(statusCronTime);

	container.logger.info(`[CRON/STATUS] StatusChanger installed with cron time: ${cronTime.cron}`);
	cronSchedule(cronTime.cron, () => {
		const status = getRandomActivity();
		container.logger.info(`[CRON] Status changed to ${status.name}`);
		client.user?.setActivity(status);
	});
}

export function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomHootString(oLength: number = 0, upperH: boolean = false, upperCase: boolean = false) {
	const min = 2,
		max = oLength <= 0 ? 10 : oLength > 10 ? 10 : oLength;
	const randomLength = getRandomInt(min, max);
	const oString = generateDuplicateString('o', randomLength);
	const content = `${upperH ? 'H' : 'h'}${oString}t`;
	return upperCase ? content.toUpperCase() : content;
}

export function generateDuplicateString(input: string, length: number) {
	return new Array(length).fill(input).join('');
}

/**
 * Converts a string to normal case, capitalizing the first letter and making the rest lowercase.
 * @param input - The string to be converted.
 * @returns The input string with the first letter capitalized and the rest in lowercase.
 */
export function normalCaseString(input: string) {
	return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

/**
 * Retrieves the details for a given source.
 * @param source - The source to get details for (e.g., 'youtube', 'soundcloud').
 * @returns An object containing the name and optionally an icon of the source.
 */
export function getDetailFromSource(source: string): {
	name: string;
	icon?: string;
} {
	switch (source) {
		case 'youtube':
			return {
				name: 'YouTube',
				icon: images.youtube
			};
		case 'soundcloud':
			return {
				name: 'SoundCloud',
				icon: images.soundcloud
			};
		default:
			return {
				name: normalCaseString(source)
			};
	}
}

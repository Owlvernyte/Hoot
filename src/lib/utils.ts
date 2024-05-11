import type { ChatInputCommandSuccessPayload, Command, ContextMenuCommandSuccessPayload, MessageCommandSuccessPayload } from '@sapphire/framework';
import { container } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { cyan } from 'colorette';
import {
	ActivityOptions,
	ActivityType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	type APIUser,
	type Guild,
	type Message,
	type User
} from 'discord.js';
import { Queue } from 'distube';
import { RandomLoadingMessage } from './constants';
import { schedule as cronSchedule } from 'node-cron';
import { Cron, predefined } from '@sapphire/time-utilities';

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

export function getQueueStatus(queue: Queue) {
	const volumeIcon = queue.volume > 75 ? '🔊' : queue.volume > 25 ? '🔉' : queue.volume > 0 ? '🔈' : '🔇';

	const loopMode = queue.repeatMode ? (queue.repeatMode === 2 ? '🔁 **Queue**' : '🔂 **This song**') : '';

	const filter = !queue.filters.names.length ? '' : `🎛 **${queue.filters.names.join(', ').toLocaleUpperCase()}**`;

	const autoplay = !!queue.autoplay ? `\`🅰\` **Up Next**: [\`${queue.songs[0].related[0].name}\`](${queue.songs[0].related[0].url})` : '';

	return {
		volume: `${volumeIcon} **${queue.volume}%**`,
		loop: `${loopMode}`,
		filter: `${filter}`,
		autoplay: `${autoplay}`
	};
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

	const cronTime = new Cron(predefined['@hourly']);

	container.logger.info('[CRON/STATUS] StatusChanger installed at 0 minutes past the hour, every 2 hours UTC');
	cronSchedule(cronTime.cron, () => {
		const status = getRandomActivity();
		container.logger.info(`[CRON] Status changed to ${status.name}`);
		client.user?.setActivity(status);
	});
}

export function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomHoot(oLength: number = 0, upperH: boolean = false, upperCase: boolean = false) {
	const min = 1,
		max = oLength <= 0 ? 10 : oLength > 10 ? 10 : oLength;
	const randomLength = getRandomInt(min, max);
	const oString = new Array(randomLength).fill('o').join('');
	const content = `${upperH ? 'H' : 'h'}${oString}t`;
	return upperCase ? content.toUpperCase() : content;
}

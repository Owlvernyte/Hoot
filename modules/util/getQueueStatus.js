/**
 *
 * @param {import("distube").Queue} queue
 * @returns
 */
const getQueueStatus = (queue) => {
	const volumeIcon =
		queue.volume > 75
			? "🔊"
			: queue.volume > 25
			? "🔉"
			: queue.volume > 0
			? "🔈"
			: "🔇";

	const loopMode = queue.repeatMode
		? queue.repeatMode === 2
			? "🔁 **Queue**"
			: "🔂 **This song**"
		: "";

	const filter = !queue.filters.names.length
		? ""
		: `🎛 **${queue.filters.names.join(", ").toLocaleUpperCase()}**`;

	const autoplay = !!queue.autoplay
		? `\`🅰\` **Up Next**: [\`${queue.songs[0].related[0].name}\`](${queue.songs[0].related[0].url})`
		: "";

	return {
		volume: `${volumeIcon} **${queue.volume}%**`,
		loop: `${loopMode}`,
		filter: `${filter}`,
		autoplay: `${autoplay}`,
	};
};

module.exports = getQueueStatus;

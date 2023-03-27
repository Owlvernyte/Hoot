// const { ShardingManager } = require("discord.js");
// const { token, topggToken, dev } = require("./config.json");
// const manager = new ShardingManager("./bot.js", { token: token });

// manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));

// manager
// 	.spawn()
// 	.catch((error) => console.error(`[ERROR/SHARD] Shard failed to spawn.`));

// if (dev !== "on") {
// 	const { AutoPoster } = require("topgg-autoposter");
// 	const ap = AutoPoster(topggToken, manager);

// 	ap.on("posted", () => {
// 		console.log("Posted stats to Top.gg!");
// 	});
// }

const { modules } = require("./config.json");
const bot = require("./bot");
const server = modules.use_server === "yes" ? require("./server") : null;

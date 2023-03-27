const statusChanger = require("../../modules/cron/statusChanger");
const backup = require("../../modules/cron/backup");
const { modules } = require("../../config.json");
module.exports = {
	name: "ready",
	once: true,
	/**
	 *
	 * @param {import("discord.js").Client} client
	 */
	execute(client) {
		console.log(`[BOT] Ready! Logged in as ${client.user.tag}`);

		modules.use_backup === "yes" && backup(client);
		modules.use_status_changer === "yes" && statusChanger(client);
	},
};

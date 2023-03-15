const statusChanger = require("../../modules/cron/statusChanger");
// const backup = require("../../modules/cron/backup");

module.exports = {
	name: "ready",
	once: true,
    /**
     *
     * @param {import("discord.js").Client} client
     */
	execute(client) {
		console.log(`[BOT] Ready! Logged in as ${client.user.tag}`);

		// backup(client);
		statusChanger(client);
	},
};

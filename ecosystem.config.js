const { bot_name } = require("./config.json");
module.exports = {
	apps: [
		{
			name: bot_name || "Hoot",
			script: "./index.js",
			env_production: {
				NODE_ENV: "production",
			},
			env_development: {
				NODE_ENV: "development",
			},
			watch: true,
		},
	],
};

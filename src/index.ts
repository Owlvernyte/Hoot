import './lib/setup';
import { HootClient } from './lib/HootClient';
import { LogLevel } from '@sapphire/framework';
import { GatewayIntentBits, Partials } from 'discord.js';

const client = new HootClient({
	defaultPrefix: '!',
	regexPrefix: /^(hey +)?bot[,! ]/i,
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.Debug
	},
	shards: 'auto',
	intents: [
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates
	],
	partials: [Partials.Channel, Partials.GuildMember, Partials.User],
	loadMessageCommandListeners: false,
	api: {
		automaticallyConnect: false
	},
	defaultCooldown: {
		delay: 5000
	}
});

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login();
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(error);
		await client.destroy();
		process.exit(1);
	}
};

void main();

// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import { ApplicationCommandRegistries, RegisterBehavior } from '@sapphire/framework';
import '@sapphire/plugin-api/register';
import '@sapphire/plugin-editable-commands/register';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-subcommands/register';
import { setup, type ArrayString } from '@skyra/env-utilities';
import * as colorette from 'colorette';
import { join } from 'path';
import { inspect } from 'util';
import { srcDir } from './constants';

// Set default behavior to bulk overwrite
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);

// Read env var
setup({ path: join(srcDir, '.env') });

// Set default inspection depth
inspect.defaultOptions.depth = 1;

// Enable colorette
colorette.createColors({ useColor: true });

declare module '@skyra/env-utilities' {
	interface Env {
		OWNERS: ArrayString;
		DEV_GUILD_ID: string;
		SUPPORT_SERVER_ID: string;
		SUPPORT_SERVER_INVITE_LINK: string;
		SUPPORT_URL: string;
	}
}

// Set Guilds IDs to register commands on needed
const dev = process.env.NODE_ENV !== 'production';
dev && ApplicationCommandRegistries.setDefaultGuildIds([process.env.DEV_GUILD_ID]);

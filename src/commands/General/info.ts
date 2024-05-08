import { ApplyOptions } from '@sapphire/decorators';
import { Command, version as sapphireVersion } from '@sapphire/framework';
import { EmbedBuilder, version as discordJsVersion } from 'discord.js';
import * as os from 'os';
import packageJson from '../../../package.json';
import { codeBlock } from '@sapphire/utilities';
import { APIEmbedField } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Get information about the bot'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const memTotal = await os.totalmem();
		const memFree = await os.freemem();
		const memUsed = memTotal - memFree;
		const memUsedInPercentage = Math.round((memUsed / memTotal) * 100);
		const processHeapUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
		const processHeapTotal = Math.round(process.memoryUsage().heapTotal / 1024 / 1024);
		const processHeapUsedInPercentage = Math.round((processHeapUsed / processHeapTotal) * 100);

		const sysMemoryUsage = `${memUsedInPercentage}% (TOTAL: ${Math.round(memTotal / (1024 * 1024 * 1024))}GB)`;

		const processField = `${processHeapUsedInPercentage}% (TOTAL: ${processHeapTotal}MB)`;

		const guildSize =
			this.container.client.shard == null
				? this.container.client.guilds.cache.size
				: await this.container.client.shard.fetchClientValues('guilds.cache.size');

		const memories = {
			[`SYSTEM`]: sysMemoryUsage,
			[`PROCESS`]: processField
		};

		const versions = {
			[`Node.js`]: `${process.version}`,
			[`Discord.js`]: `${discordJsVersion}`,
			[`Sapphire.js`]: `${sapphireVersion}`,
			[`DisTube.js`]: `${this.container.distube.version}`
		};

		const botSizes = {
			[`Shards`]: `${this.container.client?.shard?.count || 0}`,
			[`Servers`]: `${guildSize}`,
			[`Playing/Connected`]: `${this.container.distube.queues.collection.size}/${this.container.distube.voices.collection.size}`
		};

		const objectToCodeblock = (obj: any) =>
			codeBlock(
				Object.keys(obj)
					.map((key) => `${key}: ${obj[key]}`)
					.join('\n')
			);

		const fields: APIEmbedField[] = [
			{
				name: `MEMORY`,
				value: objectToCodeblock(memories),
				inline: true
			},
			{
				name: `VERSION`,
				value: objectToCodeblock(versions),
				inline: true
			},
			{
				name: `SIZES`,
				value: objectToCodeblock(botSizes),
				inline: true
			}
		];

		const embed = new EmbedBuilder()
			.setTitle(this.container.client.user?.username + "'s STAT (ver: " + packageJson.version + ')')
			.setColor('Random')
			.setThumbnail(this.container.client.user?.displayAvatarURL() || null)
			.addFields(...fields);

		return interaction.reply({
			embeds: [embed]
		});
	}
}

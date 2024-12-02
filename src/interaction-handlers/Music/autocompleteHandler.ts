import SoundCloudPlugin, { SearchType } from '@distube/soundcloud';
import { SearchResultType } from '@distube/youtube';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { AutocompleteInteraction, type ApplicationCommandOptionChoiceData } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class AutocompleteHandler extends InteractionHandler {
	public override async run(interaction: AutocompleteInteraction, result: ApplicationCommandOptionChoiceData[]) {
		return interaction.respond(result);
	}

	public override async parse(interaction: AutocompleteInteraction) {
		const results: ApplicationCommandOptionChoiceData[] = [];

		const focusedOption = interaction.options.getFocused(true);

		switch (focusedOption.name) {
			case 'song': {
				if (!focusedOption.value) return this.some(results);

				try {
					(
						await this.container.youtubePlugin.search(focusedOption.value, {
							limit: 10,
							type: SearchResultType.VIDEO,
							safeSearch: true
						})
					)
						.map((match) => this.optionParser(match.name, match.url, 'YouTube'))
						.slice(0, 10)
						.forEach((option) => results.push(option));
				} catch (error) {}

				try {
					(
						await this.container.distube.plugins
							.find((plugin) => plugin instanceof SoundCloudPlugin)
							?.search(focusedOption.value, SearchType.Track, 10)
					)
						?.map((match) => this.optionParser(match.name, match.url, 'SoundCloud'))
						.slice(0, 10)
						.forEach((option) => results.push(option));
				} catch (error) {}

				return this.some(results);
			}
			default:
				return this.none();
		}
	}

	optionParser(name: string | undefined, value: string | undefined, prefix?: string) {
        if (prefix) name = `${prefix} - ${name?.slice(0, 100 - (prefix.length + 5))}`;
        else name = `${name?.slice(0, 100)}`;
		value = `${value?.slice(0, 100)}`;

		return {
			name,
			value
		};
	}
}

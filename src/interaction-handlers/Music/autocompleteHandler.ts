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
		if (interaction.commandName !== 'play') return this.none();

		const focusedOption = interaction.options.getFocused(true);

		switch (focusedOption.name) {
			case 'song': {
				if (!focusedOption.value) return this.some([]);

				const searchResult = await this.container.youtubePlugin.search(focusedOption.value, {
					limit: 15,
					type: SearchResultType.VIDEO,
					safeSearch: true
				});

				return this.some(searchResult.map((match) => ({ name: match.name, value: match.url })));
			}
			default:
				return this.none();
		}
	}
}

import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { AutocompleteInteraction, type ApplicationCommandOptionChoiceData } from 'discord.js';
import { SearchResultType } from 'distube';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class AutocompleteHandler extends InteractionHandler {
	public override async run(interaction: AutocompleteInteraction, result: ApplicationCommandOptionChoiceData[]) {
		return interaction.respond(result);
	}

	public override async parse(interaction: AutocompleteInteraction) {
		if (interaction.commandName !== 'play') return this.none();
		// Get the focussed (current) option
		const focusedOption = interaction.options.getFocused(true);
		// Ensure that the option name is one that can be autocompleted, or return none if not.
		switch (focusedOption.name) {
			case 'song': {
				// Search for song!
				const searchResult = await this.container.distube.search(focusedOption.value, {
					limit: 15,
					type: SearchResultType.VIDEO
				});
				// Map the search results to the structure required for Autocomplete
				return this.some(searchResult.map((match) => ({ name: match.name, value: match.url })));
			}
			default:
				return this.none();
		}
	}
}

const option = new RegExp(Settings.getSetting('evoOpts').value);
const evoItems = Object.values(GameConstants.StoneType).filter((v) => option.test(v) && !Number.isInteger(v) && player.itemList[v]?.());
const evoIds = evoItems.map(i => GameConstants.StoneType[i]);
const needed = evoIds.flatMap(
	i => PokemonHelper.getPokemonsWithEvolution(i).flatMap(
		p => p.evolutions.filter(
			e => e.stone == i && EvolutionHandler.isSatisfied(e) && !App.game.party.alreadyCaughtPokemonByName(e.evolvedPokemon, true)
		)
	)
);

localSettings().state = needed.length;
if (!needed.length) {
	return;
}

ItemHandler.stoneSelected(GameConstants.StoneType[needed[0].stone]);
ItemHandler.pokemonSelected(needed[0].basePokemon);
ItemHandler.amountSelected(Number(Settings.getSetting('evoItemCount').value));
ItemHandler.useStones();

return srBot.log(needed[0].evolvedPokemon, `Stone - ${GameConstants.StoneType[needed[0].stone]}`, `Needed - ${needed.length}`);

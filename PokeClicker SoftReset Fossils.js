if (App.game.breeding.eggList[0]().type < 0) {
  const option = new RegExp(Settings.getSetting('fossilOpts').value);
  const fosItems = Object.keys(GameConstants.FossilToPokemon)
      .map(f => player.mineInventory().find(i => i.name == f))
      .filter((v) => v && option.test(v.name) && v.amount() && PartyController.getCaughtStatusByName(GameConstants.FossilToPokemon[v.name]) < CaughtStatus.CaughtShiny);

  if (!fosItems.length) {
      return;
  }

  const max = Settings.getSetting('maxEggs').value - 1;
  while (fosItems.length && fosItems[0].amount() && App.game.breeding.eggList[max]().type < 0) {
      Underground.sellMineItem(
          !!Settings.getSetting('fossilOpts').value
              ? fosItems[0].id
              : fosItems.shift().id
      );
  }
}
return srBot.hatch();

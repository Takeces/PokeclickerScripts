const tradeKey = [];
const shops = player.town().content.filter(c => c instanceof BerryMasterShop);
if (player.route() || !shops.length) {
	return;
}

let smnUsed = false;
for (let sdx = 0; sdx < shops.length; sdx++) {
	for (let idx = 0; idx < BerryDeal.list[shops[sdx].location]().length; idx++) {
		tradeKey.push(BerryDeal.list[shops[sdx].location]()[idx].item.itemType.name)
	}
}

const items = shops.map( shop => BerryDeal.list[shop.location]().filter(i => i instanceof BerryDeal && !App.game.party.alreadyCaughtPokemonByName(i.item.itemType.name, true)));
for (let sdx = 0; sdx < shops.length; sdx++) {
	ShopHandler.showShop(shops[sdx]);

	for (let idx = 0; idx < items[sdx].length; idx++) {
		if (BerryDeal.canUse(shops[sdx].location, idx)) {
			var smnName = items[sdx][idx].item.itemType.name;
			BerryDeal.use(shops[sdx].location, tradeKey.indexOf(items[sdx][idx].item.itemType.name), Number(Settings.getSetting('tradeItemCount').value));
			smnUsed = true;
			break;
		}
	}
}

localSettings().state = smnUsed;
if (!smnUsed) {
	return;
}

const smnNeed = items.flat().length;
return srBot.log(smnName, `Needed - ${smnNeed}`);

// ==UserScript==
// @name         PokeClicker SoftReset Buy Shop Pokemon
// @namespace    pcInfoStuff
// @version      0.4
// @description  Soft reset for buying shop pokemon
// @author       Takeces
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        Game.prototype.save = function() {};
        checkAndLoadSave();
    }

    function checkAndLoadSave() {
        let elems = document.querySelectorAll('.trainer-card');
        if(elems.length === 0) {
            setTimeout(checkAndLoadSave, 250);
            return;
        }
        elems[0].click();
        setTimeout(checkGameLoadedAndRunning, 250);
    }

    function checkGameLoadedAndRunning() {
        let elem = document.getElementById('battleContainer');
        if(elem === null) {
            setTimeout(checkGameLoadedAndRunning, 250);
            return;
        }
        if (!elem.checkVisibility()) {
            setTimeout(checkGameLoadedAndRunning, 250);
            return;
        }

        setTimeout(doSoftResetStuff, 250);
    }

    function doSoftResetStuff() {
        autoLoop();
    }

    function autoLoop() {
        if(doTheThing()) {
            // if 'true' was returned, a reload has been issued -> don't want to run the script yet again, or it might save
            return;
        }
        setTimeout(autoLoop, 25);
    }

    function doTheThing() {
        const shops = player.town.content.filter(c => c instanceof Shop);
        if (player.route || !shops.length) {
            return;
        }

        const items = shops.map(shop => shop.items.filter(i => i instanceof PokemonItem && !App.game.party.alreadyCaughtPokemonByName(i.name, true)));

        for(let indexShop = 0; indexShop < items.length; indexShop++) {
            if(items[indexShop].length === 0) { continue; }
            ShopHandler.showShop(shops[indexShop]);
            for(let indexItem = 0; indexItem < items[indexShop].length; indexItem++) {
                ShopHandler.setSelected(shops[indexShop].items.indexOf(items[indexShop][indexItem]));
                let amount = 1;
                // if the needed currency is pokedollars, buy 10 at once
                if(items[indexShop][indexItem].currency === GameConstants.Currency.money) {
                    amount = 10;
                }
                ShopHandler.increaseAmount(amount - 1);
                if (App.game.wallet.hasAmount(new Amount(items[indexShop][indexItem].totalPrice(ShopHandler.amount()), items[indexShop][indexItem].currency))) {
                    ShopHandler.buyItem();
                    if(App.game.party.alreadyCaughtPokemonByName(items[indexShop][indexItem].name, true)) {
                        saveGame();
                        return;
                    }

                    // not been shiny -> reload
                    doReload();
                    return true;
                }
            }
        }

        for(let i = 0; i < shops.length; i++) {
            if(!(shops[i] instanceof GenericTraderShop)) continue;
            let deals = GenericDeal.list[shops[i].name]();
            for(let j = 0; j < deals.length; j++) {
                let profits = deals[j].profits;
                for(let k = 0; k < profits.length; k++) {
                    if(profits[k].item instanceof PokemonItem && !App.game.party.alreadyCaughtPokemonByName(profits[k].item.name, true)) {
                        // buy item
                        GenericDeal.use(shops[i].name, j, 1);

                        if(App.game.party.alreadyCaughtPokemonByName(profits[k].item.name, true)) {
                            saveGame();
                            return;
                        }

                        // not been shiny -> reload
                        doReload();
                        return true;
                    }
                }
            }
        }

        for(let i = 0; i < shops.length; i++) {
            if(!(shops[i] instanceof BerryMasterShop)) continue;
            let deals = BerryDeal.list[GameConstants.BerryTraderLocations[shops[i].parent.name]]();
            for(let j = 0; j < deals.length; j++) {
                if(deals[j].item.itemType instanceof PokemonItem && !App.game.party.alreadyCaughtPokemonByName(deals[j].item.itemType.name, true)) {
                    // buy item
                    if(BerryDeal.canUse(GameConstants.BerryTraderLocations[shops[i].parent.name], j)) {
                       BerryDeal.use(GameConstants.BerryTraderLocations[shops[i].parent.name], j, 1);
                    } else {
                        return;
                    }

                    if(App.game.party.alreadyCaughtPokemonByName(deals[j].item.itemType.name, true)) {
                        saveGame();
                        return;
                    }

                    // not been shiny -> reload
                    doReload();
                    return true;
                }
            }
        }
    }

    function saveGame() {
        Save.store(player);
    }

    function loadSave() {
        document.querySelectorAll('.trainer-card')[0].click();
    }

    function doReload() {
        location.reload();
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

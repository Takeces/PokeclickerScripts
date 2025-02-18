// ==UserScript==
// @name         PokeClicker SoftReset Breeding Eggs
// @namespace    pcInfoStuff
// @version      0.3
// @description  Soft reset for breeding eggs
// @author       Takeces
// @match        https://www.pokeclicker.com/*
// @grant        window.close
// @grant        GM_openInTab
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
        autoMysteryEgg();
    }

    function autoMysteryEgg() {
        if(doMysteryEgg()) {
            // if 'true' was returned, a reload has been issued -> don't want to run the script yet again, or it might save
            return;
        }
        setTimeout(autoMysteryEgg, 25);
    }

    function doMysteryEgg() {
        if (ItemList.Mystery_egg.getCaughtStatus() == CaughtStatus.CaughtShiny) {
            return;
        }

        for(let i = 0; i < 4; i++) {
            // don't try to add more eggs to the hatchery then there are pokes left for it
            if(checkEggsRemaining().length < i + 1) { break; }
            if(App.game.breeding.eggList[i]().type < 0 && player.itemList.Mystery_egg() > 0) {
                ItemList.Mystery_egg.use();
                if (App.game.party.alreadyCaughtPokemonByName(App.game.breeding.eggList[i]().pokemon, true)) {
                    // already have this as shiny
                    doReload();
                    return true;
                }
                // check if the egg poke already is in the hatchery as egg
                for(let j = 0; j < i; j++) {
                    if(App.game.breeding.eggList[j]().pokemon === App.game.breeding.eggList[i]().pokemon) {
                        // already have this poke in the hatchery
                        doReload();
                        return true;
                    }
                }
                saveGame();
            }
        }

        return hatch();
    }

    // getting a list of remaining poke for the egg type
    function checkEggsRemaining(type = GameConstants.EggItemType.Mystery_egg) {
        let possiblePokes = [];
        if(type !== GameConstants.EggItemType.Mystery_egg) {
            possiblePokes = App.game.breeding.hatchList[type][player.region];
        } else {
            possiblePokes = App.game.breeding.hatchList[0][player.region].concat(
                App.game.breeding.hatchList[1][player.region],
                App.game.breeding.hatchList[2][player.region],
                App.game.breeding.hatchList[3][player.region],
                App.game.breeding.hatchList[4][player.region],
                App.game.breeding.hatchList[5][player.region],
                App.game.breeding.hatchList[7][player.region]
            );
        }
        let result = [];
        for(let i = 0; i < possiblePokes.length; i++) {
            if(!App.game.party.alreadyCaughtPokemonByName(possiblePokes[i], true)) {
                result.push(possiblePokes[i]);
            }
        }
        return result;
    }

    function hatch() {
        // hatch in reverse order since eggs move up on hatch
        for(let i = 3; i >= 0; i--) {
            const egg = App.game.breeding.eggList[i]();
            if(egg.type < 0) {
                continue;
            };

            if (egg.steps() < egg.stepsRequired) {
                saveGame();
                continue;
            }

            App.game.breeding.hatchPokemonEgg(i);
            if(checkHatched(egg.pokemon)) {
                return true;
            }
            return;
        }
    }

    function checkHatched(pokeName) {
        const shiny = App.game.party.alreadyCaughtPokemonByName(pokeName, true);
        if(shiny) {
            saveGame();
            return;
        }
        // hatched pokemon was not shiny -> reload
        doReload();
        return true;
    }

    function saveGame() {
        Save.store(player);
    }

    function loadSave() {
        document.querySelectorAll('.trainer-card')[0].click();
    }

    function doReload() {
/*         location.reload(); */
        GM_openInTab(window.location.href, {active: false, insert: true});
        window.setTimeout(window.close, 1);
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

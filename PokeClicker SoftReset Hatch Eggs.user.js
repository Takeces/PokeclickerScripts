// ==UserScript==
// @name         PokeClicker SoftReset Hatch Eggs
// @namespace    pcInfoStuff
// @version      0.1
// @description  Soft reset for hatching eggs
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
        autoHatchEgg();
    }

    function autoHatchEgg() {
        if(doHatchEgg()) {
            // if 'true' was returned, a reload has been issued -> don't want to run the script yet again, or it might save
            return;
        }
        setTimeout(autoHatchEgg, 25);
    }

    function doHatchEgg() {
        // hatch in reverse order since eggs move up on hatch
        for(let i = 3; i >= 0; i--) {
            const egg = App.game.breeding.eggList[i]();
            if(egg.type < 0) {
                continue;
            };

            if (egg.steps() < egg.totalSteps) {
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
        location.reload();
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

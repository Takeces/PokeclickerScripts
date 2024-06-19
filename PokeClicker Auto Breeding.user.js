// ==UserScript==
// @name         PokeClicker Auto Breeding
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto Breeding
// @author       Takeces
// @updateURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Auto%20Breeding.user.js
// @downloadURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Auto%20Breeding.user.js
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var timeout = 100;
    var interval = null;
    const BUTTON_ID = 'pcDoAutoBreeding';

    function init() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(PcAutomationHolder === undefined || PcAutomationHolder === null) {
            setTimeout(init, 50);
            return;
        }

        var btn = document.createElement('button');
        btn.setAttribute('id', BUTTON_ID);
        btn.innerHTML = 'Auto Breeding';
        btn.addEventListener('click', toggleAuto);

        PcAutomationHolder.addAutomationButton(btn);

        PcAutomationHolder.toggleAutoBreed = toggleAuto;
    }

    function doAuto() {
        hatchEggs();
        addEggs();
    }

    function hatchEggs() {
        for(let i = 3; i >= 0; i--) {
            const egg = App.game.breeding.eggList[i]();
            if(egg.type < 0) {
                continue;
            };
            if (egg.steps() < egg.totalSteps) {
                continue;
            }
            App.game.breeding.hatchPokemonEgg(i);
        }
    }

    function addEggs() {
        for(const pokemon of BreedingController.hatcherySortedFilteredList()) {
            if(!App.game.breeding.hasFreeEggSlot()) { break; }
            if(pokemon.level < 100) { continue; }
            if(pokemon.breeding) { continue; }
            App.game.breeding.addPokemonToHatchery(pokemon);
        }
    }

    function toggleAuto() {
        if(interval === null) {
            interval = setInterval(doAuto, timeout);
            document.getElementById(BUTTON_ID).style.backgroundColor = 'green';
            return;
        }
        disableAuto();
    }

    function disableAuto() {
        document.getElementById(BUTTON_ID).style.backgroundColor = '';
        clearInterval(interval);
        interval = null;
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

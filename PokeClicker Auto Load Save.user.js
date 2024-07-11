// ==UserScript==
// @name         PokeClicker Auto Load Save
// @namespace    pcInfoStuff
// @version      0.5
// @description  open more windows
// @author       Takeces
// @match        https://www.pokeclicker.com/*
// @updateURL	 https://raw.githubusercontent.com/Takeces/PokeclickerScripts/main/PokeClicker%20Auto%20Load%20Save.user.js
// @downloadURL	 https://raw.githubusercontent.com/Takeces/PokeclickerScripts/main/PokeClicker%20Auto%20Load%20Save.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        let elems = document.querySelectorAll('.trainer-card');
        if(elems.length === 0) {
            setTimeout(init, 250);
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

        setTimeout(doStuffAfterLoading, 250);
    }

    function doStuffAfterLoading() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(!PcAutomationHolder) {
            setTimeout(doStuffAfterLoading, 250);
            return;
        }

        if(!activateAutomation(PcAutomationHolder.dungeonRunner.toggleAutoStartDungeon)) { return; }
        if(!activateAutomation(PcAutomationHolder.dungeonRunner.toggleAutoDungeon)) { return; }
/*         if(!activateAutomation(PcAutomationHolder.dungeonRunner.toggleAllTiles)) { return; } */
/*         if(!activateAutomation(PcAutomationHolder.dungeonRunner.toggleBossRush)) { return; } */
        if(!activateAutomation(PcAutomationHolder.dungeonRunner.toggleAutoStartDungeonToggleShiny)) { return; }

        if(!activateAutomation(PcAutomationHolder.toggleAutoUnderground)) { return; }
        if(!activateAutomation(PcAutomationHolder.toggleAutoBreed)) { return; }
        if(!activateAutomation(PcAutomationHolder.toggleAutoFarm)) { return; }
    }

    function activateAutomation(fnAutomation) {
        if(!fnAutomation) {
            setTimeout(doStuffAfterLoading, 250);
            return false;
        }
        fnAutomation();
        return true;
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

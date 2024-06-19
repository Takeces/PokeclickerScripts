// ==UserScript==
// @name         PokeClicker Auto Load Save
// @namespace    pcInfoStuff
// @version      0.3
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

/*         if(!PcAutomationHolder.dungeonRunner.toggleAutoStartDungeon) {
            setTimeout(doStuffAfterLoading, 250);
            return;
        }
        PcAutomationHolder.dungeonRunner.toggleAutoStartDungeon(); */

/*         if(!PcAutomationHolder.dungeonRunner.toggleAutoDungeon) {
            setTimeout(doStuffAfterLoading, 250);
            return;
        }
        PcAutomationHolder.dungeonRunner.toggleAutoDungeon();
        PcAutomationHolder.dungeonRunner.toggleAllTiles();
        //PcAutomationHolder.dungeonRunner.toggleBossRush(); */

        if(!PcAutomationHolder.toggleAutoUnderground) {
            setTimeout(doStuffAfterLoading, 250);
            return;
        }
        PcAutomationHolder.toggleAutoUnderground();

        if(!PcAutomationHolder.toggleAutoBreed) {
            setTimeout(doStuffAfterLoading, 250);
            return;
        }
        PcAutomationHolder.toggleAutoBreed();

        if(!PcAutomationHolder.toggleAutoFarm) {
            setTimeout(doStuffAfterLoading, 250);
            return;
        }
        PcAutomationHolder.toggleAutoFarm();
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

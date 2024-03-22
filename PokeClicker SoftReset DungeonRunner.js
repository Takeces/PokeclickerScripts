// ==UserScript==
// @name         PokeClicker SoftReset DungeonRunner
// @namespace    pcInfoStuff
// @version      0.1
// @description  Soft reset for running dungeons
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

    var caughtPokemon = false;
    function doSoftResetStuff() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(!PcAutomationHolder) {
            console.log('AutomationParent has to be active!');
            return;
        }
        if(!PcAutomationHolder.dungeonRunner || !PcAutomationHolder.dungeonRunner.toggleAutoStartDungeon || !PcAutomationHolder.dungeonRunner.toggleAutoDungeon) {
            console.log('DungeonRunner and AutoStartDungeon have to be active!');
            return;
        }
        if(DungeonRunner.dungeonCompleted(player.town().dungeon, true)) {
            return;
        }
        PcAutomationHolder.dungeonRunner.toggleAutoStartDungeon();
        PcAutomationHolder.dungeonRunner.toggleAutoDungeon();

        var ogFuncs = {};
        (function() {
            ogFuncs.catchPokemon = DungeonBattle.catchPokemon;
            DungeonBattle.catchPokemon = function(enemyPokemon, route, region) {
                ogFuncs.catchPokemon.apply(this, [enemyPokemon, route, region]);
                saveGame();
                caughtPokemon = true;
            };
        })();

        (function() {
            ogFuncs.dungeonLost = DungeonRunner.dungeonLost; // <-- Reference
            DungeonRunner.dungeonLost = function() {
                ogFuncs.dungeonLost.apply(this);
                setTimeout(checkCaught, 2000);
            };
        })();

        (function() {
            ogFuncs.dungeonWon = DungeonRunner.dungeonWon; // <-- Reference
            DungeonRunner.dungeonWon = function() {
                ogFuncs.dungeonWon.apply(this);
                setTimeout(checkCaught, 2000);
            };
        })();
    }

    function checkCaught() {
        if(!caughtPokemon) {
            doReload();
        }
        caughtPokemon = false;
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
// ==UserScript==
// @name         PokeClicker SoftReset DungeonRunner
// @namespace    pcInfoStuff
// @version      0.5
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
            setTimeout(doSoftResetStuff, 250);
            return;
        }
        if(!PcAutomationHolder.dungeonRunner || !PcAutomationHolder.dungeonRunner.toggleAutoStartDungeon || !PcAutomationHolder.dungeonRunner.toggleAutoDungeon) {
            console.log('DungeonRunner and AutoStartDungeon have to be active!');
            setTimeout(doSoftResetStuff, 250);
            return;
        }
        if(DungeonRunner.dungeonCompleted(player.town.dungeon, true)) {
            console.log('Dungeon is complete!');
            return;
        }
        PcAutomationHolder.dungeonRunner.toggleAutoStartDungeon();
        PcAutomationHolder.dungeonRunner.toggleAutoDungeon();
        PcAutomationHolder.dungeonRunner.toggleBossRush();

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

        (function() {
            ogFuncs.startBossFight = DungeonRunner.startBossFight; // <-- Reference
            DungeonRunner.startBossFight = function() {
                ogFuncs.startBossFight.apply(this);
                setTimeout(checkShinyBoss, 2000);
            };
        })();
    }

    function checkCaught() {
        if(!caughtPokemon) {
            doReload();
        }
        caughtPokemon = false;
    }

    function checkShinyBoss() {
        if(!DungeonBattle.enemyPokemon().shiny && !caughtPokemon) {
            doReload();
        }
    }

    function saveGame() {
        Save.store(player);
    }

    function loadSave() {
        document.querySelectorAll('.trainer-card')[0].click();
    }

    function doReload() {
/*         window.addEventListener('unload', function () {
            document.documentElement.innerHTML = '';
        }); */
        location.reload();
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

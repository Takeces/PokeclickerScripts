// ==UserScript==
// @name         PokeClicker Auto Start Dungeon
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Auto start dungeons
// @author       Takeces
// @updateURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Auto%20Start%20Dungeon.user.js
// @downloadURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Auto%20Start%20Dungeon.user.js
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var autoStartDungeonTimeout = 50;
    const BUTTON_ID = 'pcDoAutoStartDungeon';
    const BUTTON_CAUGHT_ID = 'pcDoAutoStartDungeonCaught';
    const BUTTON_SHINY_ID = 'pcDoAutoStartDungeonShiny';
    const BUTTON_ACHIEVEMENT_ID = 'pcDoAutoStartDungeonAchievement';

    function init() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(PcAutomationHolder === undefined || PcAutomationHolder === null) {
            setTimeout(init, 50);
            return;
        }

        var btn = document.createElement('button');
        btn.setAttribute('id', BUTTON_ID);
        btn.innerHTML = 'DStart';
        btn.addEventListener('click', toggleAutoStartDungeon);

        var btnCaught = document.createElement('button');
        btnCaught.setAttribute('id', BUTTON_CAUGHT_ID);
        btnCaught.innerHTML = 'DC';
        btnCaught.addEventListener('click', toggleCaught);

        var btnCaughtShiny = document.createElement('button');
        btnCaughtShiny.setAttribute('id', BUTTON_SHINY_ID);
        btnCaughtShiny.innerHTML = 'DS';
        btnCaughtShiny.addEventListener('click', toggleShiny);

        var btnAchievement = document.createElement('button');
        btnAchievement.setAttribute('id', BUTTON_ACHIEVEMENT_ID);
        btnAchievement.innerHTML = 'DA';
        btnAchievement.addEventListener('click', toggleAchievement);

        PcAutomationHolder.addAutomationButton(btn, true);
        PcAutomationHolder.addAutomationButton(btnCaught, true);
        PcAutomationHolder.addAutomationButton(btnCaughtShiny, true);
        PcAutomationHolder.addAutomationButton(btnAchievement, true);

        if(!PcAutomationHolder.dungeonRunner) {
            PcAutomationHolder.dungeonRunner = {};
        }
        PcAutomationHolder.dungeonRunner.toggleAutoStartDungeon = toggleAutoStartDungeon;
    }

    var autoStartDungeonEnabled = false;
	var autoStartUntilAllCaught = false;
	var autoStartUntilAllCaughtShiny = false;
	var autoStartUntilAchievementFull = false;

	function startDungeon() {
		// not in a "town"
		if(App.game.gameState !== GameConstants.GameState.town) { return; }

		// town doesn't have dungeon
		if(player.town().dungeon === undefined) { return; }

        if(!App.game.wallet.hasAmount(new Amount(player.town().dungeon.tokenCost, GameConstants.Currency.dungeonToken))){
            return;
        }

		if(autoStartUntilAllCaught && DungeonRunner.dungeonCompleted(player.town().dungeon, false)) {
			return;
		}
		if(autoStartUntilAllCaughtShiny && DungeonRunner.dungeonCompleted(player.town().dungeon, true)) {
			return;
		}
		if(autoStartUntilAchievementFull && DungeonRunner.isAchievementsComplete(player.town().dungeon)) {
			return;
		}

		DungeonRunner.initializeDungeon(player.town().dungeon);
	}

	function autoStartDungeon() {
		if(!autoStartDungeonEnabled) { return; }

		startDungeon();

		setTimeout(autoStartDungeon, autoStartDungeonTimeout);
	}

	function toggleAutoStartDungeon() {
		if(autoStartDungeonEnabled) {
			autoStartDungeonEnabled = false;
            document.getElementById(BUTTON_ID).style.backgroundColor = '';
			return;
		}
		autoStartDungeonEnabled = true;
        document.getElementById(BUTTON_ID).style.backgroundColor = 'green';
		autoStartDungeon();
	}

	function toggleCaught() {
		if(autoStartUntilAllCaught) {
			autoStartUntilAllCaught = false;
            document.getElementById(BUTTON_CAUGHT_ID).style.backgroundColor = '';
			return;
		}
		autoStartUntilAllCaught = true;
        document.getElementById(BUTTON_CAUGHT_ID).style.backgroundColor = 'green';
	}

	function toggleShiny() {
		if(autoStartUntilAllCaughtShiny) {
			autoStartUntilAllCaughtShiny = false;
            document.getElementById(BUTTON_SHINY_ID).style.backgroundColor = '';
			return;
		}
		autoStartUntilAllCaughtShiny = true;
        document.getElementById(BUTTON_SHINY_ID).style.backgroundColor = 'green';
	}

	function toggleAchievement() {
		if(autoStartUntilAchievementFull) {
			autoStartUntilAchievementFull = false;
            document.getElementById(BUTTON_ACHIEVEMENT_ID).style.backgroundColor = '';
			return;
		}
		autoStartUntilAchievementFull = true;
        document.getElementById(BUTTON_ACHIEVEMENT_ID).style.backgroundColor = 'green';
	}

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

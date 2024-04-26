// ==UserScript==
// @name         PokeClicker Auto Route Switch (Specific)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto route switch to get a specific pokemon faster
// @author       Takeces
// @updateURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Auto%20Route%20Switch%20(Specific).user.js
// @downloadURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Auto%20Route%20Switch%20(Specific).user.js
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	var targetRoute = null;
	var autoRouteSwitchTimeout = 25;
    var specificPokemon = 'Mew';
    var shiny = false;
    const BUTTON_ID = 'pcDoAutoRouteSwitchSpecific';

    function init() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(PcAutomationHolder === undefined || PcAutomationHolder === null) {
            setTimeout(init, 50);
            return;
        }

        var btn = document.createElement('button');
        btn.setAttribute('id', BUTTON_ID);
        btn.innerHTML = 'Auto Route Switch (P)';
        btn.addEventListener('click', toggleAutoRouteSwitch);

        PcAutomationHolder.addAutomationButton(btn);
    }

	function toggleAutoRouteSwitch() {
		if(targetRoute === null) {
			if(App.game.gameState !== GameConstants.GameState.fighting) { return; }
			targetRoute = player.route();
            document.getElementById(BUTTON_ID).style.backgroundColor = 'green';
			doRouteSwitch();
			return;
		}

        disableAutoRouteSwitch();
	}

    function disableAutoRouteSwitch() {
        document.getElementById(BUTTON_ID).style.backgroundColor = '';
        if(targetRoute !== null) {
            MapHelper.moveToRoute(targetRoute, player.region);
        }
		targetRoute = null;
    }

	function doRouteSwitch() {
        if(targetRoute === null) {
            disableAutoRouteSwitch();
            return;
        }

        // if desired pokemon is catched, check only every second if there's a change (level ups)
        if(App.game.party.alreadyCaughtPokemonByName(specificPokemon, shiny)) {
            setTimeout(doRouteSwitch, 1000);
            return;
        }

		if(App.game.gameState === GameConstants.GameState.fighting) {
            // if not specific pokemon -> switch to town
			if(Battle.enemyPokemon().name !== specificPokemon) {
				MapHelper.moveToTown(GameConstants.StartingTowns[player.region]);
                setTimeout(doRouteSwitch, autoRouteSwitchTimeout);
				return;
			}
            // if looking only for shiny and poke isn't -> switch to town
            if(shiny && !Battle.enemyPokemon().shiny) {
				MapHelper.moveToTown(GameConstants.StartingTowns[player.region]);
                setTimeout(doRouteSwitch, autoRouteSwitchTimeout);
				return;
            }
			//battling happens here, wait 10s so that catching is ok
            setTimeout(doRouteSwitch, autoRouteSwitchTimeout);
			return;
		}

		if(App.game.gameState === GameConstants.GameState.town) {
			MapHelper.moveToRoute(targetRoute, player.region);
            setTimeout(doRouteSwitch, autoRouteSwitchTimeout);
			return;
		}
        setTimeout(doRouteSwitch, autoRouteSwitchTimeout);
	}

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

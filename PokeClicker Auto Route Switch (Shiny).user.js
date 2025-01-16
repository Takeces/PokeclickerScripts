// ==UserScript==
// @name         PokeClicker Auto Route Switch (Shiny)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Auto route switch to get shinies faster
// @author       Takeces
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	var targetRoute = null;
	var autoRouteSwitchTimeout = 25;
    const BUTTON_ID = 'pcDoAutoRouteSwitch';

    function init() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(PcAutomationHolder === undefined || PcAutomationHolder === null) {
            setTimeout(init, 50);
            return;
        }

        var btn = document.createElement('button');
        btn.setAttribute('id', BUTTON_ID);
        btn.innerHTML = 'Auto Route Switch';
        btn.addEventListener('click', toggleAutoRouteSwitch);

        PcAutomationHolder.addAutomationButton(btn);
    }

	function toggleAutoRouteSwitch() {
		if(targetRoute === null) {
			if(App.game.gameState !== GameConstants.GameState.fighting) { return; }
			targetRoute = player.route;
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

        // if route is completed, check only every second if there's a change (level ups)
        if(RouteHelper.routeCompleted(targetRoute, player.region, true)) {
            setTimeout(doRouteSwitch, 1000);
            return;
        }

        if(RouteHelper.routeCompleted(targetRoute, player.region, true)) {
            if(App.game.gameState === GameConstants.GameState.town) {
                MapHelper.moveToRoute(targetRoute, player.region);
            }
            setTimeout(doRouteSwitch, autoRouteSwitchTimeout);
            return;
        }

		if(App.game.gameState === GameConstants.GameState.fighting) {
			if(!Battle.enemyPokemon().shiny) {
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

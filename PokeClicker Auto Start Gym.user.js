// ==UserScript==
// @name         PokeClicker Auto Start Gym
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto start gyms
// @author       Takeces

// @updateURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Auto%20Start%20Gym.user.js
// @downloadURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Auto%20Start%20Gym.user.js
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var autoStartEnabled = false;
    var autoTimeout = 50;
    const BUTTON_ID = 'pcDoAutoStartGym';

    function init() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(PcAutomationHolder === undefined || PcAutomationHolder === null) {
            setTimeout(init, 50);
            return;
        }

        var btn = document.createElement('button');
        btn.setAttribute('id', BUTTON_ID);
        btn.innerHTML = 'Auto Gym';
        btn.addEventListener('click', toggleAuto);

        PcAutomationHolder.addAutomationButton(btn, true);
    }

	function startGym() {
		if(GymBattle.gym !== undefined && GymBattle.index() < GymBattle.gym.getPokemonList().length) {
            return;
        }

        // player is on route and not in town
        if(player.route() > 0) {
            return;
        }

        let gyms = GameConstants.RegionGyms[player.region];
        let townName = player.town().name;

        // town doesn't have a gym
        if(!gyms.includes(townName)) {
            return;
        }

        // look through town content and start gym run
        player.town().content.forEach(function(pcTownContent) {
            if(pcTownContent instanceof Gym) {
                GymRunner.startGym(pcTownContent);
            }
        });
	}

	function autoStart() {
		if(!autoStartEnabled) { return; }

		startGym();

		setTimeout(autoStart, autoTimeout);
	}

	function toggleAuto() {
		if(autoStartEnabled) {
			autoStartEnabled = false;
            document.getElementById(BUTTON_ID).style.backgroundColor = '';
			return;
		}
		autoStartEnabled = true;
        document.getElementById(BUTTON_ID).style.backgroundColor = 'green';
		autoStart();
	}

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

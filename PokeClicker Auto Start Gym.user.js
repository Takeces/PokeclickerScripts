// ==UserScript==
// @name         PokeClicker Auto Start Gym
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Auto start gyms
// @author       Takeces
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

        PcAutomationHolder.addAutomationButton(btn);
    }

	function startGym() {
		if(GymBattle.gym !== undefined && GymBattle.index() < GymBattle.gym.getPokemonList().length) {
            return;
        }

        // player is on route and not in town
        if(player.route > 0) {
            return;
        }

        var gyms = [];
		for(let content of player.town.content) {
			if(!(content instanceof Gym)) { continue; }
			gyms.push(content);
		}
		for(const gym of gyms) {
			if(App.game.statistics.gymsDefeated[GameConstants.getGymIndex(gym.town)]() >= 1000) { continue; }
			gym.protectedOnclick();
			return;
		}
		gyms[gyms.length - 1].protectedOnclick();
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

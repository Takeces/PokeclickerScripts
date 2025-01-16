// ==UserScript==
// @name         PokeClicker Auto Safari Shiny
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto Safari shiny catching
// @author       Takeces
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	var autoEnabled = false;
	var autoTimeout = 250;
    const BUTTON_ID = 'pcDoAutoSafariShiny';

    function init() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(PcAutomationHolder === undefined || PcAutomationHolder === null) {
            setTimeout(init, 50);
            return;
        }

        var btn = document.createElement('button');
        btn.setAttribute('id', BUTTON_ID);
        btn.innerHTML = 'Auto Safari';
        btn.addEventListener('click', toggleAuto);

        PcAutomationHolder.addAutomationButton(btn);
    }

	function toggleAuto() {
		if(autoEnabled) {
			disableAuto();
			return;
		}
		autoEnabled = true;
		document.getElementById(BUTTON_ID).style.backgroundColor = 'green';
		doAuto();
	}

    function disableAuto() {
        document.getElementById(BUTTON_ID).style.backgroundColor = '';
		autoEnabled = false;
    }

	function doAuto() {
		if(!autoEnabled) { return; }

		doSafari();

        setTimeout(doAuto, autoTimeout);
	}

    var lastDir = 'right';
	var fleeTries = 0;
	function doSafari() {
        if(!Safari.inProgress()) {
            return;
        }

        if(Safari.balls() <= 1) {
            disableAuto();
            return;
        }

        if(SafariBattle.busy()) {
            if(fleeTries > 80) {
				SafariBattle.endBattle();
			}
            return;
        }

        if(!Safari.inBattle()) {
			fleeTries = 0;
            if(!lastDir || lastDir == 'left') {
                lastDir = 'right';
            } else {
                lastDir = 'left';
            }
            Safari.step(lastDir);
            return;
        }

        // if enemy is shiny and i don't have it shiny -> catch it!
        if(SafariBattle.enemy.shiny && (PartyController.getCaughtStatus(SafariBattle.enemy.id) == CaughtStatus.NotCaught || PartyController.getCaughtStatus(SafariBattle.enemy.id) == CaughtStatus.Caught)) {
            SafariBattle.throwBall();
            return;
        }

        SafariBattle.run();
		fleeTries++;
	}

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

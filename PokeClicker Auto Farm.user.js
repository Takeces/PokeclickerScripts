// ==UserScript==
// @name         PokeClicker Auto Farm
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Auto farming
// @author       Takeces
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	var autoEnabled = false;
	var autoTimeout = 500;
    const BUTTON_ID = 'pcDoAutoFarm';

    function init() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(PcAutomationHolder === undefined || PcAutomationHolder === null) {
            setTimeout(init, 50);
            return;
        }

        var btn = document.createElement('button');
        btn.setAttribute('id', BUTTON_ID);
        btn.innerHTML = 'Auto Farm';
        btn.addEventListener('click', toggleAuto);

        PcAutomationHolder.addAutomationButton(btn);

        PcAutomationHolder.toggleAutoFarm = toggleAuto;
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
		doFarming();
        setTimeout(doAuto, autoTimeout);
	}

	function doFarming() {
		let selectedBerry = FarmController.selectedBerry();
        for(const plot of App.game.farming.plotList) {
            if(!plot.isUnlocked) { continue; }
            if(plot.isEmpty()) {
                App.game.farming.plant(plot.index, selectedBerry);
                continue;
            }
            if(plot.age > plot.berryData.growthTime[3]) {
                App.game.farming.harvest(plot.index);
            }
        }
	}

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

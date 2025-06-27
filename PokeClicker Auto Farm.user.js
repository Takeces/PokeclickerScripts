// ==UserScript==
// @name         PokeClicker Auto Farm
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Auto farming
// @author       Takeces
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	var autoEnabled = false;
	var autoTimeout = 50;
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

        let ripeBtn = document.createElement('button');
        ripeBtn.innerHTML = 'Ripe';
        ripeBtn.classList.add('btn');
        ripeBtn.classList.add('btn-success');
        ripeBtn.addEventListener('click', ripeField);

        let footer = document.getElementById('farmModal').querySelector('.modal-footer');
        footer.insertBefore(ripeBtn, footer.firstChild);

        PcAutomationHolder.addAutomationButton(btn);

        PcAutomationHolder.toggleAutoFarm = toggleAuto;
    }

    function ripeField() {
        for(const plot of App.game.farming.plotList) {
            if(plot.isEmpty()) continue;
            plot.age = plot.berryData.growthTime[3] + 1;
        }
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

    const BERRIES = [
        {berry: BerryType.Cheri, amount: 25},
        {berry: BerryType.Iapapa, amount: 12},
        {berry: BerryType.Cornn, amount: 6}
    ];
    const BOOST_BERRY = BerryType.Passho;

    function getNextNeededBerry() {
        let result = BERRIES[0].berry;
        let smallest = Number.MAX_VALUE;
        for(const data of BERRIES) {
            const relative = App.game.farming.berryList[data.berry]() / data.amount;
            if(relative < smallest) {
                smallest = relative;
                result = data.berry;
            }
        }
        return result;
    }

    function normalFarming() {
		let selectedBerry = FarmController.selectedBerry();
        for(const plot of App.game.farming.plotList) {
            if(!plot.isUnlocked) { continue; }
            if(plot.isEmpty()) {
                App.game.farming.plant(plot.index, selectedBerry);
                continue;
            }
/*             if(plot.age > plot.berryData.growthTime[3]) {
                App.game.farming.harvest(plot.index);
            } */
        }
        ripeField();
    }

    function farmNeeded() {
        const neededBerry = getNextNeededBerry();
        ripeField();
        for(let i = 0; i < App.game.farming.plotList.length; i++) {
            const plot = App.game.farming.plotList[i];
            if(i < 5 || (i >= 10 && i < 15) || i >= 20) {
                if(plot.isEmpty()) {
                    App.game.farming.plant(plot.index, BOOST_BERRY);
                }
                continue;
            }
            if(plot.isEmpty()) {
                App.game.farming.plant(plot.index, neededBerry);
                continue;
            }
            if(plot.age > plot.berryData.growthTime[3]) {
                App.game.farming.harvest(plot.index);
            }
            if(plot.mulch == -1) {
                App.game.farming.addMulch(plot.index, MulchType.Rich_Mulch, 1);
            }
        }
    }

    function farmShinies() {
        ripeField();
        for(let i = 0; i < App.game.farming.plotList.length; i++) {
            const plot = App.game.farming.plotList[i];
            if(i == 6 || i == 8 || i == 16 || i == 18) {
                if(plot.isEmpty()) {
                    App.game.farming.plant(plot.index, BerryType.Lum);
                }
                continue;
            }
            if(plot.isEmpty()) {
                App.game.farming.plant(plot.index, BerryType.Starf);
                continue;
            }
        }
    }

	function doFarming() {
        for(const plot of App.game.farming.plotList) {
            if(!plot.isUnlocked) { continue; }
            if(plot.wanderer) {
                App.game.farming.handleWanderer(plot);
            }
        }
/* 		normalFarming(); */
        farmNeeded();
/*         farmShinies(); */
	}

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

// ==UserScript==
// @name         PokeClicker Auto Farm Unlocks
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto unlock berries in farm
// @author       Takeces
// @updateURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Auto%20Farm%20Unlocks.user.js
// @downloadURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Auto%20Farm%20Unlocks.user.js
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	var autoEnabled = false;
	var autoTimeout = 250;
    const BUTTON_ID = 'pcDoAutoFarmUnlocks';

    function init() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(PcAutomationHolder === undefined || PcAutomationHolder === null) {
            setTimeout(init, 50);
            return;
        }

        var btn = document.createElement('button');
        btn.setAttribute('id', BUTTON_ID);
        btn.innerHTML = 'Auto Farm Unlocks';
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

		let nextBerry = getNextLockedBerry();
        if(nextBerry === null) { disableAuto(); return; }

        if(!checkPlotsAvailable(nextBerry)) { disableAuto(); return; }

        doPlanting(nextBerry);

        setTimeout(doAuto, autoTimeout);
	}

    function checkPlotsAvailable(targetBerryIndex) {
        let layout = unlockLayouts[BerryType[targetBerryIndex]];
        for(const berryName in layout) {
            for(const plot of layout[berryName]) {
                if(!App.game.farming.plotList[plot].isUnlocked) { return false; }
            }
        }
        return true;
    }

    function checkPlotsEmpty(plots) {
        for(const plot of plots) {
            if(!App.game.farming.plotList[plot].isEmpty()) { return false; }
        }
        return true;
    }

    function getNextLockedBerry() {
        for(let i = 0; i < App.game.farming.unlockedBerries.length; i++) {
            if(!App.game.farming.unlockedBerries[i]()) {
                return i;
            }
        }
        return null;
    }

	function doPlanting(targetBerryIndex) {
        let layout = unlockLayouts[BerryType[targetBerryIndex]];

        let berriesForUnlock = [];
        for(const berryName in layout) {
            berriesForUnlock.push(BerryType[berryName]);
        }
        // sort berries from longest grow time to shortest grow time
        berriesForUnlock.sort(function(a,b) { return App.game.farming.berryData[b].growthTime[3] - App.game.farming.berryData[a].growthTime[3]; });

        let longestRipeTimes = getSortedLongestRipeTime(layout);

        let lastBerry = null;
        for(const berryIndex of berriesForUnlock) {
            // if targeted plots for a berry are NOT empty try to harvest if old enough
            if(!checkPlotsEmpty(layout[BerryType[berryIndex]])) {
                for(const plot of layout[BerryType[berryIndex]]) {
                    if(App.game.farming.plotList[plot].age >= App.game.farming.plotList[plot].berryData.growthTime[4] - 2) {
                        App.game.farming.harvest(plot);
                    }
                }
            }

            // try to plant
            if(
                lastBerry === null
                || (
                    // at least ripe at the same time
                    (App.game.farming.berryData[berryIndex].growthTime[3] >= (App.game.farming.berryData[lastBerry].growthTime[3] - App.game.farming.plotList[layout[BerryType[lastBerry]][0]].age))
                    // AND last remaining ripe time larger then current growth time
                    && ((App.game.farming.berryData[longestRipeTimes[0]].growthTime[4] - App.game.farming.plotList[layout[BerryType[longestRipeTimes[0]]][0]].age) > App.game.farming.berryData[berryIndex].growthTime[3])
                )
            ) {
                let planted = false;
                for(const plotIndex of layout[BerryType[berryIndex]]) {
                    if(App.game.farming.plotList[plotIndex].isEmpty()) {
                        App.game.farming.plant(plotIndex, berryIndex);
                        planted = true;
                    }
                }
                if(planted) { return; }
            }
            lastBerry = berryIndex;
        }
	}

    function getSortedLongestRipeTime(layout) {
        let berries = [];
        for(const berryName in layout) {
            berries.push(BerryType[berryName]);
        }
        // sort berries from longest ripe time to shortest ripe time
        berries.sort(function(a,b) {
            let ripeA = App.game.farming.berryData[a].growthTime[4] - App.game.farming.berryData[a].growthTime[3];
            let ripeB = App.game.farming.berryData[b].growthTime[4] - App.game.farming.berryData[b].growthTime[3];
            return ripeB - ripeA;
        });
        return berries;
    }

    const unlockLayouts = {
		'Persim': {
			'Oran': [7, 17],
			'Pecha': [11, 13]
		},
		'Razz': {
			'Cheri': [12],
			'Leppa': [2, 17]
		},
		'Bluk': {
			'Chesto': [12],
			'Leppa': [2, 17]
		},
		'Nanab': {
			'Pecha': [12],
			'Aspear': [2, 17]
		},
		'Wepear': {
			'Rawst': [12],
			'Oran': [2, 10, 14, 22]
		},
		'Pinap': {
			'Aspear': [12],
			'Sitrus': [2, 10, 14, 22]
		},
		'Figy': {
			'Cheri': [2, 3, 6, 10, 14, 16, 18, 19, 22]
		},
		'Wiki': {
			'Chesto': [2, 3, 6, 10, 12, 14, 19, 21, 22]
        },
		'Mago': {
			'Pecha': [2, 3, 5, 10, 12, 14, 19, 21, 22]
		},
		'Aguav': {
			'Rawst': [2, 3, 5, 10, 12, 14, 19, 21, 22]
		},
		'Iapapa': {
			'Aspear': [2, 3, 5, 10, 12, 14, 19, 21, 22]
		},
		'Lum': {
			'Cheri': [12],
			'Leppa': [2, 22],
			'Oran': [1, 21],
			'Aspear': [3, 23],
			'Sitrus': [6, 16],
			'Rawst': [8, 18],
			'Pecha': [11],
			'Chesto': [13]
		},
		'Pomeg': {
			'Iapapa': [5, 8, 16, 19],
			'Mago': [6, 9, 22]
		},
		'Kelpsy': {
			'Chesto': [7, 10, 14, 22],
			'Persim': [6, 8, 21, 23]
		},
		'Qualot': {
			'Pinap': [0, 8, 15, 18],
			'Mago': [6, 9, 19, 21]
		},
		'Hondew': {
			'Figy': [1, 8, 15, 23],
			'Wiki': [3, 5, 17, 19],
			'Aguav': [6, 9, 22]
		},
		'Grepa': {
			'Figy': [6, 9, 21, 24],
			'Aguav': [0, 3, 15, 18]
		}
	};

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

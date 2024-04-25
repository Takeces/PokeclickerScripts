// ==UserScript==
// @name         PokeClicker Underground Auto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto Underground
// @author       Takeces
// @updateURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Underground%20Auto.user.js
// @downloadURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Underground%20Auto.user.js
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var timeout = 100;
    var interval = null;
    const BUTTON_ID = 'pcDoAutoUnderground';

    function init() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(PcAutomationHolder === undefined || PcAutomationHolder === null) {
            setTimeout(init, 50);
            return;
        }

        var btn = document.createElement('button');
        btn.setAttribute('id', BUTTON_ID);
        btn.innerHTML = 'Auto Underground';
        btn.addEventListener('click', toggle);

        PcAutomationHolder.addAutomationButton(btn);
    }

    function doUnderground() {
        if(App.game.underground.energy < 1) return;
        for(let i = 0; i < Mine.rewardGrid.length; i++) {
            if(Mine.rewardGrid[i] === 0) continue;
            for(let j = 0; j < Mine.rewardGrid[i].length; j++) {
                if(Mine.rewardGrid[i][j] === 0) continue;
                if(Mine.grid[i][j]() === 0) continue;
                Mine.click(i, j);
                return;
            }
        }
    }

    function toggle() {
        if(interval === null) {
            interval = setInterval(doUnderground, timeout);
            document.getElementById(BUTTON_ID).style.backgroundColor = 'green';
            return;
        }
        disable();
    }

    function disable() {
        document.getElementById(BUTTON_ID).style.backgroundColor = '';
        clearInterval(interval);
        interval = null;
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

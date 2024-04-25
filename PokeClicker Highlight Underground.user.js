// ==UserScript==
// @name         PokeClicker Highlight Underground
// @namespace    pcInfoStuff
// @version      0.1
// @description  Highlight Underground Items
// @author       Takeces
// @updateURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Highlight%20Underground.user.js
// @downloadURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Highlight%20Underground.user.js
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        setInterval(highlighting, 2000);
    }

    function highlighting() {
        const mineBody = document.getElementById('mineBody');
        if(!mineBody) return;
        if(!mineBody.checkVisibility()) return;
        for(const mineSquare of document.querySelectorAll('.mineSquare')) {
            if(Mine.rewardGrid[mineSquare.dataset.i][mineSquare.dataset.j] === 0) {
                mineSquare.style = "border: solid 1px black;";
                continue;
            }
            mineSquare.style = "border: solid 1px red;";
        }
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

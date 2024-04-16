// ==UserScript==
// @name         PokeClicker Auto Load Save
// @namespace    pcInfoStuff
// @version      0.2
// @description  open more windows
// @author       Takeces
// @match        https://www.pokeclicker.com/*
// @updateURL	 https://raw.githubusercontent.com/Takeces/PokeclickerScripts/main/PokeClicker%20Auto%20Load%20Save.user.js
// @downloadURL	 https://raw.githubusercontent.com/Takeces/PokeclickerScripts/main/PokeClicker%20Auto%20Load%20Save.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        let elems = document.querySelectorAll('.trainer-card');
        if(elems.length === 0) {
            setTimeout(init, 250);
            return;
        }
        elems[0].click();
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

// ==UserScript==
// @name         PokeClicker Auto Parent
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Parent with Container for all the auto stuff
// @author       Takeces
// @updateURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Auto%20Parent.user.js
// @downloadURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Auto%20Parent.user.js
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const PARENT_CONTAINER_ID = 'pcAutomationContainer';
    const PARENT_CONTAINER_BODY_ID = 'pcAutomationBody';
    function init() {
        let container = document.createElement('div');
        container.setAttribute('id', PARENT_CONTAINER_ID);
        container.setAttribute('style', 'position: fixed; top: 3em; right: 0.5em;');
        container.setAttribute('class', 'card border-secondary');

        let header = document.createElement('div');
        header.setAttribute('class', 'card-header p-0');
        header.setAttribute('data-toggle', 'collapse');
        header.setAttribute('href', '#' + PARENT_CONTAINER_BODY_ID);
        header.setAttribute('style', 'padding-left: 0.5em !important; padding-right: 0.5em !important;');
        header.setAttribute('aria-expanded', 'true');
        header.innerHTML = '<span>Automations</span>';
        container.appendChild(header);

        let body = document.createElement('div');
        body.setAttribute('id', PARENT_CONTAINER_BODY_ID);
        body.setAttribute('class', 'card-body p-1 show');
        body.setAttribute('style', 'height: 30em; overflow: auto; font-size: 0.8em');
        container.appendChild(body);

        document.getElementsByTagName('body')[0].appendChild(container);
    }

    var PcAutomationHolder = window.PcAutomationHolder = {};
    PcAutomationHolder.addAutomationButton = function(btnElem, subbutton = false) {
        let container = document.getElementById(PARENT_CONTAINER_BODY_ID);
        let btnContainer = document.createElement('div');
        let style = 'margin-bottom: 0.5em;';
        if(subbutton) {
            style +=' text-align: right;';
        }
        btnContainer.setAttribute('style', style);
        btnContainer.appendChild(btnElem);
        container.appendChild(btnContainer);
    };

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

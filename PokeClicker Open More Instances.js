// ==UserScript==
// @name         PokeClicker Open More Instances
// @namespace    pcInfoStuff
// @version      0.1
// @description  open more windows
// @author       Takeces
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_ID = 'pcOpenWindows';
    function init() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(PcAutomationHolder === undefined || PcAutomationHolder === null) {
            setTimeout(init, 50);
            return;
        }

        var btn = document.createElement('button');
        btn.setAttribute('id', BUTTON_ID);
        btn.innerHTML = 'Open More Instances';
        btn.addEventListener('click', openMoreInstances);

        PcAutomationHolder.addAutomationButton(btn);

        checkAndLoadSave();
    }

    function checkAndLoadSave() {
        let elems = document.querySelectorAll('.trainer-card');
        if(elems.length === 0) {
            setTimeout(checkAndLoadSave, 250);
            return;
        }
        elems[0].click();
    }

    var children = [];
    var count = 12;
    function openMoreInstances() {
        if(count <= 0) {
            return;
        }
        let child_window = window.open('https://www.pokeclicker.com/#', '_blank', 'height=250,width=770');
        child_window.moveTo(-1928, 50 * count);
        children.push(child_window);
        count--;
        setTimeout(openMoreInstances, 1000)
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

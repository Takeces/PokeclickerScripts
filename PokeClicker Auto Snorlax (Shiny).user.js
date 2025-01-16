// ==UserScript==
// @name         PokeClicker Auto Snorlax (Shiny)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto route switch to get shiny snorlax fast
// @author       Takeces
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var intervalSnorlax = null;
	var autoTimeout = 50;
    const BUTTON_ID = 'pcDoAutoSnorlax';

    function init() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(PcAutomationHolder === undefined || PcAutomationHolder === null) {
            setTimeout(init, 50);
            return;
        }

        var btn = document.createElement('button');
        btn.setAttribute('id', BUTTON_ID);
        btn.innerHTML = 'Auto Snorlax';
        btn.addEventListener('click', toggle);

        PcAutomationHolder.addAutomationButton(btn);
    }

    function shinySnorlax() {
        if(App.game.party.alreadyCaughtPokemonByName('Snorlax', true)) {
            disable();
            return;
        }

        const enemy = TemporaryBattleBattle.enemyPokemon();
        if(enemy === null || !enemy.shiny) {
            TemporaryBattleList['Snorlax route 12'].protectedOnclick();
        }
    }

    function toggle() {
        if(intervalSnorlax === null) {
            intervalSnorlax = setInterval(shinySnorlax, autoTimeout);
            document.getElementById(BUTTON_ID).style.backgroundColor = 'green';
            return;
        }
        disable();
    }

    function disable() {
        document.getElementById(BUTTON_ID).style.backgroundColor = '';
        clearInterval(intervalSnorlax);
        intervalSnorlax = null;
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

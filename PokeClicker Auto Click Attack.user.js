// ==UserScript==
// @name         PokeClicker Auto Click Attack
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto click attack
// @author       Takeces
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var autoAttackTimeout = 50;
    var autoAttackInterval = null;
    const BUTTON_ID = 'pcDoAutoAttack';

    function init() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(PcAutomationHolder === undefined || PcAutomationHolder === null) {
            setTimeout(init, 50);
            return;
        }

        var btn = document.createElement('button');
        btn.setAttribute('id', BUTTON_ID);
        btn.innerHTML = 'Auto Attack';
        btn.addEventListener('click', toggleAutoAttack);

        PcAutomationHolder.addAutomationButton(btn);
    }

    function doAutoAttack() {
        switch(App.game.gameState) {
            case GameConstants.GameState.fighting:
                Battle.clickAttack();
                break;
            case GameConstants.GameState.gym:
                GymBattle.clickAttack();
                break;
            case GameConstants.GameState.dungeon:
                DungeonBattle.clickAttack();
                break;
            case GameConstants.GameState.battleFrontier:
                BattleFrontierBattle.clickAttack();
                break;
            case GameConstants.GameState.temporaryBattle:
                TemporaryBattleBattle.clickAttack();
                break;
        }
    }

    function toggleAutoAttack() {
        if(autoAttackInterval === null) {
            autoAttackInterval = setInterval(doAutoAttack, autoAttackTimeout);
            document.getElementById(BUTTON_ID).style.backgroundColor = 'green';
            return;
        }
        disableAutoAttack();
    }

    function disableAutoAttack() {
        document.getElementById(BUTTON_ID).style.backgroundColor = '';
        clearInterval(autoAttackInterval);
        autoAttackInterval = null;
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

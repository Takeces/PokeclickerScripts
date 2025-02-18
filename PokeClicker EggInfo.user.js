// ==UserScript==
// @name         PokeClicker EggInfo
// @namespace    pcInfoStuff
// @version      0.1
// @description  Show shiny info for egg slots
// @author       Takeces
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        setInterval(updateEggInfo, 500);
    }

    function updateEggInfo() {
        if(typeof App === 'undefined' || typeof App.game === 'undefined' || typeof App.game.breeding === 'undefined') return;

		for(let i = 0; i < 4; i++) {
			const egg = App.game.breeding.eggList[i]();
			if(egg.type < 0) {
				break;
			};

			const oldImg = document.getElementById('egg_caught_hint_'+i);
			if(oldImg !== null) { oldImg.remove(); }

			const pokeId = egg.pokemon;

			let pokeCaughtImg = document.createElement('img');
			pokeCaughtImg.setAttribute('src', getPokeballImage(pokeId));
			pokeCaughtImg.setAttribute('id', 'egg_caught_hint_'+i);
			pokeCaughtImg.setAttribute('style', 'width: 1.5em; position: absolute; right: 0.2em;  top: 0.2em;');
			document.querySelectorAll('#eggList .eggSlot')[i].appendChild(pokeCaughtImg);
		}
	}

	function getPokeballImage(pokeName) {
		if(App.game.party.alreadyCaughtPokemonByName(pokeName, true)) {
			return 'assets/images/pokeball/Pokeball-shiny.svg';
		}
		if(App.game.party.alreadyCaughtPokemonByName(pokeName)) {
			return 'assets/images/pokeball/Pokeball.svg';
		}
        return 'assets/images/pokeball/None.svg';
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

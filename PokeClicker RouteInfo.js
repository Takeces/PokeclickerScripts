// ==UserScript==
// @name         PokeClicker RouteInfo
// @namespace    pcInfoStuff
// @version      0.1
// @description  Show current route infos
// @author       Takeces
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';



    function init() {
        initRouteInfo();
    }

	/** Route Info */

	function initRouteInfo() {
        let routePokesContainer = document.createElement('div');
        routePokesContainer.setAttribute('id', 'pcRoutePokesContainer');
        routePokesContainer.setAttribute('style', 'position: fixed; top: 1em; left: 1em; padding-left: 0.5em; padding-right: 1em;');
        routePokesContainer.setAttribute('class', 'card secondary-border');
        document.getElementsByTagName('body')[0].appendChild(routePokesContainer);

        // start the info update process
        setInterval(fillRoutePokesContainer, 2000);
	}

    function fillRoutePokesContainer() {
        let container = document.getElementById('pcRoutePokesContainer');
        container.innerHTML = '';

        if(player === undefined) { return; }

        let route = Routes.getRoute(player.region, player.route());
        if(route === undefined) { return; }
        let pokes = route.pokemon.land.concat(route.pokemon.water);
        for(let i = 0; i < pokes.length; i++) {
            let pokeDiv = document.createElement('div');

            let pokeCaughtImg = document.createElement('img');
            pokeCaughtImg.setAttribute('src', getPokeballImage(pokes[i]));
            pokeCaughtImg.setAttribute('style', 'width: 0.75em;');
            pokeDiv.appendChild(pokeCaughtImg);


            let pokeImg = document.createElement('img');
            pokeImg.setAttribute('class', 'smallImage');
            pokeImg.setAttribute('src', getPokeImage(pokes[i]));
            pokeDiv.appendChild(pokeImg);

            let pokeSpan = document.createElement('span');
            pokeSpan.innerHTML = pokes[i];
            pokeDiv.appendChild(pokeSpan);

            container.appendChild(pokeDiv);
        }
    }

    function getPokeballImage(pokeName) {
        for(let i = 0; i < App.game.party._caughtPokemon().length; i++) {
            if(App.game.party._caughtPokemon()[i].name === pokeName) {
                if(App.game.party._caughtPokemon()[i].shiny) {
                    return 'assets/images/pokeball/Pokeball-shiny.svg';
                } else {
                    return 'assets/images/pokeball/Pokeball.svg';
                }
            }
        }
        return 'assets/images/pokeball/None.svg';
    }

    function getPokeImage(pokeName) {
        return PokemonHelper.getImage(PokemonHelper.getPokemonByName(pokeName).id);
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

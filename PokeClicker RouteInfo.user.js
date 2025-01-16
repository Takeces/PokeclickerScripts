// ==UserScript==
// @name         PokeClicker RouteInfo
// @namespace    pcInfoStuff
// @version      0.9
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

        let pokes = [];

        let route = Routes.getRoute(player.region, player.route);
        if(route !== undefined) {
            pokes = RouteHelper.getAvailablePokemonList(player.route, player.region);
        } else if(player.town instanceof DungeonTown) {
            let dungeon = player.town.dungeon;
            pokes = dungeon.allAvailablePokemon();
        } else if(player.town.name === "Safari Zone" || player.town.name === "National Park") {
            for(const poke of SafariPokemonList.list[player.region]()) {
                if(poke.isAvailable()) {
                    pokes.push(poke.name);
                }
            }
        }

        pokes.sort(function(a,b) {
            return PartyController.getCaughtStatus(PokemonHelper.getPokemonByName(a).id) - PartyController.getCaughtStatus(PokemonHelper.getPokemonByName(b).id);
        });

        if(pokes.length > 0) {
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

        let mysDisplayDiv = document.createElement('div');
        let text = document.createElement('span');
        text.innerHTML = '<img style="height: 20px;" src="assets/images/breeding/Mystery_egg.png" />:&nbsp;<img style="height: 20px;" src="assets/images/pokeball/Pokeball-shiny.svg" />' + checkEggsRemaining(GameConstants.EggItemType.Mystery_egg, true) + '&nbsp;|&nbsp;<img style="height: 20px;" src="assets/images/pokeball/Pokeball.svg" />' + checkEggsRemaining(GameConstants.EggItemType.Mystery_egg, false);
        mysDisplayDiv.appendChild(text);
        container.appendChild(mysDisplayDiv);
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

    function checkEggsRemaining(type = GameConstants.EggItemType.Mystery_egg, shiny = true) {
        let possiblePokes = [];
        if(type !== GameConstants.EggItemType.Mystery_egg) {
            possiblePokes = App.game.breeding.hatchList[type][player.region];
        } else {
            possiblePokes = App.game.breeding.hatchList[0][player.region].concat(
                App.game.breeding.hatchList[1][player.region],
                App.game.breeding.hatchList[2][player.region],
                App.game.breeding.hatchList[3][player.region],
                App.game.breeding.hatchList[4][player.region],
                App.game.breeding.hatchList[5][player.region],
                App.game.breeding.hatchList[7][player.region]
            );
        }
        let result = 0;
        for(let i = 0; i < possiblePokes.length; i++) {
            if(!App.game.party.alreadyCaughtPokemonByName(possiblePokes[i], shiny)) {
                result++;
            }
        }
        return result;
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

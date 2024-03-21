// ==UserScript==
// @name         PokeClicker Phase Tracker V2
// @namespace    pcInfoStuff
// @version      0.3
// @description  Show phasing info
// @author       Takeces
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        let container = document.createElement('div');
        container.setAttribute('id', 'pcPhasingContainer');
        container.setAttribute('style', 'position: fixed; bottom: 1em; right: 1em; padding-left: 0.5em; padding-right: 1em;');
        container.setAttribute('class', 'card border-secondary');

        let header = document.createElement('div');
        header.setAttribute('class', 'card-header p-0');
        header.setAttribute('data-toggle', 'collapse');
        header.setAttribute('href', '#pcPhasingBody');
        header.setAttribute('aria-expanded', 'true');
        header.innerHTML = '<span>Phasing</span>';
        container.appendChild(header);

        let btn = document.createElement('button');
        btn.setAttribute('class', 'btn btn-primary');
        btn.setAttribute('style', 'position: absolute; right: 0px; top: 0px; width: auto; height: 41px; padding: 4px;');
        btn.innerHTML = '+';
        btn.addEventListener('click', addNewPhase);
        container.appendChild(btn);

        let body = document.createElement('div');
        body.setAttribute('id', 'pcPhasingBody');
        body.setAttribute('class', 'card-body p-1 show');
        body.setAttribute('style', 'height: 15em; overflow: auto;');
        container.appendChild(body);

        document.getElementsByTagName('body')[0].appendChild(container);

        getFromLocalStorage();

        initPhasing();

        // start the info update process
        setInterval(fillContainer, 2000);
    }

    function initPhasing() {

        (function() {
            var ogFunc =  Battle.generateNewEnemy; // <-- Reference
            Battle.generateNewEnemy = function() {
                ogFunc.apply(this);
                increasePhase();
            };
        })();

        var currentPhase = null;
        (function() {
            var ogFunc2 = Battle.defeatPokemon; // <-- Reference
            Battle.defeatPokemon = function() {
                const enemy = Battle.enemyPokemon();
                if(enemy.shiny) {
                    currentPhase = getCurrentPhase();
                    addNewPhase();
                }

                ogFunc2.apply(this);

                if(!enemy.shiny) { return; }

                currentPhase.pokemon = enemy.name;
                currentPhase.location = getLocationName();
                currentPhase.encounterType = enemy.encounterType;
                currentPhase.numberOfShinies = countShinies();
                currentPhase.result = 'No Attempt';

                storeToLocalStorage();
            };
        })();

        (function() {
            var ogFunc3 =  Battle.attemptCatch;
            Battle.attemptCatch = function(enemyPokemon, route, region) {
                if(currentPhase !== null) {
                    currentPhase.result = 'Escaped';
                }
                ogFunc3.apply(this, [enemyPokemon, route, region]);
            };
        })();

        (function() {
            var ogFunc4 = Battle.catchPokemon;
            Battle.catchPokemon = function(enemyPokemon, route, region) {
                ogFunc4.apply(this, [enemyPokemon, route, region]);
                if(currentPhase !== null) {
                    currentPhase.result = 'Catched';
                }
            };
        })();
    }

    var phaseObject = {
        date: new Date().getTime(),
        count: 0,
        pokemon: '',
        location: '',
        encounterType: '',
        result: '',
        numberOfShinies: 0
    };

    function getNewPhase() {
        let phase = JSON.parse(JSON.stringify(phaseObject));
        phase.date = new Date().getTime()
        return phase;
    }

    var phasing = [getNewPhase()];

	function initContainer() {
	}

    function addNewPhase() {
        phasing.push(getNewPhase());
        storeToLocalStorage();
    }

    function fillContainer() {
        let body = document.getElementById('pcPhasingBody');
        body.innerHTML = '';
        let table = document.createElement('table');
        table.setAttribute('class', 'table table-sm m-0');
        for(let i = phasing.length - 1; i >= 0; i--) {
            let elem = document.createElement('tr');

            let tdSince = document.createElement('td');
            tdSince.innerHTML = 'Since '+(new Date(phasing[i].date)).toLocaleString();
            elem.appendChild(tdSince);

            let tdShinies = document.createElement('td');
            tdShinies.innerHTML = phasing[i].numberOfShinies;
            elem.appendChild(tdShinies);

            let tdLocation = document.createElement('td');
            tdLocation.innerHTML = phasing[i].location;
            elem.appendChild(tdLocation);

            let tdEncounter = document.createElement('td');
            tdEncounter.innerHTML = phasing[i].encounterType;
            elem.appendChild(tdEncounter);

            let tdPokemon = document.createElement('td');
            tdPokemon.innerHTML = phasing[i].pokemon;
            elem.appendChild(tdPokemon);

            let tdResult = document.createElement('td');
            tdResult.innerHTML = phasing[i].result;
            elem.appendChild(tdResult);

            let tdCount = document.createElement('td');
            tdCount.innerHTML = phasing[i].count;
            elem.appendChild(tdCount);

            let deleteBtn = document.createElement('button');
            deleteBtn.addEventListener('click', function() {deletePhase(i);});
            deleteBtn.setAttribute('class', 'btn btn-danger');
            deleteBtn.innerHTML = 'x';
            elem.appendChild(deleteBtn);

            table.appendChild(elem);
        }
        body.appendChild(table);
    }

    function deletePhase(index) {
        phasing.splice(index, 1);
        storeToLocalStorage();
        fillContainer();
    }

    function storeToLocalStorage() {
        localStorage.setItem('pcPhasing', JSON.stringify(phasing));
    }

    function getFromLocalStorage() {
        let stored = localStorage.getItem('pcPhasing');
        if(stored === null) { return; }
        phasing = JSON.parse(stored);
    }

    function increasePhase() {
        getCurrentPhase().count++;
        storeToLocalStorage();
    }

    function getCurrentPhase() {
        return phasing.slice(-1)[0];
    }

    function countShinies() {
        let pkmn = App.game.party.caughtPokemon;
        let result = 0;
        for(let i = 0; i < pkmn.length; i++) {
            if(pkmn[i].shiny) { result++; }
        }
        return result;
    }

    function getLocationName() {
        // Route
        if(App.game.gameState === GameConstants.GameState.fighting) {
            return Routes.getName(player.route(), player.region);
        }

        // Dungeon
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
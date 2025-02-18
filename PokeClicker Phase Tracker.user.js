// ==UserScript==
// @name         PokeClicker Phase Tracker
// @namespace    pcInfoStuff
// @version      0.16
// @description  Show phasing info
// @author       Takeces
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_ID = 'pcStopFlashing';
    function init() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(PcAutomationHolder === undefined || PcAutomationHolder === null) {
            setTimeout(init, 50);
            return;
        }

        let container = document.createElement('div');
        container.setAttribute('id', 'pcPhasingContainer');
        container.setAttribute('style', 'position: fixed; bottom: 1em; right: 1em; padding-left: 0.5em; padding-right: 1em; z-index: 2;');
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

        var btnStop = document.createElement('button');
        btnStop.setAttribute('id', BUTTON_ID);
        btnStop.innerHTML = 'Stop Flashing';
        btnStop.addEventListener('click', stopFlashBackground);

        PcAutomationHolder.addAutomationButton(btnStop);
    }

    function initPhasing() {
        initBattleHooks();
        initDungeonHooks();
        initTemporaryBattleHooks();
        initSafariBattleHooks();
    }

    function initBattleHooks() {

        (function() {
            var ogFunc = Battle.generateNewEnemy; // <-- Reference
            Battle.generateNewEnemy = function() {
                ogFunc.apply(this);
                increasePhase();
                const enemy = this.enemyPokemon();
                resetPhaseToEdit();
                if(enemy.shiny) {
                    identifyPhaseToEditIndex();
                    var currentPhase = getCurrentPhase();
                    addNewPhase();
                    currentPhase.pokemon = enemy.name;
                    currentPhase.location = getLocationName();
                    currentPhase.encounterType = enemy.encounterType;
                    currentPhase.numberOfShinies = countShinies();
                    currentPhase.result = 'No Attempt';
                    storeToLocalStorage();
                }
            };
        })();

        (function() {
            var ogFunc3 = Battle.attemptCatch;
            Battle.attemptCatch = function(enemyPokemon, route, region) {
                var currentPhase = getCurrentPhase();
                if(currentPhase !== null) {
                    currentPhase.result = 'Escaped';
                    storeToLocalStorage();
                }
                ogFunc3.apply(this, [enemyPokemon, route, region]);
            };
        })();

        (function() {
            var ogFunc4 = Battle.catchPokemon;
            Battle.catchPokemon = function(enemyPokemon, route, region) {
                ogFunc4.apply(this, [enemyPokemon, route, region]);
                var currentPhase = getCurrentPhase();
                if(currentPhase !== null) {
                    currentPhase.result = 'Catched';
					currentPhase.numberOfShinies = countShinies();
                    storeToLocalStorage();
                    startFlashBackground();
                }
            };
        })();
    }

    function initDungeonHooks() {

        (function() {
            var ogFunc =  DungeonBattle.generateNewEnemy; // <-- Reference
            DungeonBattle.generateNewEnemy = function() {
                ogFunc.apply(this);
                increasePhase();
                const enemy = DungeonBattle.enemyPokemon();
                resetPhaseToEdit();
                if(enemy.shiny) {
                    identifyPhaseToEditIndex();
                    var currentPhase = getCurrentPhase();
                    addNewPhase();
                    currentPhase.pokemon = enemy.name;
                    currentPhase.location = getLocationName();
                    currentPhase.encounterType = enemy.encounterType;
                    currentPhase.numberOfShinies = countShinies();
                    currentPhase.result = 'No Attempt';
                    storeToLocalStorage();
                }
            };
        })();

        (function() {
            var ogFunc2 = DungeonBattle.generateNewBoss; // <-- Reference
            DungeonBattle.generateNewBoss = function() {
                ogFunc2.apply(this);
                increasePhase();
                resetPhaseToEdit();
                if(DungeonBattle.trainer() !== null) { return; }
                const enemy = DungeonBattle.enemyPokemon();
                if(enemy.shiny) {
                    identifyPhaseToEditIndex();
                    var currentPhase = getCurrentPhase();
                    addNewPhase();
                    currentPhase.pokemon = enemy.name;
                    currentPhase.location = getLocationName();
                    currentPhase.encounterType = enemy.encounterType;
                    currentPhase.numberOfShinies = countShinies();
                    currentPhase.result = 'No Attempt';
                    storeToLocalStorage();
                }
            };
        })();

        (function() {
            var ogFunc3 = DungeonBattle.attemptCatch;
            DungeonBattle.attemptCatch = function(enemyPokemon, route, region) {
                var currentPhase = getCurrentPhase();
                if(currentPhase !== null) {
                    currentPhase.result = 'Escaped';
                    storeToLocalStorage();
                }
                ogFunc3.apply(this, [enemyPokemon, route, region]);
            };
        })();

        (function() {
            var ogFunc4 = DungeonBattle.catchPokemon;
            DungeonBattle.catchPokemon = function(enemyPokemon, route, region) {
                ogFunc4.apply(this, [enemyPokemon, route, region]);
                var currentPhase = getCurrentPhase();
                if(currentPhase !== null) {
                    currentPhase.result = 'Catched';
					currentPhase.numberOfShinies = countShinies();
                    storeToLocalStorage();
                    startFlashBackground();
                }
            };
        })();
    }

    function initTemporaryBattleHooks() {

        (function() {
            var ogFunc =  TemporaryBattleBattle.generateNewEnemy; // <-- Reference
            TemporaryBattleBattle.generateNewEnemy = function() {
                ogFunc.apply(this);
                increasePhase();
                const enemy = TemporaryBattleBattle.enemyPokemon();
                resetPhaseToEdit();
                if(enemy.shiny) {
                    identifyPhaseToEditIndex();
                    var currentPhase = getCurrentPhase();
                    addNewPhase();
                    currentPhase.pokemon = enemy.name;
                    currentPhase.location = TemporaryBattleBattle.battle.name;
                    currentPhase.encounterType = enemy.encounterType;
                    currentPhase.numberOfShinies = countShinies();
                    currentPhase.result = 'No Attempt';
                    storeToLocalStorage();
                }
            };
        })();

        (function() {
            var ogFunc3 = TemporaryBattleBattle.attemptCatch;
            TemporaryBattleBattle.attemptCatch = function(enemyPokemon, route, region) {
                var currentPhase = getCurrentPhase();
                if(currentPhase !== null) {
                    currentPhase.result = 'Escaped';
                    storeToLocalStorage();
                }
                ogFunc3.apply(this, [enemyPokemon, route, region]);
            };
        })();

        (function() {
            var ogFunc4 = TemporaryBattleBattle.catchPokemon;
            TemporaryBattleBattle.catchPokemon = function(enemyPokemon, route, region) {
                ogFunc4.apply(this, [enemyPokemon, route, region]);
                var currentPhase = getCurrentPhase();
                if(currentPhase !== null) {
                    currentPhase.result = 'Catched';
					currentPhase.numberOfShinies = countShinies();
                    storeToLocalStorage();
                    startFlashBackground();
                }
            };
        })();
    }

    function initSafariBattleHooks() {

        (function() {
            var ogFunc =  SafariBattle.load; // <-- Reference
            SafariBattle.load = function(enemy = SafariPokemon.random(Safari.activeEnvironment())) {
                ogFunc.apply(this, [enemy]);
                increasePhase();
                resetPhaseToEdit();
                if(SafariBattle.enemy.shiny) {
                    identifyPhaseToEditIndex();
                    var currentPhase = getCurrentPhase();
                    addNewPhase();
                    currentPhase.pokemon = SafariBattle.enemy.name;
                    currentPhase.location = SafariBattle.name;
                    currentPhase.encounterType = 'Safari';
                    currentPhase.numberOfShinies = countShinies();
                    currentPhase.result = 'No Attempt';
                    storeToLocalStorage();
                }
            };
        })();

        (function() {
            var ogFunc3 = SafariBattle.throwBall;
            SafariBattle.throwBall = function() {
                var currentPhase = getCurrentPhase();
                if(currentPhase !== null) {
                    currentPhase.result = 'Escaped';
                    storeToLocalStorage();
                }
                ogFunc3.apply(this);
            };
        })();

        (function() {
            var ogFunc4 = SafariBattle.capturePokemon;
            SafariBattle.capturePokemon = function() {
                ogFunc4.apply(this);
                var currentPhase = getCurrentPhase();
                if(currentPhase !== null) {
                    currentPhase.result = 'Catched';
					currentPhase.numberOfShinies = countShinies();
                    storeToLocalStorage();
                    startFlashBackground();
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

    function addNewPhase() {
        phasing.push(getNewPhase());
        storeToLocalStorage();
    }

    function fillContainer() {
        let body = document.getElementById('pcPhasingBody');
        body.innerHTML = '';
        body.style.height = '15em';
        let table = document.createElement('table');
        table.setAttribute('class', 'table table-sm m-0');
        for(let i = phasing.length - 1; i >= 0; i--) {
            let elem = document.createElement('tr');

            let tdSince = document.createElement('td');
            tdSince.innerHTML = (new Date(phasing[i].date)).toLocaleString();
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
            deleteBtn.setAttribute('style', 'padding: 4px;');
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
        if(phaseToEditIndex !== null) {
            phasing[phaseToEditIndex] = phaseToEdit;
        }
        localStorage.setItem('pcPhasing', JSON.stringify(phasing));
    }

    function getFromLocalStorage() {
        let stored = localStorage.getItem('pcPhasing');
        if(stored === null) { return; }
        phasing = JSON.parse(stored);
    }

    function increasePhase() {
	    getFromLocalStorage();
        let idx = phasing.length - 1;
        if(idx < 0) {
            addNewPhase();
        }
        phasing[phasing.length - 1].count++;
        storeToLocalStorage();
    }

    var phaseToEditIndex = null;
    var phaseToEdit = null;
    function identifyPhaseToEditIndex() {
        phasing = phasing.slice(-30);
        phaseToEditIndex = phasing.length - 1;
        phaseToEdit = phasing[phaseToEditIndex];
    }
    function resetPhaseToEdit() {
        phaseToEditIndex = null;
        phaseToEdit = null;
    }

    function getCurrentPhase() {
        return phaseToEdit;
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

        // Dungeon
		if(player.town instanceof DungeonTown) {
			return player.town.name;
		}

        // Route
        if(player.route > 0) {
            return Routes.getName(player.route, player.region);
        }
    }

    var flashInterval = null;
    var flashTimeout = 500;
    function startFlashBackground() {
        if(flashInterval !== null) {
            return;
        }
        flashInterval = setInterval(flashBackground, flashTimeout);
    }

    function stopFlashBackground() {
        clearInterval(flashInterval);
        flashInterval = null;
        document.querySelector('body').style.background = '';
    }

    var flashState = false;
    function flashBackground() {
        if(flashState) {
            flashState = false;
            document.querySelector('body').style.background = '';
            return;
        }
        flashState = true;
        document.querySelector('body').style.background = 'red';
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

// ==UserScript==
// @name         PokeClicker Auto Achievements
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Auto achievement walker
// @author       Takeces
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_ID_ROUTES = 'pcDoAutoAchievementRoutes';
    const BUTTON_ID_GYMS = 'pcDoAutoAchievementGyms';
    const BUTTON_ID_DUNGEONS = 'pcDoAutoAchievementDungeons';
    const BUTTON_ID_PKRS_ROUTES = 'pcDoAutoPKRSRoutes';
    const BUTTON_ID_PKRS_DUNGEONS = 'pcDoAutoPKRSDungeons';

    var bAutoRoutes = false;
    var bAutoGyms = false;
    var bAutoDungeons = false;
    var bAutoPkrsRoutes = false;
    var bAutoPkrsDungeons = false;

    function init() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(PcAutomationHolder === undefined || PcAutomationHolder === null) {
            setTimeout(init, 50);
            return;
        }

        var btn = document.createElement('button');
        btn.setAttribute('id', BUTTON_ID_ROUTES);
        btn.innerHTML = 'AA Routes';
        btn.addEventListener('click', toggleAutoAchievementRoutes);

        var btn2 = document.createElement('button');
        btn2.setAttribute('id', BUTTON_ID_GYMS);
        btn2.innerHTML = 'AA Gyms';
        btn2.addEventListener('click', toggleAutoAchievementGyms);

        var btn3 = document.createElement('button');
        btn3.setAttribute('id', BUTTON_ID_DUNGEONS);
        btn3.innerHTML = 'AA Dungeons';
        btn3.addEventListener('click', toggleAutoAchievementDungeons);

        var btn4 = document.createElement('button');
        btn4.setAttribute('id', BUTTON_ID_PKRS_ROUTES);
        btn4.innerHTML = 'PKRS Routes';
        btn4.addEventListener('click', toggleAutoPkrsRoutes);

        var btn5 = document.createElement('button');
        btn5.setAttribute('id', BUTTON_ID_PKRS_DUNGEONS);
        btn5.innerHTML = 'PKRS Dungeons';
        btn5.addEventListener('click', toggleAutoPkrsDungeons);

        PcAutomationHolder.addAutomationButton(btn);
        PcAutomationHolder.addAutomationButton(btn2);
        PcAutomationHolder.addAutomationButton(btn3);
        PcAutomationHolder.addAutomationButton(btn4);
        PcAutomationHolder.addAutomationButton(btn5);
    }

	function toggleAutoAchievementRoutes() {
		if(bAutoRoutes) {
            disableAutoAchievementRoutes();
			return;
		}
        disableAutoAchievementGyms();
        disableAutoAchievementDungeons();
        disableAutoPkrsRoutes();
        disableAutoPkrsDungeons();
        bAutoRoutes = true;
        document.getElementById(BUTTON_ID_ROUTES).style.backgroundColor = 'green';
		doAutoRoutes();
	}

    function disableAutoAchievementRoutes() {
        document.getElementById(BUTTON_ID_ROUTES).style.backgroundColor = '';
		bAutoRoutes = false;
    }

	function toggleAutoAchievementGyms() {
		if(bAutoGyms) {
            disableAutoAchievementGyms();
			return;
		}
        disableAutoAchievementRoutes();
        disableAutoAchievementDungeons();
        disableAutoPkrsRoutes();
        disableAutoPkrsDungeons();
        bAutoGyms = true;
        document.getElementById(BUTTON_ID_GYMS).style.backgroundColor = 'green';
		doAutoGyms();
	}

    function disableAutoAchievementGyms() {
        document.getElementById(BUTTON_ID_GYMS).style.backgroundColor = '';
		bAutoGyms = false;
    }

	function toggleAutoAchievementDungeons() {
		if(bAutoDungeons) {
            disableAutoAchievementDungeons();
			return;
		}
        disableAutoAchievementRoutes();
        disableAutoAchievementGyms();
        disableAutoPkrsRoutes();
        disableAutoPkrsDungeons();
        bAutoDungeons = true;
        document.getElementById(BUTTON_ID_DUNGEONS).style.backgroundColor = 'green';
		doAutoDungeons();
	}

    function disableAutoAchievementDungeons() {
        document.getElementById(BUTTON_ID_DUNGEONS).style.backgroundColor = '';
		bAutoDungeons = false;
    }

    function toggleAutoPkrsRoutes() {
        if(bAutoPkrsRoutes) {
            disableAutoPkrsRoutes();
			return;
		}
        disableAutoAchievementRoutes();
        disableAutoAchievementGyms();
        disableAutoAchievementDungeons();
        disableAutoPkrsDungeons();
        bAutoPkrsRoutes = true;
        document.getElementById(BUTTON_ID_PKRS_ROUTES).style.backgroundColor = 'green';
		doAutoPkrsRoutes();
    }

    function disableAutoPkrsRoutes() {
        document.getElementById(BUTTON_ID_PKRS_ROUTES).style.backgroundColor = '';
		bAutoPkrsRoutes = false;
    }

    function toggleAutoPkrsDungeons() {
        if(bAutoPkrsDungeons) {
            disableAutoPkrsDungeons();
			return;
		}
        disableAutoAchievementRoutes();
        disableAutoAchievementGyms();
        disableAutoAchievementDungeons();
        disableAutoPkrsRoutes();
        bAutoPkrsDungeons = true;
        document.getElementById(BUTTON_ID_PKRS_DUNGEONS).style.backgroundColor = 'green';
		doAutoPkrsDungeons();
    }

    function disableAutoPkrsDungeons() {
        document.getElementById(BUTTON_ID_PKRS_DUNGEONS).style.backgroundColor = '';
		bAutoPkrsDungeons = false;
    }

    function doAutoRoutes() {
        if(!bAutoRoutes) { return; }

        let complete = checkAndMoveNextRoute();
        if(complete) {
            disableAutoAchievementRoutes();
            return;
        }

        setTimeout(doAutoRoutes, 500);
    }

    function doAutoGyms() {
        if(!bAutoGyms) { return; }

        let complete = checkAndMoveNextGym();
        if(complete) {
            disableAutoAchievementGyms();
            return;
        }

        setTimeout(doAutoGyms, 500);
    }

    function doAutoDungeons() {
        if(!bAutoDungeons) { return; }

        let complete = checkAndMoveNextDungeon();
        if(complete) {
            disableAutoAchievementDungeons();
            return;
        }

        setTimeout(doAutoDungeons, 500);
    }

    function doAutoPkrsRoutes() {
        if(!bAutoPkrsRoutes) { return; }

        let complete = checkAndMoveNextPkrsRoute();
        if(complete) {
            disableAutoPkrsRoutes();
            return;
        }

        setTimeout(doAutoPkrsRoutes, 500);
    }

    function doAutoPkrsDungeons() {
        if(!bAutoPkrsDungeons) { return; }

        let complete = checkAndMoveNextPkrsDungeon();
        if(complete) {
            disableAutoPkrsDungeons();
            return;
        }

        setTimeout(doAutoPkrsDungeons, 500);
    }

    /** ROUTE FUNCTIONS */
    function getNextNeededRoute() {
        const routes = Routes.getRoutesByRegion(player.region);
        for(let i = 0; i < routes.length; i++) {
            let route = routes[i].number;
            if(!routes[i].isUnlocked()) { continue; }
            if(!RouteHelper.isAchievementsComplete(route, player.region)) {
                return route;
            }
        }
        return null;
    }

    function getNextNeededPkrsRoute() {
        const routes = Routes.getRoutesByRegion(player.region);
        for(let i = 0; i < routes.length; i++) {
            let route = routes[i].number;
            if(!routes[i].isUnlocked()) { continue; }
            if(RouteHelper.minPokerus(RouteHelper.getAvailablePokemonList(route, player.region, true)) < GameConstants.Pokerus.Resistant
              && RouteHelper.minPokerus(RouteHelper.getAvailablePokemonList(route, player.region, true)) != GameConstants.Pokerus.Resistant) {
                return route;
            }
        }
        return null;
    }

    function goToRoute(route) {
        if(route === null) { return; }
        if(route != player.route) {
            MapHelper.moveToRoute(route, player.region);
        }
    }

    function checkAndMoveNextRoute() {
        const route = getNextNeededRoute();
        if(route !== null) {
            goToRoute(route);
            return false;
        }
        return true;
    }

    function checkAndMoveNextPkrsRoute() {
        const route = getNextNeededPkrsRoute();
        if(route !== null) {
            goToRoute(route);
            return false;
        }
        return true;
    }

    /** GYM FUNCTIONS */

    function getNextNeededGym() {
        var gyms = GameConstants.RegionGyms[player.region];

		if(player.subregion === 0) {
	        for(let i = 0; i < gyms.length; i++) {
	            if(!GymList[gyms[i]].isUnlocked()) { continue; }
	            if(!GymList[gyms[i]].isAchievementsComplete()) {
	                return gyms[i];
	            }
	        }
		}

        if(player.region === 0 && player.subregion === 2) {
            gyms = GameConstants.OrangeGyms;
            for(let i = 0; i < gyms.length; i++) {
                if(!GymList[gyms[i]].isUnlocked()) { continue; }
                if(!GymList[gyms[i]].isAchievementsComplete()) {
                    return gyms[i];
                }
            }
        }

        if(player.region === 2 && player.subregion === 1) {
            gyms = GameConstants.OrreGyms;
            for(let i = 0; i < gyms.length; i++) {
                if(!GymList[gyms[i]].isUnlocked()) { continue; }
                if(!GymList[gyms[i]].isAchievementsComplete()) {
                    return gyms[i];
                }
            }
        }

        if(player.region === 6 && player.subregion === 4) {
            gyms = GameConstants.MagikarpJumpGyms;
            for(let i = 0; i < gyms.length; i++) {
                if(!GymList[gyms[i]].isUnlocked()) { continue; }
                if(!GymList[gyms[i]].isAchievementsComplete()) {
                    return gyms[i];
                }
            }
        }
        return null;
    }

    function goToNeededGym() {
        const gymName = getNextNeededGym();
        if(gymName === null) { return; }
        const town = GymList[gymName].parent.name;
        if(player.town.name == town) { return; }
        MapHelper.moveToTown(town);
    }


    function checkAndMoveNextGym() {
        if(getNextNeededGym() !== null) {
            // if currently in gym battle, do not move
            if(GymBattle.gym !== undefined && GymBattle.index() < GymBattle.gym.getPokemonList().length) {
                return false;
            }
            goToNeededGym();
            return false;
        }
        return true;
    }

    /** DUNGEON FUNCTIONS */

    function getNextNeededDungeon() {
        const dungeons = GameConstants.RegionDungeons[player.region];
        for(let i = 0; i < dungeons.length; i++) {
            if(!dungeonList[dungeons[i]].isUnlocked()) { continue; }
            if(!DungeonRunner.isAchievementsComplete(dungeonList[dungeons[i]])) {
                return dungeons[i];
            }
        }
        return null;
    }

    function getNextNeededPkrsDungeon() {
        const dungeons = GameConstants.RegionDungeons[player.region];
        for(let i = 0; i < dungeons.length; i++) {
            if(!dungeonList[dungeons[i]].isUnlocked()) { continue; }
            for(const poke of dungeonList[dungeons[i]].normalEncounterList) {
                if(poke.hide) continue;
                if(poke.lock) continue;
                if(!poke.pkrsImage || poke.pkrsImage == 'assets/images/breeding/pokerus/Resistant.png') continue;
                if(PcAutomationHolder.dungeonRunner.toggleAutoStartDungeonTogglePkrs) {
                    PcAutomationHolder.dungeonRunner.enableAllTiles();
                }
                return dungeons[i];
            }
            for(const poke of dungeonList[dungeons[i]].bossEncounterList) {
                if(poke.hide) continue;
                if(poke.lock) continue;
                if(!poke.pkrsImage || poke.pkrsImage == 'assets/images/breeding/pokerus/Resistant.png') continue;
                if(PcAutomationHolder.dungeonRunner.toggleAutoStartDungeonTogglePkrs) {
                    PcAutomationHolder.dungeonRunner.enableBossRush();
                }
                return dungeons[i];
            }
        }
        return null;
    }

    function goToDungeon(dungeonName) {
        if(dungeonName === null) { return; }
        if(player.town.name == dungeonName && player.route == 0) { return; }
        MapHelper.moveToTown(dungeonName);
    }

    function checkAndMoveNextDungeon() {
        const dungeonName = getNextNeededDungeon();
        if(dungeonName !== null) {
            // Currently in dungeon, do not move
            if(App.game.gameState === GameConstants.GameState.dungeon && DungeonRunner.dungeon && !DungeonRunner.dungeonFinished()) {
                return false;
            }
            goToDungeon(dungeonName);
            return false;
        }
        return true;
    }

    function checkAndMoveNextPkrsDungeon() {
        const dungeonName = getNextNeededPkrsDungeon();
        if(dungeonName !== null) {
            // Currently in dungeon, do not move
            if(App.game.gameState === GameConstants.GameState.dungeon && DungeonRunner.dungeon && !DungeonRunner.dungeonFinished()) {
                return false;
            }
            goToDungeon(dungeonName);
            return false;
        }
        return true;
    }

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();

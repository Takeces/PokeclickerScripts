// ==UserScript==
// @name         PokeClicker Auto Dungeon Runner
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Automaticly run through a dungeon
// @author       Takeces
// @updateURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Auto%20Dungeon%20Runner.user.js
// @downloadURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Auto%20Dungeon%20Runner.user.js
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var autoAttackTimeout = 50;
    var autoAttackInterval = null;
    const BUTTON_ID = 'pcDoAutoDungeonRun';
    const BUTTON_ID_BOSS_RUSH= 'pcDoAutoDungeonBossRush';
    const BUTTON_ID_ALL_TILES= 'pcDoAutoDungeonAllTiles';

	var bossRushEnabled = false;
	var visitAllTiles = false;

    function init() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(PcAutomationHolder === undefined || PcAutomationHolder === null) {
            setTimeout(init, 50);
            return;
        }

        var btn = document.createElement('button');
        btn.setAttribute('id', BUTTON_ID);
        btn.innerHTML = 'Auto Dungeon Run';
        btn.addEventListener('click', toggleAutoDungeon);

        var btnBossRush = document.createElement('button');
        btnBossRush.setAttribute('id', BUTTON_ID_BOSS_RUSH);
        btnBossRush.innerHTML = 'Boss Rush';
        btnBossRush.addEventListener('click', toggleBossRush);

        var btnAllTiles = document.createElement('button');
        btnAllTiles.setAttribute('id', BUTTON_ID_ALL_TILES);
        btnAllTiles.innerHTML = 'All Tiles';
        btnAllTiles.addEventListener('click', toggleAllTiles);

        PcAutomationHolder.addAutomationButton(btn);
        PcAutomationHolder.addAutomationButton(btnBossRush, true);
        PcAutomationHolder.addAutomationButton(btnAllTiles, true);

        if(!PcAutomationHolder.dungeonRunner) {
            PcAutomationHolder.dungeonRunner = {};
        }
        PcAutomationHolder.dungeonRunner.toggleAutoDungeon = toggleAutoDungeon;
        PcAutomationHolder.dungeonRunner.toggleBossRush = toggleBossRush;
        PcAutomationHolder.dungeonRunner.toggleAllTiles = toggleAllTiles;
    }

	var autoDungeonEnabled = false;
	function autoDungeon() {
		if(!autoDungeonEnabled) { return; }

		doDungeon();

		setTimeout(autoDungeon, 50);
	}

	function toggleAutoDungeon() {
		if(autoDungeonEnabled) {
			autoDungeonEnabled = false;
            document.getElementById(BUTTON_ID).style.backgroundColor = '';
			return;
		}

		autoDungeonEnabled = true;
        document.getElementById(BUTTON_ID).style.backgroundColor = 'green';
		autoDungeon();
	}

	function toggleBossRush() {
		if(bossRushEnabled) {
			bossRushEnabled = false;
            document.getElementById(BUTTON_ID_BOSS_RUSH).style.backgroundColor = '';
			return;
		}

		bossRushEnabled = true;
        document.getElementById(BUTTON_ID_BOSS_RUSH).style.backgroundColor = 'green';
	}

	function toggleAllTiles() {
		if(visitAllTiles) {
			visitAllTiles = false;
            document.getElementById(BUTTON_ID_ALL_TILES).style.backgroundColor = '';
			return;
		}

		visitAllTiles = true;
        document.getElementById(BUTTON_ID_ALL_TILES).style.backgroundColor = 'green';
	}

    function getPoint(x, y) {
		return new Point(x, y, DungeonRunner.map.playerPosition().floor);
	}

	function getTile(x, y) {
		let point = getPoint(x, y);
		return DungeonRunner.map.board()[point.floor][point.y][point.x];
	}

	function allAccessible() {
		let board = DungeonRunner.map.board()[DungeonRunner.map.playerPosition().floor];
		let xMax = board[0].length;
		let yMax = board.length;
		for(let x = 0; x < xMax; x++) {
			for(let y = 0; y < yMax; y++) {
				let hasAccess = DungeonRunner.map.hasAccessToTile(getPoint(x, y));
				if(!hasAccess) { return false; }
			}
		}
		return true;
	}

	function allVisited() {
		let board = DungeonRunner.map.board()[DungeonRunner.map.playerPosition().floor];
		let xMax = board[0].length;
		let yMax = board.length;
		for(let x = 0; x < xMax; x++) {
			for(let y = 0; y < yMax; y++) {
				let visited = getTile(x, y).isVisited;
				if(!visited) { return false; }
			}
		}
		return true;
	}


	function moveInDungeon() {
		let board = DungeonRunner.map.board()[DungeonRunner.map.playerPosition().floor];
		let xMax = board[0].length;
		let yMax = board.length;

        let xStart = 0;
        let xIncrement = 1;

        // flash movement
        if(!visitAllTiles && App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(DungeonRunner.dungeon.name)]() >= 100) {
            xStart = 1;
            xIncrement = 2;
        }

		for(let x = xStart; x < xMax; x = x + xIncrement) {
			for(let y = 0; y < yMax; y++) {
				let visited = getTile(x, y).isVisited;
				let hasAccess = DungeonRunner.map.hasAccessToTile(getPoint(x, y));
				if(visited) { continue; }
				if(!hasAccess) { continue; }
				DungeonRunner.map.moveToCoordinates(x, y);
				return;
			}
		}
	}

	function hasLoot() {
		let board = DungeonRunner.map.board()[DungeonRunner.map.playerPosition().floor];
		let xMax = board[0].length;
		let yMax = board.length;
		for(let x = 0; x < xMax; x++) {
			for(let y = 0; y < yMax; y++) {
				let tile = getTile(x, y);
				let hasLoot = tile.type() === GameConstants.DungeonTileType.chest;
				if(hasLoot) { return true; }
			}
		}
		return false;
	}

	function getLoot() {
		let board = DungeonRunner.map.board()[DungeonRunner.map.playerPosition().floor];
		let xMax = board[0].length;
		let yMax = board.length;
		for(let x = 0; x < xMax; x++) {
			for(let y = 0; y < yMax; y++) {
				let tile = getTile(x, y);
				let visible = tile.isVisible;
				let hasAccess = DungeonRunner.map.hasAccessToTile(getPoint(x, y));
				let hasLoot = tile.type() === GameConstants.DungeonTileType.chest;
				if(!hasLoot) { continue; }
				if(!visible) { continue; }
				if(!hasAccess) { continue; }
				DungeonRunner.map.moveToCoordinates(x, y);
				DungeonRunner.openChest();
				return;
			}
		}
	}

	function checkAndStartBoss() {
		if(DungeonRunner.map.currentTile().type() === GameConstants.DungeonTileType.boss) {
			DungeonRunner.startBossFight();
            return true;
		}
        return false;
	}

	function moveToAndStartBoss() {
		let board = DungeonRunner.map.board()[DungeonRunner.map.playerPosition().floor];
		let xMax = board[0].length;
		let yMax = board.length;
		for(let x = 0; x < xMax; x++) {
			for(let y = 0; y < yMax; y++) {
				let tile = getTile(x, y);
				let visible = tile.isVisible;
				let hasAccess = DungeonRunner.map.hasAccessToTile(getPoint(x, y));
				let isBoss = tile.type() === GameConstants.DungeonTileType.boss;
				if(!isBoss) { continue; }
				if(!visible) { continue; }
				if(!hasAccess) { continue; }
				DungeonRunner.map.moveToCoordinates(x, y);
				DungeonRunner.startBossFight();
				return;
			}
		}
	}

	function doDungeon() {

		// not in dungeon!
		if(App.game.gameState !== GameConstants.GameState.dungeon || !DungeonRunner.dungeon || DungeonRunner.dungeonFinished()) {
			return;
		}

		// currently fighting
		if(DungeonRunner.fighting()) {
			return;
		}

		if(bossRushEnabled) {
            moveToAndStartBoss();
			if(checkAndStartBoss()) {
                return;
            }
		}

		// movement to do
		if(!allAccessible() || (visitAllTiles && !allVisited())) {
			moveInDungeon();
			return;
		}

		if(hasLoot()) {
			getLoot();
			return;
		}

		moveToAndStartBoss();
	}

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

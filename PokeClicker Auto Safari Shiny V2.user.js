// ==UserScript==
// @name         PokeClicker Auto Safari Shiny V2
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Auto Safari shiny catching
// @author       Takeces
// @updateURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Auto%20Safari%20Shiny%20V2.user.js
// @downloadURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Auto%20Safari%20Shiny%20V2.user.js
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	var autoEnabled = false;
	var autoTimeout = 250;
    const BUTTON_ID = 'pcDoAutoSafariShinyV2';

    function init() {
        let PcAutomationHolder = window.PcAutomationHolder;
        if(PcAutomationHolder === undefined || PcAutomationHolder === null) {
            setTimeout(init, 50);
            return;
        }

        var btn = document.createElement('button');
        btn.setAttribute('id', BUTTON_ID);
        btn.innerHTML = 'Auto Safari V2';
        btn.addEventListener('click', toggleAuto);

        PcAutomationHolder.addAutomationButton(btn);

        setTimeout(checkGameLoadedAndRunning, 250);
    }

    function checkGameLoadedAndRunning() {
        let elem = document.getElementById('battleContainer');
        if(elem === null) {
            setTimeout(checkGameLoadedAndRunning, 250);
            return;
        }
        if (!elem.checkVisibility()) {
            setTimeout(checkGameLoadedAndRunning, 250);
            return;
        }

        setTimeout(startSafari, 250);
    }

    function startSafari() {
        Safari.openModal();
        setTimeout(Safari.payEntranceFee, 1000);
        setTimeout(toggleAuto, 1500);
    }

	function toggleAuto() {
		if(autoEnabled) {
			disableAuto();
			return;
		}
		autoEnabled = true;
		document.getElementById(BUTTON_ID).style.backgroundColor = 'green';
		doAuto();
	}

    function disableAuto() {
        document.getElementById(BUTTON_ID).style.backgroundColor = '';
		autoEnabled = false;
    }

	function doAuto() {
		if(!autoEnabled) { return; }

		doSafari();

        setTimeout(doAuto, autoTimeout);
	}

	function doSafari() {
        if(!Safari.inProgress()) {
            disableAuto();
            setTimeout(startSafari, 2000);
            return;
        }

        let bound = {x: Safari.grid[0].length, y: Safari.grid.length};
        let matrix = Array.from({length: bound.y}, () => Array.from({length: bound.x}, () => Infinity));
        let priority = 'up';
        const dirOrder = (() => {
            const lastDir = Safari.lastDirection;
            switch (lastDir) {
                case 'left': priority = 'right'; break;
                case 'up': priority = 'down'; break;
                case 'right': priority = 'left'; break;
                case 'down': priority = 'up'; break;
            }
            return [...new Set([priority, lastDir, 'up', 'down', 'left', 'right'])];
        })();

        let nearestGrass = {x:0, y:0, d:Infinity};
        const walkable = [
            0, //ground
            10, //grass
            11,12,13,14,21,22,23,24,15,16,17,18,19, //sand
        ];

        let movementMatrix = (origin) => {
            let queue = new Set([JSON.stringify(origin)]);
            for (let p = 0; p < queue.size; p++) {
                let {x, y} = JSON.parse([...queue][p]);
                if (!walkable.includes(Safari.grid[y][x])) {
                    continue;
                }
                const next = dirOrder.map((dir) => {
                    const xy = Safari.directionToXY(dir);
                    xy.x += x;
                    xy.y += y;
                    return xy;
                }).filter(({x,y}) => y < bound.y && y >= 0 && x < bound.x && x >= 0 );
                for (let n = 0; n < next.length; n++) {
                    queue.add(JSON.stringify(next[n]));
                }

                if (x == origin.x && y == origin.y) {
                    matrix[y][x] = 0;
                } else {
                    matrix[y][x] = Math.min(...next.map(({x, y}) => matrix[y][x])) + 1;

                    if (Safari.completed(true)) {
                        if (Safari.grid[y][x] != 10 && matrix[y][x] < nearestGrass.d) {
                            nearestGrass = {x, y, d: matrix[y][x]};
                        }
                    } else {
                        if (Safari.grid[y][x] == 10 && matrix[y][x] < nearestGrass.d && next.map(({x,y}) => Safari.grid[y][x]).includes(10)) {
                            nearestGrass = {x, y, d: matrix[y][x]};
                        }
                    }
                }
            }
        };

        if (Safari.inProgress() && document.querySelector('#safariModal').classList.contains('show')) {
            if (Safari.inBattle()) {
                if (!SafariBattle.busy()) {
                    if (SafariBattle.enemy.shiny && !App.game.party.alreadyCaughtPokemon(SafariBattle.enemy.id, true)) {
                        if (SafariBattle.enemy.eating < 1 && App.game.farming.berryList[11]() > 25) {
                            SafariBattle.throwBait(2);
                        } else if (Safari.balls() > 0) { //prevent balls to be negative and lock the safari
                            SafariBattle.throwBall();
                        }
                    } else {
                        SafariBattle.run();
                        setTimeout(() => {
                            SafariBattle.busy(false);
                        }, 1600); // anti soft lock
                    }
                }
            } else {
                let dest = {d: Infinity};
                movementMatrix(Safari.playerXY);

                const itm = Safari.itemGrid();
                for (let i = 0; i < itm.length; i++) {
                    const dist = matrix[itm[i].y][itm[i].x];
                    if (
                        dist < dest.d
                    ) {
                        dest = itm[i];
                        dest.d = dist;
                    }
                }

                if(itm.length < 1) {
                    const pkm = Safari.pokemonGrid();
                    for (let i = 0; i < pkm.length; i++) {
                        const dist = matrix[pkm[i].y][pkm[i].x];
                        if (
                            pkm[i].shiny && !App.game.party.alreadyCaughtPokemon(pkm[i].id, true) &&
                            dist < dest.d && dist < pkm[i].steps
                        ) {
                            dest = pkm[i];
                            dest.d = dist;
                        }
                    }
                }
                if (dest.d == Infinity) {
                    dest = nearestGrass;
                }

                movementMatrix(dest);
                const next = dirOrder.map(dir => {
                    const xy = Safari.directionToXY(dir);
                    xy.x += Safari.playerXY.x;
                    xy.y += Safari.playerXY.y;

                    if (xy.y >= bound.y || xy.y < 0 || xy.x >= bound.x || xy.x < 0) {
                        return null;
                    }
                    return {dir, ...xy, d: matrix[Safari.playerXY.y][Safari.playerXY.x] - matrix[xy.y][xy.x]};
                }).filter((n) => n && n.d > 0);

                if (next[0]) {
                    Safari.step(next[0].dir);
                }
            }
        }
	}

	/** Basic initialization call */

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

// ==UserScript==
// @name         PokeClicker Log
// @namespace    pcInfoStuff
// @version      0.2
// @description  Show last log entries
// @author       Takeces
// @updateURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Log.user.js
// @downloadURL	 https://github.com/Takeces/PokeclickerScripts/raw/main/PokeClicker%20Log.user.js
// @match        https://www.pokeclicker.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';



    function init() {
        initContainer();
    }

	/** Route Info */

	function initContainer() {
        let container = document.createElement('div');
        container.setAttribute('id', 'pcLogContainer');
        container.setAttribute('style', 'position: fixed; bottom: 1em; left: 1em;');
        container.setAttribute('class', 'card border-secondary');

        let header = document.createElement('div');
        header.setAttribute('class', 'card-header p-0');
        header.setAttribute('style', 'padding-left: 0.5em !important; padding-right: 0.5em !important;');
        header.setAttribute('data-toggle', 'collapse');
        header.setAttribute('href', '#pcLogBody');
        header.setAttribute('aria-expanded', 'true');
        header.innerHTML = '<span>Log</span>';
        container.appendChild(header);

        let body = document.createElement('div');
        body.setAttribute('id', 'pcLogBody');
        body.setAttribute('class', 'card-body p-1 show');
        container.appendChild(body);

        document.getElementsByTagName('body')[0].appendChild(container);

        // start the info update process
        setInterval(fillContainer, 2000);
	}

    function fillContainer() {
        let body = document.getElementById('pcLogBody');
        body.innerHTML = '';
        let table = document.createElement('table');
        table.setAttribute('class', 'table table-sm m-0');
        let logs = getLastLogs();
        for(let i = 0; i < logs.length; i++) {
            let elem = document.createElement('tr');
            elem.innerHTML = '<td>'+logs[i][0]+'</td><td>'+logs[i][1]+'</td><td>'+logs[i][2]+'</td>';
            table.appendChild(elem);
        }
        body.appendChild(table);

    }

    function getLastLogs() {
        let logs = [];

        if(App.game === undefined) { return logs; }

        for(let i = 0; i < 10; i++) {
            let date = new Date(App.game.logbook.logs()[i].date);
            let log = [
                date.toLocaleString(),
                App.game.logbook.logs()[i].type.label,
                App.game.logbook.logs()[i].content.vars.pokemon
            ];
            logs.push(log);
        }
        return logs;
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

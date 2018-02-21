(() => {
	'use strict';

	const choo = require('choo');
	const html = require('choo/html');

    const devtools = require('choo-devtools');

    const app = choo();
    app.use(init);
    app.route('*', mainView);
    app.mount('#main');


    function getPulledGameServers (state) {
    	return fetch('/game-server-controller/pulledGameServers')
    		.then((response) => response.json())
    		.then((data) => {

    			console.log(data);
    			//state.servers = data;
    		});
    }

    function getAvailableGameServers (state) {
    	return fetch('/game-server-controller/availableServers')
    		.then((response) => response.json())
    		.then((data) => {
    			state.servers = data;
    		});
    }

    function createImage (gameName) {
    	const fetchParams = { 
    		method: 'POST', 
    		body  : JSON.stringify({ 
    			gameName: gameName 
    		}) 
    	};

    	return fetch('/game-server-controller/createImage', fetchParams); 	
    }



    function init (state, emitter) {
    	Promise.all([
			getAvailableGameServers(state),
			getPulledGameServers(state)
		]).then(() => {
			emitter.emit('render');
		});
    }

    function serversView (state, emit) {
    	if (!state.servers) return html`<div>Server Data Loading ...</div>`;

    	const $servers = state.servers.map((server) => {
    		let imageStatus = ''
    		if (server.building) imageStatus = 'Wird geladen ...';
    		return html`<tr>
    			<td onclick=${() => createImageByGameName(server)}>${server.description}</td>
    			<td>${imageStatus}</td>
    		</tr>`
    	});

    	return html`<table>
    		<tr>
    			<th>Beschreibung</th>
    			<th>Image Status</th>
    		</tr>
    		${$servers}
    	</table>`;

    	function createImageByGameName (serverItem) {
    		createImage(serverItem.name).then(() => {
				state.servers = state.servers.map((sItem) => {
					if (sItem.name === serverItem.name) serverItem.building = true;
					return sItem;
				})
				emit('render');
			})
    	}
	}
    
    function mainView (state, emit) {
    	const $servers = serversView(state, emit);
    	return html`<div id="main">
 			${$servers}
    	</div>`;
    }



})();
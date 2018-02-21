(async () => {
	'use strict';

	const util   = require('util');
	const assert = require('assert');
	const path   = require('path');
	const Docker = require('dockerode');

	const dockerParams = { 
		socketPath: '/var/run/docker.sock'
	};
	const dockerClient = new Docker(dockerParams);


	/**
	function listImages() {
		return new Promise((resolve, reject) => {
			dockerClient.listImages((err, list) => {
			 	if (err) reject(err);
			 	else resolve(list);

			 	const gameNames = availableGames.map(() => gameItem.name);

			 	//let game = availableGames.find((gameItem) => gameItem.name === name);
			 	// console.log(list);
			});
		});
	}

	function createGameServer(name = null) {
		assert.ok(name, 'no game server name given');
		let game = availableGames.find((gameItem) => gameItem.name === name);
		assert.ok(game, `given name (${name}) not available`);

		let imageOpts = {
			t: game.name
		};
		let params = {
		  context: path.join(process.cwd(), 'config', 'game-servers', game.name),
		  src    : ['Dockerfile']
		};

		return new Promise((resolve, reject) => {
			dockerClient.buildImage(params, imageOpts, (err, stream) => {
			 	if (err) reject(err);
			 	else {
			 		stream.pipe(process.stdout);
			 		resolve(true);
			 	}
			});
		});
	}

	function runGameServer(name = null) {
	}

	function deleteContainer(containerId) {
		assert.ok(containerId, 'no containerId given');
		return new Promise((resolve, reject) => {
			let container = dockerClient.getContainer(containerId);
			container.remove(function (err, data) {
  				if (err) {
  					if (err.reason !== 'no such container') {
  						return reject(err)
  					} 
  				}

  				resolve(data);
			});
		});
	}

	function createContainer(imageId = null, containerName) {
		assert.ok(imageId, 'no image id given');
		return new Promise(async (resolve, reject) => {
			await deleteContainer(containerName);
			dockerClient.createContainer({
				Image: imageId,
				name : containerName
			}, function (err, container) {
				if (err) reject(err);  	
				resolve(container);
			});
		});
	}


	module.exports = {
		availableServers : availableGames,
		createGameServer : createGameServer,
		pulledGameServers: listImages
	}
	**/


	/**
	let availableImages = await listGameServer();
	let availableGamesExtend = availableGames.map((availableGameItem) => {
		availableGameItem.image = availableImages.find((imageItem) => 
			imageItem.RepoTags.filter((repoTag) => 
				repoTag.search(availableGameItem.name) !== -1
			).length !== -1
		)
		return availableGameItem;
	});

	for (let gameItem of availableGamesExtend) {
		let container = await createContainer(gameItem.image.Id, gameItem.name);
	}
	**/


	//for (let gameItem of availableGames) {
	//	console.log('build: ' + gameItem.name);
	//	await createGameServer(gameItem.name);
	//}


	//const dockerClient = new Docker({socketPath: '/var/run/docker.sock'});
	//dockerClient.listContainers((err, containers) => {
	//	if (err) console.log(err);
	//	else console.log(containers);
	//});

	//dockerClient.buildImage({
	//  context: path.join(process.cwd(), 'config', 'game-servers', 'openra'),
	//  src: ['Dockerfile']
	//}, {t: 'openra'}, function (err, output) {
	// 	console.log(err);
	// 	output.pipe(process.stdout);
	//});


})();
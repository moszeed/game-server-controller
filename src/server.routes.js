(() => {
    'use strict';

    const Controller = require('./controller.js');

    const Routes = {
        'get.pulledGameServers': () => {
            return Controller.pulledGameServers();
        },

        'get.availableServers': () => {
            return Controller.availableServers;
        },


        'post.createImage': (req) => {
            const params = Object.assign(req.params, JSON.parse(req.body));
            return Controller.createGameServer(params.gameName);
        }
    };

    exports.handle = function (server) {
        Object.keys(Routes).forEach(key => {
            let splittedKey = key.split('.');
            let requestMethod = splittedKey.shift();
            let route = splittedKey.join('/');

            server[requestMethod]('/game-server-controller/' + route, async (req, res, next) => {
                try {
                    let routeResponse = await Routes[key](req);
                    if (routeResponse === true) {
                        routeResponse = {
                            result: true
                        };
                    }
                    res.send(routeResponse);
                    res.end();
                    next();
                } catch (err) {
                    console.log('error on route:', route);
                    console.log(err);
                    res.send(400, err.message);
                    res.end();
                    next();
                }
            });
        });
    };
})();

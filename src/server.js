(() => {
    'use strict';

    const restify = require('restify');
    const corsMiddleware = require('restify-cors-middleware');

    const Routes = require('./server.routes.js');
    const RoutesStatic = require('./server.static.routes.js');

    const server  = restify.createServer({
        name: 'game-server-controller'
    });

    const cors = corsMiddleware({
        origins: [
            'http://localhost*', 'https://localhost*',
            'http://mosiworkstation*', 'https://mosiworkstation*',
            'http://*.oberon.test', 'https://*.oberon.test',
            'http://*.car-copy.com', 'https://*.car-copy.com',
            'http://www.car-copy.com', 'https://www.car-copy.com'
        ],
        allowHeaders: [
            'Accept',
            'Accept-Version',
            'Content-Type',
            'Api-Version',
            'Origin',
            'X-Requested-With',
            'Authorization'
        ]
    });

    // add needed middleware
    server.pre(cors.preflight);
    server.use(cors.actual);
    server.use(restify.plugins.queryParser({ mapParams: true }));
    server.use(restify.plugins.bodyParser({ mapParams: true }));
    server.use(restify.plugins.gzipResponse());

    Routes.handle(server);
    RoutesStatic.handle(server);

    server.listen(8686, function () {
        console.log('game controller server started on Port 8686');
    });
})();

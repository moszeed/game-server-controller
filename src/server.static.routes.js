(function () {
    'use strict';
    const path = require('path');
    const restify = require('restify');
    const crypto = require('crypto');

    const projectConf = require(path.join(process.cwd(), 'package.json'));

    const staticParams = {
        directory: './dist',
        maxAge   : 28800,
        default  : 'index.html'
    };

    // static routes
    // long live the hack
    const handleStatic = function (req, res, next) {
        req.url = req.url.substr('/game-server-controller'.length);
        req.path = function () {
            return req.url;
        };

        res.charSet('utf-8');
        const serve = restify.plugins.serveStatic(staticParams);
        serve(req, res, next);
    };

    // set the ETag
    const setETag = function (req, res, next) {
        // create a md5 version of the version
        const md5VersionHash = crypto
            .createHash('md5')
            .update(projectConf.version)
            .digest('hex');

        res.setHeader('ETag', md5VersionHash);
        return next();
    };

    // define static routes
    const staticRoutes = [
        '/game-server-controller/js/:filename',
        '/game-server-controller/:filename'
    ];

    exports.handle = function (server) {
        // set static routes
        for (let staticRoute of staticRoutes) {
            server.get(
                staticRoute,
                setETag,
                restify.plugins.conditionalRequest(),
                handleStatic
            );
        }
    };
})();

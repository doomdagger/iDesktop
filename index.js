var express     = require('express'),
    bodyParser  = require('body-parser'),
    cookieParser = require('cookie-parser'),
    compress    = require('compression'),
    errorhandler = require('errorhandler'),
    logger      = require('morgan'),
    methodOverride = require('method-override'),
    session     = require('express-session'),
    redis       = require('redis'),
    RedisStore  = require('connect-redis')(session),
    favicon     = require('serve-favicon'),
    path        = require('path'),
    slashes     = require('connect-slashes'),
    when        = require('when'),
    semver      = require('semver'),
    _           = require('loDash'),
    packageInfo = require('./package.json'),
    colors      = require('colors'),

    ONE_HOUR_S  = 60 * 60,
    ONE_YEAR_S  = 365 * 24 * ONE_HOUR_S,
    ONE_HOUR_MS = ONE_HOUR_S * 1000,
    ONE_YEAR_MS = 365 * 24 * ONE_HOUR_MS,

    url = 'http://idesktop.com',
    host = '0.0.0.0',
    port = '1222';


process.env.NODE_ENV = 'development';

if (process.env.NODE_ENV === 'development') {
    require('when/monitor/console');
}


function iDesktopStartMessages() {
    // Tell users if their node version is not supported, and exit
    if (!semver.satisfies(process.versions.node, packageInfo.engines.node)) {
        console.log(
            "\nERROR: Unsupported version of Node".red,
            "\niDesktop needs Node version".red,
            packageInfo.engines.node.yellow,
            "you are using version".red,
            process.versions.node.yellow,
            "\nPlease go to http://nodejs.org to get a supported version".green
        );

        process.exit(0);
    }

    // Startup & Shutdown messages
    if (process.env.NODE_ENV === 'production') {
        console.log(
            "iDesktop is running...".green,
            "\nYour site is now available on",
            url,
            "\nCtrl+C to shut down".grey
        );

        // ensure that Ghost exits correctly on Ctrl+C
        process.removeAllListeners('SIGINT').on('SIGINT', function () {
            console.log(
                "\niDesktop has shut down".red,
                "\nYour site is now offline"
            );
            process.exit(0);
        });
    } else {
        console.log(
            ("iDesktop is running in " + process.env.NODE_ENV + "...").green,
            "\nListening on",
                host.yellow + ':' + port.yellow,
            "\nUrl configured as:",
            url,
            "\nCtrl+C to shut down".grey
        );
        // ensure that Ghost exits correctly on Ctrl+C
        process.removeAllListeners('SIGINT').on('SIGINT', function () {
            console.log(
                "\niDesktop has shutdown".red,
                "\niDesktop was running for",
                Math.round(process.uptime()),
                "seconds"
            );
            process.exit(0);
        });
    }
}


(function () {

    var expressServer = express(),
        httpServer,
        cookie,
        deferred = when.defer();


    express['static'].mime.define({'application/font-woff': ['woff']});

    expressServer.use(compress());

    expressServer.use(methodOverride('_method'));


    // Make sure 'req.secure' is valid for proxied requests
    // (X-Forwarded-Proto header will be checked, if present)
    expressServer.enable('trust proxy');

    expressServer.use(logger('dev'));

    expressServer.use(errorhandler());

    // Favicon
    expressServer.use("/", favicon(__dirname + '/client/resources/images/favicon.ico'));

    // Static assets
    expressServer.use('/', express['static'](__dirname + '/client', {maxAge: ONE_YEAR_MS}));

    // Add in all trailing slashes, add this middleware after the static middleware
    expressServer.use(slashes(true, {headers: {'Cache-Control': 'public, max-age=' + ONE_YEAR_S}}));

    // Body parsing
    expressServer.use(bodyParser.json());
    expressServer.use(bodyParser.urlencoded());

    // ### Sessions
    // we need the trailing slash in the cookie path. Session handling *must* be after the slash handling
    cookie = {
        path: '/',
        maxAge: 12 * ONE_HOUR_MS
    };


    expressServer.use(cookieParser('i love u'));
    expressServer.use(session({
        store: new RedisStore({
            client: redis.createClient()
        }), // redis store
        proxy: true,
        secret: 'i love u',
        cookie: cookie
    }));


    httpServer = expressServer.listen(
        port,
        host
    );

    httpServer.on('listening', function () {
        iDesktopStartMessages();
        deferred.resolve(httpServer);
    });


    return deferred.promise;

})();
var path           = require('path'),
    colors         = require('colors'),

    fs             = require('fs'),
    _              = require('lodash');


// ## Grunt configuration

configureGrunt = function (grunt) {

    // *This is not useful but required for jshint*
    colors.setTheme({silly: 'rainbow'});

    // #### Load all grunt tasks
    // 加载任务，通过匹配加载
    // Find all of the task which start with `grunt-` and load them, rather than explicitly declaring them all
    require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);


    var cfg = {

        // Standard build type, for when we have nightlies again.
        buildType: 'Build',
        // Load package.json so that we can create correctly versioned releases.
        pkg: grunt.file.readJSON('package.json'),

        // ### grunt-contrib-watch
        // See the [grunt dev](#live%20reload) task for how this is used.
        watch: {
            livereload: {
                files: [
                    'app.js',
                    'app/**/*.js'
                ],
                options: {
                    livereload: true
                }
            },
            express: {
                files:  ['index.js'],
                tasks:  ['express:dev'],
                options: {
                    // **Note:** Without this option specified express won't be reloaded
                    nospawn: true
                }
            }
        },

        // ### grunt-express-server
        // Start a iCollege expess server for use in development and testing
        express: {
            options: {
                script: 'index.js',
                output: 'iDesktop is running'
            },

            dev: {
                options: {
                    node_env: 'development'
                }
            },
            test: {
                options: {
                    node_env: 'testing'
                }
            }
        },

        // ### grunt-contrib-jshint
        // Linting rules, run as part of `grunt validate`. See [grunt validate](#validate) and its subtasks for
        // more information.
        jshint: {
            // Linting rules for server side or shared javascript code
            server: {
                options: {
                    jshintrc: '.jshintrc'
                },
                files: {
                    src: [
                        '*.js',
                        'core/*.js',
                        'core/server/**/*.js',
                        'core/shared/**/*.js',
                        '!core/shared/vendor/**/*.js',
                        '!core/shared/lib/**/*.js'
                    ]
                }
            },
            // Linting rules for client side javascript code
            client: {
                options: {
                    jshintrc: 'core/client/.jshintrc'
                },
                files: {
                    src: [
                        'core/client/*.js',
                        'core/client/**/*.js',
                        '!core/client/.sencha/**/*.js',
                        '!core/client/build/**/*.js',
                        '!core/client/touch/*.js',
                        '!core/client/touch/**/*.js'
                    ]
                }
            }
        },

        // ### grunt-mocha-cli
        // Configuration for the mocha test runner, used to run unit, integration and route tests as part of
        // `grunt validate`. See [grunt validate](#validate) and its sub tasks for more information.
        mochacli: {
            options: {
                ui: 'bdd',
                reporter: 'spec',
                timeout: '15000'
            },

            // #### All Unit tests
            unit: {
                src: ['core/test/unit/**/*_spec.js']
            },

            // ##### Groups of unit tests
            server: {
                src: ['core/test/unit/**/server*_spec.js']
            },

            perm: {
                src: ['core/test/unit/**/permissions_spec.js']
            },

            migrate: {
                src: [
                    'core/test/unit/**/export_spec.js',
                    'core/test/unit/**/import_spec.js'
                ]
            },

            storage: {
                src: ['core/test/unit/**/storage*_spec.js']
            },

            // #### All Integration tests
            integration: {
                src: [
                    'core/test/integration/**/model*_spec.js',
                    'core/test/integration/**/api*_spec.js',
                    'core/test/integration/*_spec.js'
                ]
            },

            // ##### Model integration tests
            model: {
                src: ['core/test/integration/**/model*_spec.js']
            },

            // ##### API integration tests
            api: {
                src: ['core/test/integration/**/api*_spec.js']
            },

            // #### All Route tests
            routes: {
                src: ['core/test/functional/routes/**/*_test.js']
            }
        },


        // ### grunt-shell
        // Command line tools where it's easier to run a command directly than configure a grunt plugin
        shell: {
            prepare_touch: {
                command: "git clone http://git.candylee.cn/doomdagger/touch.git ./core/client/touch",
                options: {
                    stdout: true
                }
            },
            // #### Run Sencha Touch Build
            // See the `grunt init`. See the section on [Building Assets](#building%20assets) for more
            touch: {
                command: [
                    'cd ./core/client/',
                    'sencha app build'
                ].join('&&'),
                options: {
                    stdout: true
                }
            },
            // #### Run bower install
            // Used as part of `grunt init`. See the section on [Building Assets](#building%20assets) for more
            // information.
            bower: {
                command: path.resolve(__dirname.replace(' ', '\\ ') + '/node_modules/.bin/bower install'),
                options: {
                    stdout: true
                }
            },
            // #### Generate coverage report
            // See the `grunt test-coverage` task in the section on [Testing](#testing) for more information.
            coverage: {
                command: function () {
                    // **Note:** will only work on windows if mocha is globally installed
                    var cmd = !!process.platform.match(/^win/) ? 'mocha' : './node_modules/mocha/bin/mocha';
                    return cmd +
                        ' --timeout 15000 --reporter html-cov > coverage.html ./core/test/blanket_coverage.js';
                },
                execOptions: {
                    env: 'NODE_ENV=' + process.env.NODE_ENV
                }
            }
        },


        // ### grunt-docker
        // Generate documentation from code
        docker: {
            docs: {
                dest: 'docs',
                src: ['.'],
                options: {
                    onlyUpdated: true,
                    exclude: 'node_modules,.git,.tmp,bower_components,content,*built,*test,*doc*,*vendor,' +
                        'config.js,coverage.html,.travis.yml,*.min.css,screen.css,*touch*,*resources*,*.sencha*',
                    extras: ['fileSearch']
                }
            }
        },

        // ### grunt-contrib-clean
        // Clean up files as part of other tasks
        clean: {
            built: {
                src: ['core/built/**']
            },
            release: {
                src: ['<%= paths.releaseBuild %>/**']
            },
            test: {
                src: ['content/data/iCollege-test.db']
            },
            tmp: {
                src: ['.tmp/**']
            }
        },

        // ### grunt-contrib-copy
        // Copy files into their correct locations as part of building assets, or creating release zips
        copy: {
            release: {
                files: [{
                    cwd: 'core/client/build/production/ICollege/',
                    src: ['**'],
                    dest: '<%= paths.releaseBuild %>/core/client/',
                    expand: true
                }, {
                    expand: true,
                    src: buildGlob,
                    dest: '<%= paths.releaseBuild %>/'
                }]
            }
        },

        // ### grunt-contrib-compress
        // Zip up files for builds / releases
        compress: {
            release: {
                options: {
                    archive: '<%= paths.releaseDist %>/iCollege-<%= pkg.version %>.zip'
                },
                expand: true,
                cwd: '<%= paths.releaseBuild %>/',
                src: ['**']
            }
        },

        // ### grunt-contrib-concat
        // concatenate multiple JS files into a single file ready for use
        concat: {
            dev: {
                files: {
                    'core/built/scripts/vendor.js': [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/lodash/dist/lodash.underscore.js',
                        'bower_components/moment/moment.js',
                        'bower_components/validator-js/validator.js',
                        'bower_components/Countable/Countable.js',
                        'bower_components/fastclick/lib/fastclick.js'
                    ]
                }
            }
        },

        // ### grunt-contrib-uglify
        // Minify concatenated javascript files ready for production
        uglify: {
            prod: {
                files: {
                    'core/built/scripts/vendor.min.js': 'core/built/scripts/vendor.js'
                }
            }
        },

        // ### grunt-update-submodules
        // Grunt task to update git submodules
        "update_submodules": {
            default: {
                options: {
                    params: false // blanks command-line parameters
                }
            }
        }


    };


    // Load the configuration
    // 加载任务配置
    grunt.initConfig(cfg);

    // ## Utilities
    //
    // ### Spawn Casper.js
    // Custom test runner for our Casper.js functional tests
    // This really ought to be refactored into a separate grunt task module
    grunt.registerTask('spawnCasperJS', function (target) {

        target = _.contains(['client'], target) ? target + '/' : undefined;

        var done = this.async(),
            options = ['host', 'noPort', 'port'],
            args = ['test']
                .concat(grunt.option('target') || target || ['client/'])
                .concat(['--includes=base.js', '--log-level=debug', '--port=1222']);

        // Forward parameters from grunt to casperjs
        _.each(options, function processOption(option) {
            if (grunt.option(option)) {
                args.push('--' + option + '=' + grunt.option(option));
            }
        });

        if (grunt.option('fail-fast')) {
            args.push('--fail-fast');
        }

        // Show concise logs in Travis as ours are getting too long
        if (grunt.option('concise')) {
            args.push('--concise');
        } else {
            args.push('--verbose');
        }

        grunt.util.spawn({
            cmd: 'casperjs',
            args: args,
            opts: {
                cwd: path.resolve('core/test/functional'),
                stdio: 'inherit'
            }
        }, function (error, result/*, code*/) {
            /*jshint unused:false*/
            if (error) {
                grunt.fail.fatal(result.stdout);
            }
            grunt.log.writeln(result.stdout);
            done();
        });
    });

    // # Custom Tasks

    // iCollege has a number of useful tasks that we use every day in development. Tasks marked as *Utility* are used
    // by grunt to perform current actions, but isn't useful to developers.
    //
    // Skip ahead to the section on:
    //
    // * [Building assets](#building%20assets):
    //     `grunt init`, `grunt` & `grunt prod` or live reload with `grunt dev`
    // * [Testing](#testing):
    //     `grunt validate`, the `grunt test-*` sub-tasks or generate a coverage report with `grunt test-coverage`.

    // ### Help
    // Run `grunt help` on the commandline to get a print out of the available tasks and details of
    // what each one does along with any available options. This is an alias for `grunt --help`
    grunt.registerTask('help',
        'Outputs help information if you type `grunt help` instead of `grunt --help`',
        function () {
            console.log('Type ' + '`grunt --help`'.yellow + ' to get the details of available grunt tasks,\n' +
                'or alternatively visit ' + 'https://github.com/TryGhost/iCollege/wiki/Grunt-Toolkit'.yellow);
        });

    // ### Documentation
    // Run `grunt docs` to generate annotated source code using the documentation described in the code comments.
    grunt.registerTask('docs', 'Generate Docs', ['docker']);


    // ## Testing

    // iCollege has an extensive set of test suites. The following section documents the various types of tests
    // and how to run them.
    //
    // TLDR; run `grunt validate`

    // #### Set Test Env *(Utility Task)*
    // Set the NODE_ENV to 'testing' unless the environment is already set to TRAVIS.
    // This ensures that the tests get run under the correct environment, using the correct database, and
    // that they work as expected. Trying to run tests with no ENV set will throw an error to do with `client`.
    grunt.registerTask('setTestEnv',
        'Use "testing" iCollege config',
        function () {
            process.env.NODE_ENV = 'testing';
            cfg.express.test.options.node_env = process.env.NODE_ENV;
        });

    // #### Load Config *(Utility Task)*
    // Make sure that we have a `config.js` file when running tests
    // iCollege requires a `config.js` file to specify the database settings etc. iCollege comes with an example file:
    // `config.example.js` which is copied and renamed to `config.js` by the bootstrap process
    grunt.registerTask('loadConfig', function () {
        var done = this.async();
        bootstrap(
            // give me your config.js path
            path.resolve(__dirname, 'config.js')
        ).then(function () {
                done();
            }).catch(function (err) {
                grunt.fail.fatal(err.stack);
            });
    });

    // ### Validate
    // **Main testing task**
    //
    // `grunt validate` will lint and test your local iCollege codebase.
    //
    // `grunt validate` is one of the most important and useful grunt tasks that we have available to use. It
    // manages the setup and running of jshint as well as the 4 test suites. See the individual sub tasks below
    // for details of each of the test suites.
    //
    // `grunt validate` is called by `npm test`.
    grunt.registerTask('validate', 'Run tests and lint code',
        ['jshint', 'test-routes', 'test-unit', 'test-integration', 'test-functional']);

    // ### Unit Tests *(sub task)*
    // `grunt test-unit` will run just the unit tests
    //
    // Provided you already have a `config.js` file, you can run individual sections from
    // [mochacli](#grunt-mocha-cli) by running:
    //
    // `NODE_ENV=testing grunt mochacli:section`
    //
    // If you need to run an individual unit test file, you can do so, providing you have mocha installed globally by
    // using a command in the form:
    //
    // `NODE_ENV=testing mocha --timeout=15000 --ui=bdd --reporter=spec core/test/unit/config_spec.js`
    //
    // Unit tests are run with [mocha](http://visionmedia.github.io/mocha/) using
    // [should](https://github.com/visionmedia/should.js) to describe the tests in a highly readable style.
    // Unit tests do **not** touch the database.
    // A coverage report can be generated for these tests using the `grunt test-coverage` task.
    grunt.registerTask('test-unit', 'Run unit tests (mocha)',
        ['clean:test', 'setTestEnv', 'loadConfig', 'mochacli:unit']);

    // ### Integration tests *(sub task)*
    // `grunt test-integration` will run just the integration tests
    //
    // Provided you already have a `config.js` file, you can run just the model integration tests by running:
    //
    // `NODE_ENV=testing grunt mochacli:model`
    //
    // Or just the api integration tests by running:
    //
    // `NODE_ENV=testing grunt mochacli:api`
    //
    // Integration tests are run with [mocha](http://visionmedia.github.io/mocha/) using
    // [should](https://github.com/visionmedia/should.js) to describe the tests in a highly readable style.
    // Integration tests are different to the unit tests because they make requests to the database.
    //
    // Their purpose is to test that both the api and models behave as expected when the database layer is involved.
    // These tests are run against sqlite3, mysql and pg on travis and ensure that differences between the databases
    // don't cause bugs. At present, pg often fails and is not officially supported.
    //
    // A coverage report can be generated for these tests using the `grunt test-coverage` task.
    grunt.registerTask('test-integration', 'Run integration tests (mocha + db access)',
        ['clean:test', 'setTestEnv', 'loadConfig', 'mochacli:integration']);

    // ### Route tests *(sub task)*
    // `grunt test-routes` will run just the route tests
    //
    // If you need to run an individual route test file, you can do so, providing you have a `config.js` file and
    // mocha installed globally by using a command in the form:
    //
    // `NODE_ENV=testing mocha --timeout=15000 --ui=bdd --reporter=spec core/test/functional/routes/admin_test.js`
    //
    // Route tests are run with [mocha](http://visionmedia.github.io/mocha/) using
    // [should](https://github.com/visionmedia/should.js) and [supertest](https://github.com/visionmedia/supertest)
    // to describe and create the tests.
    //
    // Supertest enables us to describe requests that we want to make, and also describe the response we expect to
    // receive back. It works directly with express, so we don't have to run a server to run the tests.
    //
    // The purpose of the route tests is to ensure that all of the routes (pages, and API requests) in iCollege
    // are working as expected, including checking the headers and status codes received. It is very easy and
    // quick to test many permutations of routes / urls in the system.
    grunt.registerTask('test-routes', 'Run functional route tests (mocha)',
        ['clean:test', 'setTestEnv', 'loadConfig', 'mochacli:routes']);

    // ### Functional tests *(sub task)*
    //
    // `grunt test-functional` will run just the functional tests
    //
    // You can use the `--target` argument to run any individual test file, or the admin or frontend tests:
    //
    // `grunt test-functional --target=admin/editor_test.js` - run just the editor tests
    //
    // `grunt test-functional --target=admin/` - run all of the tests in the admin directory
    //
    // Functional tests are run with [phantom.js](http://phantomjs.org/) and defined using the testing api from
    // [casper.js](http://docs.casperjs.org/en/latest/testing.html).
    //
    // An express server is started with the testing environment set, and then a headless phantom.js browser is
    // used to make requests to that server. The Casper.js API then allows us to describe the elements and
    // interactions we expect to appear on the page.
    //
    // The purpose of the functional tests is to ensure that Ghost is working as is expected from a user perspective
    // including buttons and other important interactions in the admin UI.
    grunt.registerTask('test-functional', 'Run functional interface tests (CasperJS)',
        ['clean:test', 'setTestEnv', 'loadConfig', 'express:test', 'spawnCasperJS', 'express:test:stop']
    );

    // ### Coverage
    // `grunt test-coverage` will generate a report for the Unit and Integration Tests.
    //
    // This is not currently done as part of CI or any build, but is a tool we have available to keep an eye on how
    // well the unit and integration tests are covering the code base.
    // iCollege does not have a minimum coverage level - we're more interested in ensuring important and useful areas
    // of the codebase are covered, than that the whole codebase is covered to a particular level.
    //
    // Key areas for coverage are: helpers and theme elements, apps / GDK, the api and model layers.
    grunt.registerTask('test-coverage', 'Generate unit and integration (mocha) tests coverage report',
        ['clean:test', 'setTestEnv', 'loadConfig', 'shell:coverage']);


    // ## Building assets
    //
    // Ghost's GitHub repository contains the un-built source code for Ghost. If you're looking for the already
    // built release zips, you can get these from the [release page](https://github.com/TryGhost/Ghost/releases) on
    // GitHub or from https://ghost.org/download. These zip files are created using the [grunt release](#release)
    // task.
    //
    // If you want to work on Ghost core, or you want to use the source files from GitHub, then you have to build
    // the Ghost assets in order to make them work.
    //
    // There are a number of grunt tasks available to help with this. Firstly after fetching an updated version of
    // the Ghost codebase, after running `npm install`, you will need to run [grunt init](#init%20assets).
    //
    // For production blogs you will need to run [grunt prod](#production%20assets).
    //
    // For updating assets during development, the tasks [grunt](#default%20asset%20build) and
    // [grunt dev](#live%20reload) are available.
    //

    // ### Init assets
    // `grunt init` - will run an initial asset build for you
    //
    // Grunt init runs `bower install` as well as the standard asset build tasks which occur when you run just
    // `grunt`. This fetches the latest client side dependencies, and moves them into their proper homes.
    //
    // This task is very important, and should always be run and when fetching down an updated code base just after
    // running `npm install`.
    //
    // `bower` does have some quirks, such as not running as root. If you have problems please try running
    // `grunt init --verbose` to see if there are any errors.
    grunt.registerTask('init', 'Prepare the project for development',
        ['shell:bower', 'update_submodules', 'shell:prepare_touch', 'default']);

    // ### Default asset build
    // `grunt` - default grunt task
    //
    // Compiles handlebars templates, concatenates javascript files for the admin UI into a handful of files instead
    // of many files, and makes sure the bower dependencies are in the right place.
    grunt.registerTask('default', 'Build JS & templates for development',
        ['concat']);


    // ### Live reload
    // `grunt dev` - build assets on the fly whilst developing
    //
    // If you want iCollege to live reload for you whilst you're developing, you can do this by running `grunt dev`.
    // This works hand-in-hand with the [livereload](http://livereload.com/) chrome extension.
    //
    // `grunt dev` manages starting an express server and restarting the server whenever core files change (which
    // require a server restart for the changes to take effect) and also manage reloading the browser whenever
    // frontend code changes.
    //
    // Note that the current implementation of watch only works with casper, not other themes.
    grunt.registerTask('dev', 'Dev Mode; watch files and restart server on changes',
        ['default', 'express:dev', 'watch']);


};

// Export the configuration
module.exports = configureGrunt;

/*
 *
*/

global.mode = '';

global.PORT = 10081;

//

var argparse = require('argparse');
var parser = new argparse.ArgumentParser();

parser.addArgument(['--debug'], {
    action: 'storeTrue',
    defaultValue: false
});


parser.addArgument(['--local'], {
    action: 'storeTrue',
    defaultValue: false
});

var args = parser.parseArgs();

if ( args.debug ) {

    global.mode = 'DEBUG';

}

if ( args.local ) {

    global.mode = 'LOCAL';

}

// setup DB

require('./db/MySqlDB');

// import core objects for API

global.api = {
    tree:       require('./core/Tree'),
    node:       require('./core/Node'),
    uploader:   require('./core/Uploader'),
    user:       require('./core/User'),
    settings: 	require('./core/Settings')
};

global.Utils = require('./Utils');

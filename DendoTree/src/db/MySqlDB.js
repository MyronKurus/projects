/*
 * DB settings
*/

global.mysql      = require('mysql');

var dbConfig;

if ( mode === 'DEBUG' ) {

    dbConfig = {
        // host     : '127.0.0.1',
        host     : 'nwgstudios.com',
        user     : 'dendotree',
        password : 'pa$$word',
        database : 'dendotree',
        port     : 3306
    };

} else if ( mode === 'LOCAL' ) {

    dbConfig = {
        host     : 'localhost',
        user     : 'root',
        password : 'aloha63aa0',
        database : 'dendotree',
        port     : 3306
    };

} else {

    dbConfig = {
        host     : 'localhost',
        user     : 'beta3',
        password : '8CPc6FXr54wnTSyG',
        database : 'beta3',
        port     : 3306
    };

}

global.connection = false;

function handleDisconnect () {

    connection = mysql.createConnection( dbConfig );   // Recreate the connection, since
                                                    // the old one cannot be reused.

    connection.connect( function ( err ) {                  // The server is either down

        if ( err ) {                                     // or restarting (takes a while sometimes).

            console.log( 'error when connecting to [' + dbConfig.host + '] db:', err );

            setTimeout( handleDisconnect, 2000 ); // We introduce a delay before attempting to reconnect,

            return;

        }                                       // to avoid a hot loop, and to allow our node script to

        console.log( 'Connected to db!' );

    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.

    connection.on( 'error', function ( err ) {

        console.log( 'db error:', err );

        if ( err.code === 'PROTOCOL_CONNECTION_LOST' ) {    // Connection to the MySQL server is usually

            handleDisconnect();                             // lost due to either server restart, or a

        } else {                                            // connnection idle timeout (the wait_timeout

            throw err;                                      // server variable configures this)

        }

    });

};

handleDisconnect();

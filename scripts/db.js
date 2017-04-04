var mongoose = require('mongoose'),
    defaultDb;

function loadModels() {
    require('./models').load(defaultDb);
}

/**
 * Creates a new connection to the Mongo DB.
 *
 */
function init(host, db, callback) {
    /*jshint camelcase:false */

    defaultDb = mongoose.createConnection(host, db);
    defaultDb.on('error', function mongodbErrorHandler(error) {
        throw new Error(error);
    });

    loadModels();

    callback(null);
}
exports.init = init;
exports.db = defaultDb;
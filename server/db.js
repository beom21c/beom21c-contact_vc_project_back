const mysql = require('mysql');
const config = require('./config/dbconfig');
const logger = require('./logger');

const pool = mysql.createPool(config);
logger.info('Connection pool created.');

pool.on('enqueue', function () {
    logger.info('Waiting for available connection slot1');
});

const query = function (sql, values, callback) {
    pool.query(sql, values, callback);
};

module.exports.query = query;
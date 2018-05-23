const mongoose = require('mongoose');
const debug = require('debug')('app:mongo');
const config = require('../config');

class MongoConnectionService {
  constructor(connectionString) {
    this.connectionString = connectionString;
    // Mongoose: mpromise (mongoose's default promise library) is deprecated,
    // plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
    // https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/mongoose#promises
    (mongoose).Promise = global.Promise;
    this.connection = mongoose.createConnection(connectionString, {
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      bufferMaxEntries: 0,
    });
    this._setupTriggers(this.connection);
    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', this._gracefulExit(this.connection))
      .on('SIGTERM', this._gracefulExit(this.connection));
  }
  getConnection() {
    return this.connection;
  }
  _setupTriggers(connection) {
    connection
      .once('open', () => {
        debug(`mongodb connection created to ${this.connectionString}`);
      })
      .on('disconnected', () => {
        debug('mongodb disconnected');
      })
      .on('reconnect', () => {
        debug('mongodb reconnected');
      })
      .on('error', (error) => {
        debug(`Warning: ${error}`);
      });
  }

  _gracefulExit(connection) {
    return () => connection.close(() => {
      debug(`Mongoose connection :${this.connectionString} is disconnected through app termination`);
      process.exit(0);
    });
  }
}

module.exports = {
  MongoConnectionService,
  mongoConnectionService: new MongoConnectionService(config.MONGO_CONNECTION_STRING)
};

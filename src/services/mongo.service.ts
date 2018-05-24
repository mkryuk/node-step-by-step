import * as debug from 'debug';
import * as mongoose from 'mongoose';
import { config } from '../config';

export class MongoConnectionService {
  public readonly connection: mongoose.Connection;
  constructor(private connectionString: string, private _debug: debug.IDebugger) {
    // Mongoose: mpromise (mongoose's default promise library) is deprecated,
    // plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
    // https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/mongoose#promises
    (mongoose as any).Promise = global.Promise;
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

  public getConnection() {
    return this.connection;
  }

  private _setupTriggers(connection: mongoose.Connection) {
    connection
      .once('open', () => {
        this._debug(`mongodb connection created to ${this.connectionString}`);
      })
      .on('disconnected', () => {
        this._debug('mongodb disconnected');
      })
      .on('reconnect', () => {
        this._debug('mongodb reconnected');
      })
      .on('error', (error) => {
        this._debug(`Warning: ${error}`);
      });
  }

  private _gracefulExit(connection: mongoose.Connection) {
    return () => connection.close(() => {
      this._debug(`Mongoose connection :${this.connectionString} is disconnected through app termination`);
      process.exit(0);
    });
  }
}

export const mongoConnectionService = new MongoConnectionService(config.MONGO_CONNECTION_STRING, debug('app:mongo'));

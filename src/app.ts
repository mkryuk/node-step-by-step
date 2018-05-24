import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as createError from 'http-errors';
import * as logger from 'morgan';
import * as path from 'path';

import { authMiddlware } from './middlewares/auth.middleware';
import { apiRouter } from './routes/api.router';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false,
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

/**
 * Add static
 */
app.use(express.static(path.join(__dirname, '../public')));

/**
 * Add passport
 */
app.use(authMiddlware.passportMiddleware);

/**
 * Api router
 */
app.use('/api', apiRouter);

/**
 * Catch 404 and forward to error handler
 */
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  next(createError(404));
});

/**
 * Error handler
 */
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({
    error,
    message: err.message,
  });
});

export { app };

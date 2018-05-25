import { InversifyExpressServer } from 'inversify-express-utils';
import { iocContainer } from './ioc/ioc.config';

/**
 * Create Inversify Express Server.
 */
const server = new InversifyExpressServer(iocContainer, null, { rootPath: '/api' });

export { server };

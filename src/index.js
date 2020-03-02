import Express, { json, Router } from 'express';
import morgan from 'morgan';
import config from 'config';
import { jwtTokensHandler, errorsHandler } from './middlewares';
import { login, thumbnails, jsonpatch } from './routes';

const protectedRoutes = Router();
protectedRoutes.use(jwtTokensHandler);
protectedRoutes.use('/thumbnails', thumbnails);
protectedRoutes.use('/jsonpatch', jsonpatch);

const app = Express();
const port = config.get('PORT');
app.use(json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('tiny'));
}
app.use(errorsHandler);
app.use('/login', login);
app.use('/images', Express.static(config.get('IMAGE_DIR')));
app.use('/', protectedRoutes);

export default app.listen(port);

import Express, { json, Router } from 'express';
import dotenv from 'dotenv';
import { jwtTokensHandler, errorsHandler } from './middlewares';
import { login, thumbnails, jsonpatch } from './routes';

dotenv.config();

const protectedRoutes = Router();
protectedRoutes.use(jwtTokensHandler);
protectedRoutes.use('/thumbnails', thumbnails);
protectedRoutes.use('/jsonpatch', jsonpatch);

const app = Express();
const port = 3000;
app.use(json());
app.use(errorsHandler);
app.use('/login', login);
app.use('/images', Express.static(process.env.IMAGE_DIR));
app.use('/', protectedRoutes);

app.listen(port, () => console.log('Application is running ...'));

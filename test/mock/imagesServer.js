import Express from 'express';
import path from 'path';

const imageServer = Express();
imageServer.use(Express.static(path.join(__dirname, 'images')));

export default imageServer;

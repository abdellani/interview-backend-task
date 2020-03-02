import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import Jimp from 'jimp/es';
import config from 'config';
import {
  ImageResizingException,
  FileWritingException,
} from '../utilities/Exceptions';

const route = Router();
const postHandler = (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: 'url is required !' });
  }
  const fileName = uuidv4();
  const filePath = path.join(config.get('IMAGE_DIR'), fileName);
  return Jimp.read(url)
    .then((image) => {
      try {
        return image.resize(50, 50);
      } catch (error) {
        throw new ImageResizingException("Image can't be resized");
      }
    })
    .then((image) => {
      try {
        image.write(filePath);
      } catch (error) {
        throw new FileWritingException("Image can't be saved !");
      }
      return res.json({ path: `/images/${fileName}` });
    })
    .catch((err) => {
      if (err instanceof ImageResizingException) {
        const { message } = err;
        return res.status(500).json({ message });
      }
      if (err instanceof FileWritingException) {
        return res.status(500).json({});
      }
      return res
        .status(500)
        .json({ message: 'A problem occured while downloading image' });
    });
};
route.post('/', postHandler);
export { postHandler };
export default route;

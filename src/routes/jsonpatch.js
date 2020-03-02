import { Router } from 'express';
import jsonpatch from 'jsonpatch';

const route = Router();
const postHandler = (req, res) => {
  const { doc, patch } = req.body;
  try {
    const patchedDoc = jsonpatch.apply_patch(doc, patch);
    res.json(patchedDoc);
  } catch (error) {
    res.status(400).json({});
  }
};
route.post('/', postHandler);

export { postHandler };
export default route;

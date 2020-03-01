import { Router } from 'express';
import jsonpatch from 'jsonpatch';

const route = Router();
route.post('/', (req, res) => {
  const { doc, patch } = req.body;
  try {
    const patchedDoc = jsonpatch.apply_patch(doc, patch);
    res.json(patchedDoc);
  } catch (error) {
    res.status(400).json();
  }
});
export default route;

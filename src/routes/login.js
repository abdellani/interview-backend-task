import { Router } from 'express';
import { checkCredentials, generateJwtToken } from '../utilities';

const route = Router();

route.post('/', (req, res) => {
  const { username, password } = req.body;
  const result = checkCredentials(username, password);

  if (result) {
    const { id } = result;
    const token = generateJwtToken({
      payload: { id },
    });
    res.append('Authorization', `Bearer ${token}`).json({});
  } else {
    res.status(401).json({
      code: 401,
      error: 'Invalid username/password',
    });
  }
});
export default route;

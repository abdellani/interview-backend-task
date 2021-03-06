import {
  decryptJwtToken,
  isAutherizationHeaderPatternValid,
  isValidUserID,
} from '../utilities';

const jwtTokensHandler = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res
      .status(401)
      .json({ status: 401, message: 'Authorization header is required!' });
  }
  if (!isAutherizationHeaderPatternValid(authorization)) {
    return res
      .status(401)
      .json({ status: 401, message: 'Invalid Authorization header payload!' });
  }
  const token = authorization.split(' ')[1];
  const decrypted = decryptJwtToken({ token });
  if (!decrypted) {
    return res.status(401).json({ status: 401, message: 'Invalid Token!' });
  }
  const { id } = decrypted;
  if (!isValidUserID(id)) {
    return res.status(401).json({ status: 401, message: 'Invalid Token!' });
  }
  return next();
};

export default jwtTokensHandler;

import JWT from 'jsonwebtoken';
import config from 'config';

const checkCredentials = (username, password) => {
  if (username === 'admin' && password === 'admin') {
    return { id: 1 };
  }
  return null;
};
const isValidUserID = (id) => id === 1;

const generateJwtToken = ({
  payload,
  secret = config.get('JWT_SECRET'),
  options = { expiresIn: config.get('JWT_LIFE_TIME') },
}) => JWT.sign(payload, secret, options);

const decryptJwtToken = ({ token, secret = config.get('JWT_SECRET') }) => {
  try {
    return JWT.verify(token, secret);
  } catch (err) {
    return null;
  }
};

const isAutherizationHeaderPatternValid = (payload) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  RegExp('^Bearer [A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$').test(
    payload,
  );

export {
  checkCredentials,
  generateJwtToken,
  decryptJwtToken,
  isAutherizationHeaderPatternValid,
  isValidUserID,
};

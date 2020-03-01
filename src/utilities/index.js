import JWT from 'jsonwebtoken';

const checkCredentials = (username, password) => {
  if (username === 'admin' && password === 'admin') {
    return { id: 1 };
  }
  return null;
};

const generateJwtToken = ({
  payload,
  secret = process.env.JWT_SECRET,
  options = { expiresIn: process.env.JWT_LIFE_TIME },
}) => JWT.sign(payload, secret, options);

const decryptJwtToken = ({ token, secret = process.env.JWT_SECRET }) => {
  try {
    return JWT.verify(token, secret);
  } catch (err) {
    return null;
  }
};

const isAutherizationHeaderPatternValid = (payload) => RegExp('^Bearer [A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$').test(
  payload,
);

export {
  checkCredentials,
  generateJwtToken,
  decryptJwtToken,
  isAutherizationHeaderPatternValid,
};

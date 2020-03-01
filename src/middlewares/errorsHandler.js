/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

const errorsHandler = (err, req, res, _next) => {
  const { status } = err;
  res.status(status).json({});
};

export default errorsHandler;

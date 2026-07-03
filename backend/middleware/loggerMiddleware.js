const loggerMiddleware = (req, res, next) => {
  console.log("Request received");

  next();
};

module.exports = loggerMiddleware;
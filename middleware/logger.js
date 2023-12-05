// @desc logger
const logger = (req, res, next) => {
  //   req.hello = "Hello from node";
  //   console.log("middleware running");
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
  );
  next();
};

module.exports = logger;

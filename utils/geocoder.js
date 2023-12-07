const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "google",
  apiKey: "f1be056b457c408d9a46fd0874813d6e",
  httpAdapter: "https",
  formartter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;

const mongoose = require("mongoose");

const connectDb = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);

  console.log(`MongoDb Connected: ${conn.connection.host}`);
};

module.exports = connectDb;

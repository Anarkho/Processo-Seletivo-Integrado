import mongoose from "mongoose";

mongoose.Promise = Promise;

const mongodbUrl =
  process.env.MONGODB_URL || "mongodb://localhost:27017/BD_universidades";

const connect = () =>
  mongoose.connect(mongodbUrl,{
    useMongoClient: true,
  });

export default { connect };
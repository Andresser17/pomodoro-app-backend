import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const options = {
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  // all other approaches are now deprecated by MongoDB:
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const db = async () => await mongoose.connect(process.env.MONGO_URI, options);

db().catch((err) => console.log(err));

export default mongoose;

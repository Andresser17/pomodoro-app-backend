import express from "express";
import cors from "cors";
import config from "./config/env.config.js";
import dotenv from "dotenv";
// Routes
import AuthorizationRouter from "./routes/auth.routes.js";
import UsersRouter from "./routes/user.routes.js";
// Models
import { createRole } from "./models/role.model.js";
// DB
import db from "./models/index.js";
const Role = db.role;
dotenv.config();

const app = express();

let corsOptions = {
  origin: "http://localhost:3600",
};

app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
//   res.header("Access-Control-Expose-Headers", "Content-Length");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Accept, Authorization, Content-Type, X-Requested-With, Range"
//   );
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   return next();
// });

// Parse request of content-type - application/json
app.use(express.json());
// Parse request of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Db connection
const options = {
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  // all other approaches are now deprecated by MongoDB:
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const initial = () => {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      createRole("user");
      createRole("moderator");
      createRole("admin");
    }
  });
};

// Routes
AuthorizationRouter(app);
UsersRouter(app);

const startServer = async () => {
  console.log("Connecting to MongoDB");
  const connect = await db.mongoose.connect(process.env.MONGO_URI, options);

  if (!connect) return console.error("Connection error", connect);
  console.log("Succesfully connect to MongoDB");
  initial();

  app.listen(config.port || 8080, () => {
    console.log(`app listening at port ${config.port}.`);
  });
};

startServer();

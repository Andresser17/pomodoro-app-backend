import express from "express";
import cors from "cors";
import config from "./config/env.config.js";
// Routes
import AuthorizationRouter from "./routes/auth.routes.js";
import UsersRouter from "./routes/user.routes.js";

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

// Routes
AuthorizationRouter(app);
UsersRouter(app);

app.listen(config.port || 8080, () => {
  console.log(`app listening at port ${config.port}.`);
});

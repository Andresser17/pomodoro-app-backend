import express from "express";
import config from "./common/config/env.config";
import AuthorizationRouter from "./authorization/routes.config";
import UsersRouter from "./users/routes.config";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, Content-Type, X-Requested-With, Range"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  return next();
});

app.use(express.json());
AuthorizationRouter(app);
UsersRouter(app);

app.listen(config.port, () => {
  console.log("app listening at port %s", config.port);
});

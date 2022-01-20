// Controllers
import { signUp, signIn } from "../controllers/auth.controller.js";
// Middleware
import {
  checkDuplicateEmail,
  checkRolesExisted,
} from "../middleware/verifySignUp.js";

function AuthorizationRouter(app) {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      checkDuplicateEmail,
      checkRolesExisted
    ],
    signUp
  );

  app.post("/api/auth/signin", signIn);
}

export default AuthorizationRouter;

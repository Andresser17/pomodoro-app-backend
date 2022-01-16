import {
    hasAuthValidFields,
    isPasswordAndUserMatch,
} from "./middlewares/verify.user.middleware.js";
import { login } from "./controllers/authorization.controller.js";
import {
    validJWTNeeded,
    verifyRefreshBodyField,
    validRefreshNeeded,
} from "../common/middlewares/auth.validation.middleware.js";

function AuthorizationRouter(app) {
    app.post("/auth", [
        hasAuthValidFields,
        isPasswordAndUserMatch,
        login,
    ]);

    app.post("/auth/refresh", [
        validJWTNeeded,
        verifyRefreshBodyField,
        validRefreshNeeded,
        login,
    ]);
}

export default AuthorizationRouter;

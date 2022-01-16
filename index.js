import config from './src/common/config/env.config.js';
import express from 'express';
import AuthorizationRouter from './src/authorization/routes.config.js';
import UsersRouter from './src/users/routes.config.js';
const app = express();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.use(express.json());
AuthorizationRouter(app);
UsersRouter(app);


app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});

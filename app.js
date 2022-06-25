const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config();
const pageRouter = require('./routes/page');

const app = express();

app.set('view engine', 'html');
nunjucks.configure('view', { express: app, watch: true });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session(sessionOption));

app.use(pageRouter);

app.use((request, response, next) => {
    const error = new Error(`${request.method} ${request.url} 라우터가 없습니다`);
    error.status = 404;
    next(error);
});

app.use((request, response, next, error) => {
   response.locals.message = error.message;
   response.locals.error = process.env.NODE_ENV === 'production' ? {} : error;
   response.status(error.status || 500);
   response.render('error');
});

app.listen(process.env.PORT || 1337);

const sessionOption = {
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false
    }
}
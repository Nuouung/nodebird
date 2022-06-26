const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const errorController = require('./controllers/error');

const { sequelize } = require('./models/index');
const passportConfig = require('./passport/index');

const app = express();

passportConfig();
app.set('view engine', 'html');
nunjucks.configure('views', { express: app, watch: true });
sequelize.sync({ force: false })
    .then(() => console.log('데이터베이스 연결 성공'))
    .catch(error => console.log(error));

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(pageRouter);
app.use(authRouter);

app.use(errorController.createError);
app.use(errorController.getErrorPage);

app.listen(process.env.PORT || 3000);
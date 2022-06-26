const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/auth/join', isNotLoggedIn, async (request, response, next) => {
    const { email, nick, password } = request.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) return response.redirect('/join?error=exist');

        const hash = await bcrypt.hash(password, 12);
        await User.create({ email, nick, password: hash });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/auth/login', isNotLoggedIn, (request, response, next) => {
   passport.authenticate('local', (authError, user, info) => {
       if (authError) {
           console.error(authError);
           return next(authError);
       }

       if (!user) return response.redirect(`/?loginError=${info.message}`);

       return request.login(user, loginError => {
          if (loginError) {
              console.error(loginError);
              return next(loginError);
          }

          return response.redirect('/');
       });
   })(request, response, next);
});

router.get('/auth/logout', isLoggedIn, (request, response) => {
   request.logout(() => {
       console.log('로그아웃 완료');
       request.session.destroy();
       response.redirect('/');
   });
});

router.get('/auth/kakao', passport.authenticate('kakao'));

router.get('/auth/kakao/callback', passport.authenticate('kakao', { failureRedirect: '/' }), (request, response) => {
    response.redirect('/');
});

module.exports = router;
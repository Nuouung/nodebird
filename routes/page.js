const express = require('express');

const router = express.Router();

router.use((request, response, next) => {
    response.locals.user = null;
    response.locals.followerCount = 0;
    response.locals.followingCount = 0;
    response.locals.follwerIdList = [];
});

router.get('join', (request, response) => {
    response.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', (request, response, next) => {
    const twits = [];
    response.render('main', { title: 'NodeBird', twits });
});

module.exports = router;
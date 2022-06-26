module.exports.isLoggedIn = (request, response, next) => {
    if (request.isAuthenticated()) {
        next();
    } else {
        response
            .status(403)
            .send('로그인 필요');
    }
}

module.exports.isNotLoggedIn = (request, response, next) => {
    if (!request.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        response.redirect(`/?error=${message}`);
    }
}
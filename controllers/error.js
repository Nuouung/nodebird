module.exports.createError = (request, response, next) => {
    const error = new Error(`${request.method} ${request.url} 라우터가 없습니다`);
    error.status = 404;
    next(error)
}

module.exports.getErrorPage = (error, request, response, next) => {
    response.locals.message = error.message;
    response.locals.error = process.env.NODE_ENV === 'production' ? {} : error;
    response.status(error.status || 500);
    response.render('error');
}
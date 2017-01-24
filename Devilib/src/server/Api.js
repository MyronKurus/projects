
var router = {
    user: require('./routes/User')
};

module.exports.setup = function ( app ) {

    app.post('/api/user/signin', router.user.signin );
    app.post('/api/user/signup', router.user.signup );
    app.post('/api/user/logout', router.user.logout );

};

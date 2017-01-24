angular.module( 'devilib' )
.factory( 'signUp', [ function ( ) {

    var obj = {};

    obj.login = '';

    obj.request = function ( param, callback ) {

        $.ajax({
            
            method: 'POST',
            url: '/api/user/signup',
            data: {
                userName: param.userName, 
                email: param.email, 
                password: param.password
            }
        
        })
        .done ( callback ); 
        obj.login = param.email;

    };



    return obj;

}]);
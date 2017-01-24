angular.module('devilib')
.factory( 'signIn', [ function ( ) {

    var obj = {};

    obj.request = function ( param, callback ) {

        $.ajax({
            
            method: 'POST',
            url: '/api/user/signin',
            data: { 
                email: param.email, 
                password: param.password
            }
        
        })
        .done ( callback );

    };

    return obj;

}]);
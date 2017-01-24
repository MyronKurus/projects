angular.module('devilib')
.factory( 'logOut', [ function ( ) {

    var obj = {};

    obj.request = function ( param, callback ) {

        $.ajax({
            
            method: 'POST',
            url: '/api/user/logout',
            data: { 
                email: localStorage.getItem( 'email' ), 
                session: localStorage.getItem( 'session' )
            }
        
        })
        .done ( callback );

    };

    return obj;

}]);
angular.module( 'goodweed' )
.directive( 'moveNextOnMaxlength', function () {
    
    return {
        
        restrict: 'A',
        link: function( $scope, element ) {
        
            element.on( 'input', function ( event ) {
        
                if( element.val().length == element.attr( 'maxlength' ) ) {
        
                    var nextElement = element.next();
        
                    if( nextElement.length ) {
        
                        nextElement[0].focus();
        
                    }
        
                }
        
            });
        
        }
    
    }

});
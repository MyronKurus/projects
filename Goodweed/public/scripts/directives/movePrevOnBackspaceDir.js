angular.module( 'goodweed' )
.directive( 'movePrevOnBackspace', function() {

	return {
		
		restrict: 'A',
	    link: function( $scope, element ) {
	            
	        element.on( 'keyup', function ( event ) {
	         
	        	if ( event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 67 ) {
	            	
	            	this.previousElementSibling.focus();
	            	
	            }

	            if ( event.keyCode == 9 || event.keyCode == 13 ) {

	            	this.blur();

	            }
	          
	        });
		
		}

	}

});
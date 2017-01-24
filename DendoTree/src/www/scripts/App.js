/*
 * Main app file
 */

var HOST = '';

var App = function () {

    this.dendoTree = false;
    this.isAuthenticated = false;
    this.ui = false;
    this.siteId = false;

    //

    $( document ).ready( this.init.bind( this ) );

};

App.prototype = {};

App.prototype.init = function () {

    var scope = this;

    if ( localStorage.getItem( 'keepMeLoggedIn' ) !== 'true' && Date.now() - ( + localStorage.getItem( 'lastLogin' ) ) > 12 * 3600 * 1000 ) {

        this.logout();

    }

    //

    localStorage.setItem( 'siteId', '11777' ); // need to remove later

    //

    this.ui = new UI();

    this.dendoTree = new DT({ canvasID: 'dt-canvas' });
    this.loadSite( localStorage.getItem('siteId') );

    //

    this.isAuthenticated = !! localStorage.getItem('hash');

};

App.prototype.loadSite = function ( siteId ) {

    var scope = this;

    this.siteId = siteId;

    this.services.getSiteData( siteId, function ( data ) {

        scope.dendoTree.import( data.tree, function () {

            if ( ! scope.isAuthenticated ) {

                $('#top-right-corner-bar').html( '<span>Webdesign:</span><a>Tomston</a><span>|</span><a href="/login">Login</a>' );

            } else {

                $('#top-right-corner-bar').html( '<span>Webdesign:</span><a>Tomston</a><span>|</span><a href="/profile">' + localStorage.getItem('email') + '</a><span>|</span><a id="logout">Logout</a>' );
                $('#logout').click( scope.logout.bind( scope ) );

            }

            scope.dendoTree.readOnly( ! scope.isAuthenticated );

        });

    });

};

App.prototype.logout = function ( event ) {

    localStorage.removeItem('keepMeLoggedIn');
    localStorage.removeItem('lastLogin');
    localStorage.removeItem('email');
    localStorage.removeItem('hash');

    if ( event ) {

        location.reload();

    }

};

//

var app = new App();

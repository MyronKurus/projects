/*
 * Blog Node class
 */

DT.BlogNode = function ( tree, left, top, text, target ) {

    DT.BlogNode.count ++;

    text = text || 'New Blog';
    this.tree = tree;
    var scope = target || this;

    if ( target ) {

        Object.setPrototypeOf( target, DT.BlogNode.prototype );

    } else { 

        DT.Node.call( this, tree, left, top, text, 120, 120, DT.BlogNode.bgColor, DT.BlogNode.textColor );

    }

    scope.title = '';
    scope.image = '';
    scope.text = text;
    scope.innerHTML = '';
    scope.nodeType = 'BlogNode';
    scope.dragging = false;

    //

    setTimeout( function () { // tmp hack

        scope.group.on( 'mouseup', scope.view.bind( scope ) );

    }, 100 );

};

DT.BlogNode.prototype = Object.create( DT.Node.prototype );

DT.BlogNode.prototype.generateThumbnail = function () {

    var node = this;

    var div = document.createElement('div');
    div.className = 'blogHiddenDiv';
    div.innerHTML = '<h3 contenteditable="true">' + node.title +'</h3>' + '<div  id="editor1" contenteditable="true"><img id = reload_image src="' + HOST + '/img/' + localStorage.getItem( 'siteId' ) + '/0/' + node.id + '.jpg?w=100&h=100&rnd=' + Date.now() + '"/>' + node.innerHTML + '</div>';
    $( div ).addClass('blog_node');
    document.body.appendChild( div );

    html2canvas( div, {

        letterRendering: true,
        onrendered: function ( canvas ) {

            document.body.appendChild( canvas );

            var data = new FormData();
            data.append( 'file', canvas.toDataURL() );
            data.append( 'imageType', '3' );
            data.append( 'nodeId', node.id );
            data.append( 'siteId', localStorage.getItem('siteId') );
            data.append( 'hash', localStorage.getItem('hash') );
            data.append( 'email', localStorage.getItem('email') );

            $.ajax({
                url: HOST + '/api/uploadImage', 
                type: 'POST',
                contentType: false, 
                data: data, 
                processData: false,  
                cache: false
            }).done( function ( size ) {

                div.remove();
                node.updateImage( size );

            });

        }

    });

};

DT.BlogNode.prototype.updateImage = function () {

    var scope  = this;
    var editNode = this;
    var date = Date.now();

    fabric.Image.fromURL( HOST + '/img/' + localStorage.getItem( 'siteId' ) + '/0/' + this.id + '.jpg?w=100&h=100&rnd=' + date, function ( oImg ) {

        if ( oImg.getWidth() < oImg.getHeight() ) {

            oImg.set({ selectable: false, left: 0, top: 0, width: scope.width, height: ( scope.width / oImg.getWidth() ) * oImg.getHeight(), hasControls: false, hasBorders: false, clipTo: function(ctx) {ctx.rect(-60, -60, 120, 120); } });

        } else {

            oImg.set({ selectable: false, left: 0, top: 0, width: ( scope.height / oImg.getHeight() ) * oImg.getWidth(), height: scope.height, hasControls: false, hasBorders: false, clipTo: function(ctx) {ctx.rect(-60, -60, 120, 120); } });

        }

        scope.group.remove( scope.group.item(1) );
        scope.group.remove( scope.group.item(0) );
        scope.group.add( oImg );
        scope.group.set({ height: 120 });

        scope.tree.canvas.renderAll();

    });

};

DT.BlogNode.prototype.toJSON = function () {

    return {

        id:     this.id,
        title:  this.title,
        text:   this.innerHTML,
        image:  this.image,
        type:   'blog'

    }; 

};

DT.BlogNode.bgColor = '#fff';
DT.BlogNode.textColor = '#000';

DT.BlogNode.count = 0;

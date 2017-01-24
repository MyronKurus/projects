/*
 * Image Node class
 */

DT.ImageNode = function ( tree, left, top, text, target ) {

    DT.ImageNode.count ++;

    text = text || 'New Image';
    this.tree = tree;
    var scope = target || this;

    if ( target ) {

        Object.setPrototypeOf( target, DT.ImageNode.prototype );

    } else { 

        DT.Node.call( this, tree, left, top, text, 120, 120 );

    }

    //

    scope.title = '';
    scope.image = '';
    scope.innerHTML = '';
    scope.nodeType = 'ImageNode';
    scope.dragging = false;
    scope.watermarkType = 0;

    //

    scope.group.on( 'mouseup', scope.view.bind( this ) ); 

    // CKEDITOR hiding 

    $('#cke_1_top').hide();

};

DT.ImageNode.prototype = Object.create( DT.Node.prototype );

DT.ImageNode.prototype.updateImage = function ( size, src ) {

    var scope  = this;
    
    this.size = size;

    var url = src || HOST + '/img/' + localStorage.getItem( 'siteId' ) + '/0/' + this.id + '.jpg?w=100&h=100&rnd=' + Date.now();

    fabric.Image.fromURL( url, function ( oImg ) {

        if ( oImg.getWidth() < oImg.getHeight() ) {

            oImg.set({ selectable: false, left: 0, top: 0, width: scope.width, height: ( scope.width / oImg.getWidth() ) * oImg.getHeight(), hasControls: false, hasBorders: false, clipTo: function ( ctx ) { ctx.rect( -60, -60, 120, 120 ); } });

        } else {

            oImg.set({ selectable: false, left: 0, top: 0, width: ( scope.height / oImg.getHeight() ) * oImg.getWidth(), height: scope.height, hasControls: false, hasBorders: false, clipTo: function ( ctx ) { ctx.rect( -60, -60, 120, 120 ); } });

        }

        scope.group.remove( scope.group.item(1) );
        scope.group.remove( scope.group.item(0) );
        scope.group.add( oImg );
        scope.group.set({ height: 120 });

        scope.tree.canvas.renderAll();

    });

};

DT.ImageNode.prototype.toJSON = function () {

    return {

        id:         this.id,
        title:      this.title,
        innerHTML:  this.innerHTML,
        type:       'image'

    };

};

DT.Node.defaultSizeZoom = 0;
DT.Node.defaultPosX = 0;
DT.Node.defaultPosY = 0;
DT.Node.defaultNode = false;

DT.ImageNode.count = 0;

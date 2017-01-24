/*
 * User actions handlers
*/

DT.Handlers = function () {};

DT.Handlers.prototype.dragOver = function ( event ) {

    var tree = this;
    var offsetX = event.offsetX || event.layerX;
    var offsetY = event.offsetY || event.layerY;

    if ( tree.readOnlyMode ) return;

    //

    if ( tree.dragoverNode ) {

        tree.dragoverNode.group.set({ left: offsetX, top: offsetY });
        DT.Node.paintLineHandler.call( tree.dragoverNode.group, { e: {} }, tree );

    } else {

        tree.dragoverNode = new DT.ImageNode( tree );
        tree.canvas.add( tree.dragoverNode.group );

        tree.dragoverNode.group.set({ scaleX: tree.scale, scaleY: tree.scale, mywidth: 120 * 1.2 * tree.scale, left: offsetX, top: offsetY });
        tree.dragoverNode.group.setCoords();

    }

    event.preventDefault();
    tree.canvas.renderAll();

};

DT.Handlers.prototype.dragLeave = function ( event ) {

    var tree = this;

    if ( tree.readOnlyMode ) return;

    //

    tree.dragoverNode.group.forEachObject( function ( element ) {

        tree.canvas.remove( element );

    });

    tree.canvas.remove( tree.dragoverNode.group );

    if ( tree.dragoverNode.group.get( 'line' ) ) {

        tree.canvas.remove( tree.dragoverNode.group.get( 'line' )[0] );
        tree.canvas.remove( tree.dragoverNode.group.get( 'line' )[1] );
        tree.canvas.remove( tree.dragoverNode.group.get( 'line' )[2] );

    }

    tree.dragoverNode = false;
    tree.canvas.renderAll();

};

DT.Handlers.prototype.drop = function ( event ) {

    var tree = this;
    var files = event.dataTransfer.files;
    var file = files[0];

    if ( tree.readOnlyMode ) return;

    //

    var canvas = tree.canvas;
    var nodes = tree.nodes;
    var dragoverNode = tree.dragoverNode;

    nodes.push( dragoverNode );
    canvas.moveTo( dragoverNode.group, canvas.getObjects().length - 10 );

    dragoverNode.id = 0;
    dragoverNode.tree = tree;

    dragoverNode.group.movingProxyHandler = function ( event ) { DT.Node.paintLineHandler.call( this, event, tree ); };
    dragoverNode.group.on( 'moving', dragoverNode.group.movingProxyHandler );

    dragoverNode.group.modifiedProxyHandler = function ( event ) { DT.Node.nodeModifiedHandler.call( this, event, tree ); };
    dragoverNode.group.on( 'modified', dragoverNode.group.modifiedProxyHandler );

    dragoverNode.group.selectedProxyHandler = function ( event ) { DT.Node.selectedHandler.call( this, event, tree ); };
    dragoverNode.group.on( 'selected', dragoverNode.group.selectedProxyHandler );

    DT.Node.nodeModifiedHandler.call( dragoverNode.group, { e: {} }, tree );

    // add semi transparent thumbnail before image uploading

    var reader = new FileReader();
    reader.onload = fileOnload;
    reader.readAsDataURL( file );

    function fileOnload ( event ) {

        fabric.Image.fromURL( event.target.result, function ( oImg ) {

            if ( oImg.getWidth() < oImg.getHeight() ) {

                oImg.set({
                    opacity: 0.5,
                    selectable: false,
                    left: 0,
                    top: 0,
                    width: dragoverNode.width,
                    height: ( dragoverNode.width / oImg.getWidth() ) * oImg.getHeight(),
                    hasControls: false,
                    hasBorders: false,
                    clipTo: function ( ctx ) { ctx.rect( -60, -60, 120, 120 ); }
                });

            } else {

                oImg.set({
                    opacity: 0.5,
                    selectable: false,
                    left: 0,
                    top: 0,
                    width: ( dragoverNode.height / oImg.getHeight() ) * oImg.getWidth(),
                    height: dragoverNode.height,
                    hasControls: false,
                    hasBorders: false,
                    clipTo: function ( ctx ) { ctx.rect( -60, -60, 120, 120 ); }
                });

            }

            dragoverNode.group.remove( dragoverNode.group.item(1) );
            dragoverNode.group.remove( dragoverNode.group.item(0) );
            dragoverNode.group.add( oImg );
            dragoverNode.group.set({ height: 120 });

            canvas.renderAll();

        });

        var img = new Image();

        img.onload = function () {

            var cor = Math.max( 3000 / img.width, 2000 / img.height );
            var oc = document.createElement('canvas');
            var octx = oc.getContext('2d');

            oc.width = img.width * Math.min( 1, cor );
            oc.height = img.height * Math.min( 1, cor );
            octx.drawImage( img, 0, 0, oc.width, oc.height );

            var fileImage = oc.toDataURL( 'image/jpeg', 1 );
            oc.remove();

            $.post( HOST + '/api/node/create', { owner: '1', type: dragoverNode.nodeType.split('Node')[0].toLowerCase(), hash: localStorage.getItem('hash'), email: localStorage.getItem('email'), siteId: localStorage.getItem('siteId') }, function ( data ) {

                console.log( 'Save Node ID' );
                dragoverNode.id = data.id;

                // upload image

                var data = new FormData();
                data.append( 'file', fileImage );
                data.append( 'imageType', '1' );
                data.append( 'nodeId', dragoverNode.id );
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

                    dragoverNode.updateImage( size );
                    tree.saveTree();

                });

            });

        };

        img.src = event.target.result;

    };

    tree.dragoverNode = false; 
    event.preventDefault();

};

DT.Handlers.prototype.mouseDown = function ( event ) {

    var tree = this;

    //

    if ( ! event.target || event.target == tree.nodes[0].group ) {

        tree.dragTree = event.target || true;

        if ( !! window.chrome ) { 

            tree.canvas.defaultCursor = '-webkit-grabbing'; 

        } else { 

            tree.canvas.defaultCursor = '-moz-grabbing';

        }

        tree.position.x = ( event.e.offsetX || event.e.layerX );
        tree.position.y = ( event.e.offsetY || event.e.layerY );

    }

    $('#left-bar').removeClass('opened');

    // todo: need to move this !!

    tree.isRenderAll = true;

    function step () {

        tree.canvas.renderAll();

        if ( tree.isRenderAll ) {

            requestAnimationFrame( step );

        }

    }

    requestAnimationFrame( step );

};

DT.Handlers.prototype.mouseMove = function ( event ) {

    var tree = this;

    //

    if ( tree.dragTree ) { 

        var deltaX = ( event.e.offsetX || event.e.layerX ) - tree.position.x;
        var deltaY = ( event.e.offsetY || event.e.layerY ) - tree.position.y;

        if ( tree.nodes[0].group.left + deltaX <  ( - tree.nodes[0].group.mywidth / 2  + 100 + tree.leftMenu.background.width ) || tree.nodes[0].group.left + deltaX > window.innerWidth - 100 + tree.nodes[0].group.mywidth / 2 ) {

            deltaX = 0;

        }

        if ( tree.nodes[0].group.top + deltaY < - ( tree.treeHeight - window.innerHeight + 100 ) || tree.nodes[0].group.top + deltaY > window.innerHeight - 100 ) {

            deltaY = 0;

        }

        tree.moveTree( deltaX, deltaY, tree );

        tree.position.x = ( event.e.offsetX || event.e.layerX );
        tree.position.y = ( event.e.offsetY || event.e.layerY );

    }

};

DT.Handlers.prototype.mouseUp = function ( event ) {

    var tree = this;

    //

    if ( tree.dragTree ) {

        tree.canvas.deactivateAll().renderAll();

    }

    tree.dragTree = false;
    tree.isRenderAll = false;
    tree.canvas.defaultCursor = 'default';

};

DT.Handlers.prototype.findTarget = function ( originalFn ) {

    var tree = this;

    return function () {

        if ( tree.isRenderAll ) return;

        var target = originalFn.apply( this, arguments );

        if ( target ) {

            if ( this._hoveredTarget1 !== target ) {

                target.fire( 'object:over', { target: target } );

                if ( this._hoveredTarget1 ) {

                    this._hoveredTarget1.fire( 'object:out', { target: this._hoveredTarget1 } );

                }

                this._hoveredTarget1 = target;

            }

        } else if ( this._hoveredTarget1 ) {

            this._hoveredTarget1.fire( 'object:out', { target: this._hoveredTarget1 } );
            this._hoveredTarget1 = null;

        }

        return target;

    };

};

DT.Handlers.prototype.windowResize = function () {

    var tree = this;

    if ( $('#viewer').css( 'display' ) === 'none' ) {

       tree.canvas.deactivateAllWithDispatch();

        var width = window.innerWidth;
        var height = window.innerHeight;

        var deltaX = ( ( tree.nodes[0].group.left - tree.leftMenu.background.width ) / ( tree.canvas.getWidth() - tree.leftMenu.background.width ) * ( width - tree.leftMenu.background.width ) ) - ( tree.nodes[0].group.left  - tree.leftMenu.background.width );

        tree.canvas.setWidth( width );
        tree.canvas.setHeight( height - $('#header').height() );
        tree.canvas.calcOffset();

        tree.moveTree( deltaX, 0, tree );

        $('.canvas-container').css( 'width', width );
        $('.canvas-container').css( 'height', height - $('#header').height() );

        tree.recountNodesWidth( tree.nodes[0], null,  false );

    } else {
        
        return;

    }

};

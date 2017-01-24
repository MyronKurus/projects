/*
 * Node class
 */

DT.Node = function ( tree, left, top, text, width, height, bgColor, textColor ) {

    width = width || 120;
    height = height || 60;

    this.width = width;
    this.height = height;

    bgColor = bgColor || '#fff';
    textColor = textColor || '#000';

    cursor = DT.Node.cursor;

    //

    this.id = ++ DT.Node.numID;
    this.tree = tree;

    this.position = { x: 0, y: 0 };

    var r = new fabric.Rect({
        strokeWidth: 1,
        width: width,
        height: height,
        originX: 'center',
        originY: 'center',
        fill: bgColor,
        stroke: '#e0e0e0',
        rx: 2,
        ry: 2
    });

    r.hasControls = r.hasBorders = false;

    var t = new fabric.IText( text, {
        backgroundColor: bgColor,
        fill: textColor,
        fontSize: 18,
        originX: 'center',
        originY: 'center',
        fontFamily: 'Verdana'
    });

    this.group = new fabric.Group([ r, t ], {
        left: left,
        top: top,
        mywidth: width * 1.2,
        height: height,
        hasControls: false,
        hasBorders: false,
        line: null,
        selectable: true,
        hoverCursor: cursor
    });

    //

    this.children = [];
    this.parent = false;
    this.myleft = this.group.left;
    this.mytop = this.group.top;
    this.nodeType = null;

    this.group.node = this;

};

DT.Node.prototype.view = function () {

    var scope = this;

    $('#canvas-disable').show();

    setTimeout( function () {

        if ( scope.dragging ) {

            if ( scope.dragging === 'dblclick' ) { 

                scope.dragging = true;

            } else {

                scope.dragging = false;

            }

            $('#canvas-disable').hide();

            return;

        }

        //

        scope.tree.leftMenu.toggle( false );

        scope.group.line[0].set({ stroke: '#c8c8c8' });
        scope.group.line[1].set({ stroke: '#c8c8c8' });
        scope.group.line[2].set({ stroke: '#c8c8c8' });

        DT.Node.defaultSizeZoom = scope.tree.scale;
        DT.Node.defaultPosX = scope.group.left;
        DT.Node.defaultPosY = scope.group.top;
        DT.Node.defaultNode = scope;

        //

        scope.zoomIn( app.ui.viewer.showSlide.bind( app.ui.viewer ) );

    }, 300 );

    $('#editor-block').show();

};

DT.Node.prototype.setImage = function ( url ) {

    var scope = this;
    this.image = url;

    fabric.Image.fromURL( '/image.php?siteId=' + localStorage.getItem( 'siteId' ) + '&itemId=' + this.id + '.jpg?w=100&h=100', function ( oImg ) {

        scope.tree.loadImages();

        if ( ! oImg.width ) {

            fabric.Image.fromURL( '/images/img.jpg', function ( oImg ) {

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

            return;

        }

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

DT.Node.prototype.setText = function ( text ) {

    this.group.item(1).set( 'text', text );

};

DT.Node.prototype.countNumber = function () {

    var tempNode = this;
    var i = 1;

    while ( tempNode.parent.nodeType === 'ImageNode' || tempNode.parent.nodeType === 'BlogNode' ) {

        tempNode = tempNode.parent;
        i ++;

    }

    tempNode = this;
    var j = i;

    while ( tempNode.children[0] ) {

        tempNode = tempNode.children[0];
        j ++;

    }

    return i + '/' + j;

};

DT.Node.prototype.zoomIn = function ( callback ) {

    var scope = this;

    var zoomCoff = scope.tree.scale;
    var fullSize;

    scope.group.item(0).set({ clipTo: false });

    var fullSizeZoom = Math.min( window.innerHeight / scope.group.item(0).height, window.innerWidth / scope.group.item(0).width );
    var n = Math.ceil( ( fullSizeZoom - zoomCoff ) / 0.4 );
    var tempPosX = scope.group.left;
    var tempPosY = scope.group.top;
    var offsetX, offsetY;

    scope.tree.canvas.stateful = false;

    //

    var easeAnim = function ( t, b, c, d ) {

        return - c / 2 * ( Math.cos( Math.PI * t / d ) - 1 ) + b;

    };

    var tim = 1;
    var timer = setInterval( function () { 

        scope.zoomAnim( easeAnim( tim, zoomCoff, fullSizeZoom - zoomCoff, n ) );
        offsetX = easeAnim( tim, tempPosX, window.innerWidth / 2 - tempPosX, n ) - scope.group.left;
        offsetY = easeAnim( tim, tempPosY, window.innerHeight / 2 - tempPosY, n ) - scope.group.top;

        tim ++;

        for ( var i = 0, il = scope.tree.nodes.length; i < il; i ++ ) {

            scope.tree.nodes[ i ].group.top += offsetY;
            scope.tree.nodes[ i ].mytop = scope.tree.nodes[ i ].group.top;
            scope.tree.nodes[ i ].group.left += offsetX;
            scope.tree.nodes[ i ].myleft = scope.tree.nodes[ i ].group.left;

        }

        for (  var i = 1, il = scope.tree.nodes.length; i < il; i ++  ) {

            scope.tree.paintLine( scope.tree.nodes[ i ], scope.tree.nodes[ i ].parent, false );

        }

        scope.tree.canvas.renderAll();

        if ( scope.tree.scale >= fullSizeZoom - 0.000001 ) {

            clearInterval( timer );
            $('#canvas-disable').hide();
            callback( scope );

        }

    }, 25 );

};

DT.Node.prototype.zoomAnim = function ( scale ) {

    var tree = this.tree;

    var scaleDiff = scale / tree.scale;

    tree.NODE_MARGIN_TOP *= scaleDiff;
    tree.treeHeight *= scaleDiff;

    tree.scale = scale;
    tree.leftMenu.zoomNode( tree.nodes[0], scaleDiff );

};

DT.Node.prototype.setSize = function ( width, height ) {

    this.width = width || this.width;
    this.height = height || this.height;

    this.group.set({
        width: this.width,
        height: this.height
    });

    this.group.item(0).set({
        width: this.width,
        height: this.height
    });

};

DT.Node.prototype.closeNode = function () {

    var tree = this.tree;

    window.history.pushState( null, null, '/' );

    var offsetX = DT.Node.defaultNode.group.left - tree.editNode.group.left;
    var offsetY = DT.Node.defaultNode.group.top - tree.editNode.group.top;

    var node;
    var tim = 1;

    var easeAnim = function ( t, b, c, d ) {

        return - c / 2 * ( Math.cos( Math.PI * t / d ) - 1 ) + b;

    };

    //

    tree.leftMenu.toggle( true );

    for ( var i = 0, il = tree.nodes.length; i < il; i ++ ) {

        var node = tree.nodes[ i ];

        node.group.top += offsetY;
        node.mytop = node.group.top;
        node.group.left += offsetX;
        node.myleft = node.group.left;

    }

    for (  var i = 1, il = tree.nodes.length; i < il; i ++ ) {

        tree.paintLine( tree.nodes[ i ], tree.nodes[ i ].parent, false );

    }

    tree.canvas.renderAll();

    //

    DT.Node.defaultNode.group.item(0).clipTo = function ( ctx ) { ctx.rect( -60, -60, 120, 120 ); };

    var zoomCoff = DT.Node.defaultNode.tree.scale;
    var defaultSizeZoom = DT.Node.defaultSizeZoom;
    var n = Math.ceil( ( zoomCoff - defaultSizeZoom ) / 0.4 );
    var tempPosX = DT.Node.defaultNode.group.left;
    var tempPosY = DT.Node.defaultNode.group.top;
    var defaultPosX = DT.Node.defaultPosX;
    var defaultPosY = DT.Node.defaultPosY;
    var stepX = ( defaultPosX - DT.Node.defaultNode.group.left ) / n;
    var stepY = ( defaultPosY - DT.Node.defaultNode.group.top ) / n;

    tree.canvas.stateful = false;

    var timer = setInterval( function () { 

        DT.Node.defaultNode.zoomAnim( easeAnim( tim, zoomCoff, defaultSizeZoom - zoomCoff, n ) );

        offsetX = easeAnim( tim, tempPosX, defaultPosX - tempPosX, n ) - DT.Node.defaultNode.group.left;
        offsetY = easeAnim( tim, tempPosY, defaultPosY - tempPosY, n ) - DT.Node.defaultNode.group.top;

        tim ++;

        for ( var i = 0, il = tree.nodes.length; i < il; i ++ ) {

            node = tree.nodes[ i ];

            node.group.top += offsetY;
            node.mytop = node.group.top;
            node.group.left += offsetX;
            node.myleft = node.group.left;

        }

        for (  var i = 1, il = tree.nodes.length; i < il; i ++ ) {

            tree.paintLine( tree.nodes[ i ], tree.nodes[ i ].parent, false );

        }

        tree.canvas.renderAll();

        if ( tree.scale <= defaultSizeZoom + 0.000001 ) {

            clearInterval( timer );
            tree.canvas.stateful = true;

            for ( var i = 0, il = tree.nodes.length; i < il; i ++ ) {

                tree.nodes[ i ].group.setCoords();

            }

        }

    }, 25 );

};

DT.Node.prototype.toJSON = function () {

    var children = [];

    for ( var i = 0, il = this.children.length; i < il; i ++ ) {

        children.push( this.children[ i ].id );

    }

    return {

        id: this.id,
        nodeType: this.nodeType,
        parent: this.parent.id,
        children: children,
        top: this.group.get('top'),
        left: this.group.get('left'),
        width: this.group.get('mywidth')

    };

};

//

DT.Node.nodeModifiedHandler = function ( event, scope ) {

    var self = this;

    var l = this.get('left');
    var t = this.get('top');

    this.sendToBack();
    scope.canvas.deactivateAll();
    this.item(0).set({ shadow: null, stroke: '#e0e0e0' });

    var trash = scope.leftMenu.trash;

    // Delete node if it drag on trash

    if ( trash.state === 'in' ) {

        trash.state = 'out';
        trash.startAnimate( 'out' );

    }

    if ( Math.abs( l - trash.get('left') ) < trash.get( 'width' ) * trash.get( 'scaleX' ) && Math.abs( t - trash.get('top') ) < trash.get( 'height' ) * trash.get( 'scaleY' ) ) {

        for ( var i = 0, il = this.node.parent.children.length; i < il; i ++ ) {

            if ( this.node.parent.children[i] === this.node ) {

                this.node.parent.children.splice( i, 1 );
                break;

            }

        }

        if ( this.node.nodeType == 'ImageNode' || this.node.nodeType == 'BlogNode' ) {

            scope.removeNodeWithChildren( this, true );

        } else {

            scope.removeNodeWithChildren( this, false );

        }

        scope.recountNodesWidth( this.node.parent, null, true );
        scope.canvas.renderAll();

        $.post( HOST + '/api/node/remove', { owner: '1', type: self.node.nodeType.split('Node')[0].toLowerCase(), id: self.node.id, hash: localStorage.getItem('hash'), email: localStorage.getItem('email'), siteId: localStorage.getItem('siteId') }, function ( data ) {

            scope.saveTree();

        });

        return;

    }

    //

    var distance;
    var minDistance = 100000000000;
    var currentNode;

    for ( var i = 0, il = scope.nodes.length; i < il && l > scope.leftMenu.background.width; i ++ ) {

        var nodeL = scope.nodes[ i ].group.get('left');
        var nodeT = scope.nodes[ i ].group.get('top');

        distance = Math.sqrt( Math.pow( l - nodeL, 2 ) + Math.pow( t - nodeT, 2 ) );

        if ( distance < minDistance && ! ( this.node === scope.nodes[ i ] ) && t > nodeT + scope.nodes[ i ].group.get('height') * scope.scale / 2 ) {

            currentNode = scope.nodes[ i ];
            minDistance = distance;

        }

    }

    if ( currentNode && minDistance < Math.max( 500 * scope.scale, currentNode.group.get( 'mywidth' ) * 1.3 ) && scope.checkAddingRules( this.node, currentNode ) ) {

        scope.paintLine( this.node, currentNode );

        this.line[0].sendToBack();
        this.line[1].sendToBack();
        this.line[2].sendToBack();

        var oldParent = this.node.parent;

        for ( var j = 0, jl = currentNode.children.length; j < jl; j ++ ) {

            if ( currentNode.children[ j ].group.get( 'left' ) > this.get( 'left' ) ) break;

        }

        if ( oldParent ) {

            for ( var i = 0, il = oldParent.children.length; i < il; i ++ ) {

                if ( oldParent.children[ i ] === this.node ) {

                    if ( this.node.nodeType == 'BlogNode' || this.node.nodeType == 'ImageNode' ) {

                        oldParent.children.splice( i, 1 );
                        Array.prototype.splice.apply( oldParent.children, [ i, 0 ].concat( this.node.children ) );

                        for ( var k = 0, kl = this.node.children.length; k < kl; k ++ ) {

                            this.node.children[ k ].parent = oldParent;

                        }

                        this.node.children = currentNode.children;
                        this.node.parent = currentNode;

                        for ( var k = 0, kl = this.node.children.length; k < kl; k ++ ) {

                            this.node.children[ k ].parent = this.node;

                        }

                        currentNode.children = [ this.node ];
                        scope.recountNodesWidth( this.node.parent, null, true );

                        break;

                    }

                    if ( oldParent === currentNode ) {

                        if ( i > j - 1 ) {

                            oldParent.children.splice( i, 1 );
                            currentNode.children.splice( j, 0, this.node );
                            scope.recountNodesWidth( this.node.parent, null, true );
                            break;

                        }

                        if ( i < j - 1 ) {

                            oldParent.children.splice( i, 1 );
                            currentNode.children.splice( j - 1, 0, this.node );
                            scope.recountNodesWidth( this.node.parent, null, true );
                            break;

                        }

                        scope.recountNodesWidth( this.node.parent, null, true );

                    } else { 

                        oldParent.children.splice( i, 1 );
                        currentNode.children.splice( j, 0, this.node );
                        this.node.parent = currentNode;
                        scope.recountNodesWidth( this.node.parent, oldParent, true );
                        break;

                    }

                }

            };

        } else {

            if ( this.node.nodeType == 'BlogNode' || this.node.nodeType == 'ImageNode' ) {

                this.node.children = currentNode.children;
                this.node.parent = currentNode;

                for ( var i = 0, il = this.node.children.length; i < il; i ++ ) {

                    this.node.children[ i ].parent = this.node;

                }

                currentNode.children = [ this.node ];
                scope.recountNodesWidth( this.node.parent, null, true );

                if ( this.node.nodeType == 'BlogNode' ) {

                    $('#canvas-disable').show();

                    setTimeout( function () {

                        self.trigger( 'mouseup' );
                        app.ui.viewer.blogSlide.editImmediately = true;

                    }, scope.animDuration * 1.5 );

                }

            } else {

                currentNode.children.splice( j, 0, this.node );
                this.node.parent = currentNode;
                scope.recountNodesWidth( this.node.parent, null, true );

                setTimeout( function () {

                    scope.canvas.setActiveObject( self );
                    self.trigger( 'mouseup' );

                }, scope.animDuration * 1.5 ); // need timeout to wait until tree animation finished

            }

        }

    } else {

        if ( this.node.parent ) {

            this.node.group.line[0].set({ stroke : '#9d9d9d', visible: true });
            this.node.group.line[1].set({ stroke : '#9d9d9d', visible: true });
            this.node.group.line[2].set({ stroke : '#9d9d9d', visible: true });

            scope.recountNodesWidth( this.node.parent, null, true );

        } else { 

            this.forEachObject( function ( a ) {

                scope.canvas.remove( a );

            });

            scope.canvas.remove( this );

            if ( this.get( 'line' ) ) {

                scope.canvas.remove( this.get( 'line' )[0] );
                scope.canvas.remove( this.get( 'line' )[1] );
                scope.canvas.remove( this.get( 'line' )[2] );

            }

            for ( var i = 0, il = scope.nodes.length; i < il; i ++ ) {

                if ( this.node === scope.nodes[ i ] ) {

                    scope.nodes.splice( i, 1 );
                    break;

                }

            }

        }

    }

    for ( i in scope.leftMenu.elements ) {

        scope.leftMenu.elements[ i ].bringToFront();

    }

    if ( self.node.id === -1 ) {

        $.post( HOST + '/api/node/create', { owner: '1', type: self.node.nodeType.split('Node')[0].toLowerCase(), hash: localStorage.getItem('hash'), email: localStorage.getItem('email'), siteId: localStorage.getItem('siteId') }, function ( data ) {

            console.log("Save Node ID");
            self.node.id = data.id;
            scope.saveTree();

        });

    } else {

        scope.saveTree();

    }

};

DT.Node.newNodeHandler = function ( event, scope ) {

    this.off( 'moving', this.movingProxyHandler );
    this.off( 'modified', this.modifiedProxyHandler );
    this.off( 'object:over' );
    this.off( 'object:out' );

    scope.leftMenu.elements.splice( scope.leftMenu.elements.indexOf( this ), 1 );

    if ( this.node.nodeType !== 'PageNode' && ( ! this.line || this.line[0].opacity == 0 || this.line[0].visible == false ) ) {

        this.set({ top: 0, left: 0 });
        DT.Node.nodeModifiedHandler.call( this, event, scope );
        return;

    }

    this.movingProxyHandler = function ( event ) { DT.Node.paintLineHandler.call( this, event, scope ); };
    this.on( 'moving', this.movingProxyHandler );

    this.modifiedProxyHandler = function ( event ) { DT.Node.nodeModifiedHandler.call( this, event, scope ); };
    this.on( 'modified', this.modifiedProxyHandler );

    this.selectedProxyHandler = function ( event ) {  DT.Node.selectedHandler.call( this, event, scope ); };
    this.on( 'selected', this.selectedProxyHandler );

    if ( this.node.nodeType !== 'PageNode' && ! this.node.parent ) {

        this.item(0).set({ visible: true });
        this.item(1).set({ visible: true });
        this.remove( this.item(2) );

        this.set({ scaleX: scope.nodes[0].group.get( 'scaleX' ), scaleY: scope.nodes[0].group.get( 'scaleY' ), mywidth: this.get( 'mywidth' ) * scope.scale, height: this.item(0).height });

        scope.canvas.moveTo( this, scope.canvas.getObjects().length - 10 );
        scope.nodes.push( this.node );

        DT.BlogNode( scope, false, false, false, this.node );
        this.node.setSize( null, 120 );

        //

        this.node.id = -1;

        DT.Node.nodeModifiedHandler.call( this, event, scope );

    } else {

        this.item(0).set({ visible: true });
        this.item(1).set({ visible: true });
        this.remove( this.item(2) );
        this.set({ scaleX: scope.nodes[0].group.get( 'scaleX' ), scaleY: scope.nodes[0].group.get( 'scaleY' ), mywidth: this.get( 'mywidth' ) * scope.scale, height: this.item(0).height });

        scope.nodes.push( this.node );
        this.set({ hoverCursor: 'text' });
        this.item( 1 ).set({ text: ' New Branch ' });
        this.node.text = ' New Branch ';
        // this.node.text.style.fontSize = "xx-large";

        DT.PageNode.makeEditable( this );

    }

};

DT.Node.selectedHandler = function ( event, scope ) {

    this.bringToFront();

    if ( this.node.nodeType === 'MainPageNode' || this.node.nodeType === 'SubPageNode' ) {

        if ( this.node.children.length > 0 ) {

            scope.position.x = this.get('left') - this.node.children[0].group.get('left');
            scope.position.y = this.get('top') - this.node.children[0].group.get('top');

        }

        var children = this.node.children.slice();
        var activeObjects = this.node.children.slice();
        activeObjects.push( this.node );

        while ( children.length > 0 ) {

            temp = [];

            for ( var i = 0, il = children.length; i < il; i ++ ) {

                activeObjects.push( children[ i ].group.line[0] );
                activeObjects.push( children[ i ].group.line[1] );
                activeObjects.push( children[ i ].group.line[2] );
                temp = temp.concat( children[ i ].children );

            }

            children = temp;
            activeObjects = activeObjects.concat( temp );

        }

        var tempObjects = [];
        var curObjects = scope.canvas.getObjects();

        for ( var i = 0, il = curObjects.length; i < il; i ++ ) {

            if ( activeObjects.indexOf( curObjects[ i ].node || curObjects[ i ] ) === -1 ) {

                tempObjects.push( curObjects[ i ] );

            } 

        } 

        tempObjects = tempObjects.concat( activeObjects );

        for ( var i = 0, il = tempObjects.length; i < il; i ++ ) {

            curObjects[ i ] = tempObjects[ i ].group || tempObjects[ i ];

        }

    }

};

DT.Node.paintLineHandler = function ( event, scope ) { 

    if ( event.e.movementX == 0 && event.e.movementY == 0 ) return;

    if ( ! this.item(0).shadow ) this.item(0).set({ shadow: 'rgba(0,0,0,0.4) 3px 3px 5px' });

    if ( this.node.nodeType == 'ImageNode' || this.node.nodeType == 'BlogNode' ) {

        this.node.dragging = true;

    }

    if ( ( this.node.nodeType === 'MainPageNode' && ( !this.node.children[0] || this.node.children[0].nodeType !== 'SubPageNode' ) ) || this.node.nodeType === 'SubPageNode' ) { this.node.nodeType = 'PageNode'; }

    if ( this.node.nodeType === 'MainPageNode' || this.node.nodeType === 'SubPageNode' || this.node.nodeType === 'PageNode') { 

        var children = this.node.children;
        var tmpchld;

        var deltaX = this.node.children[0] ? - scope.position.x + this.get('left') - this.node.children[0].group.get('left') : 0;
        var deltaY = this.node.children[0] ? - scope.position.y + this.get('top') - this.node.children[0].group.get('top') : 0;

        while ( children.length > 0 ) {

            tmpchld = [];

            for ( var i = 0, il = children.length; i < il; i ++ ) {

                children[ i ].group.left += deltaX;
                children[ i ].group.top += deltaY;
                children[ i ].myleft = children[ i ].group.left;
                children[ i ].mytop = children[ i ].group.top;

                if ( children[ i ].group.line ) {

                    children[ i ].group.line[0].set({ x1: children[ i ].group.line[0].x1 + deltaX, y1: children[ i ].group.line[0].y1 + deltaY, x2: children[ i ].group.line[0].x2 + deltaX, y2: children[ i ].group.line[0].y2 + deltaY });
                    children[ i ].group.line[1].set({ x1: children[ i ].group.line[1].x1 + deltaX, y1: children[ i ].group.line[1].y1 + deltaY, x2: children[ i ].group.line[1].x2 + deltaX, y2: children[ i ].group.line[1].y2 + deltaY });
                    children[ i ].group.line[2].set({ x1: children[ i ].group.line[2].x1 + deltaX, y1: children[ i ].group.line[2].y1 + deltaY, x2: children[ i ].group.line[2].x2 + deltaX, y2: children[ i ].group.line[2].y2 + deltaY });

                }

                tmpchld = tmpchld.concat( children[ i ].children );

            }

            children = tmpchld;

        }

        scope.canvas.renderAll();

    }

    var l = this.get('left');
    var t = this.get('top');

    // if on leftbar

    if ( this.line && this.line[0].visible === true && l < 200 ) {

        this.line[0].set({ visible: false });
        this.line[1].set({ visible: false });
        this.line[2].set({ visible: false });

    }

    if ( this.line && this.line[0].visible === false && l > 200 ) {

        this.line[0].set({ visible: true });
        this.line[1].set({ visible: true });
        this.line[2].set({ visible: true });

    }

    // if node on trash

    var trash = scope.leftMenu.trash;

    if ( Math.abs( l - trash.get('left') ) < trash.get( 'width' ) * trash.get( 'scaleX' ) / 2 && Math.abs( t - trash.get('top') ) < trash.get( 'height' )  * trash.get( 'scaleY' ) / 2 ) {

        if ( trash.state === 'out' ) {

            trash.state = 'in';
            trash.startAnimate( 'in' );

        }

    } else {

        if ( trash.state === 'in' ) {

            trash.state = 'out';
            trash.startAnimate( 'out' );

        }

    }

    var distance;
    var minDistance = 100000000000;
    var currentNode;

    for ( var i = 0, il = scope.nodes.length; i < il; i ++ ) {

        var nodeL = scope.nodes[ i ].group.get('left');
        var nodeT = scope.nodes[ i ].group.get('top');

        distance = Math.sqrt( Math.pow( l - nodeL, 2 ) + Math.pow( t - nodeT, 2 ) );

        if ( distance < minDistance && ! ( this === scope.nodes[ i ].group ) && t > nodeT + scope.nodes[ i ].group.get('height') * scope.scale / 2 ) {

            currentNode = scope.nodes[ i ];
            minDistance = distance;

        }

    }

    if ( currentNode && minDistance < Math.max( 500 * scope.scale, currentNode.group.get( 'mywidth' ) * 1.3 ) && scope.checkAddingRules( this.node, currentNode ) ) {

        scope.paintLine( this.node, currentNode, true );

    } else {

        if ( this.line ) {

            this.get( 'line' )[0].set({ opacity: 0 });
            this.get( 'line' )[1].set({ opacity: 0 });
            this.get( 'line' )[2].set({ opacity: 0 });

        }

    }

};

//

DT.Node.cursor = 'pointer';
DT.Node.defaultSizeZoom = 0;
DT.Node.defaultPosX = 0;
DT.Node.defaultPosY = 0;
DT.Node.defaultNode = false;

DT.Node.numID = 0;

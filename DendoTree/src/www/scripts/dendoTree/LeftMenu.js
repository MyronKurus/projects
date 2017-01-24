/*
 * Left menu js
*/

DT.LeftMenu = function ( tree ) {

    this.tree = tree;

    this.opened = true;
    this.background = false;
    this.elements = [];

    this.slider = false;
    this.trash = false;

    //

    this.init();

};

DT.LeftMenu.prototype = {};

DT.LeftMenu.prototype.init = function () {

    this.addBarBackground();
    this.addSlider();
    this.addNewNodes();
    this.addTrash();

    //

    $( window ).resize( this.windowResize.bind( this ) );

    // for ( var i = 0, il = this.elements.length; i < il; i ++ ) {

    //     this.elements[ i ].set({ visible: false });

    // }

};

DT.LeftMenu.prototype.windowResize = function () {

    this.background.set({ height: this.tree.canvas.height });
    this.trash.set({ top: Math.max( this.tree.canvas.height - 90, 500 ) });
    this.trash.setCoords();

};

DT.LeftMenu.prototype.toggle = function ( value ) {

    this.opened = ( value !== undefined ) ? value : ! this.opened;

    //

    if ( app.isAuthenticated ) {

        for ( var i = 0, il = this.elements.length; i < il; i ++ ) {

            this.elements[ i ].hiddenIfNotAuthentificated = false;

        }
    
    }

    for ( var i = 0, il = this.elements.length; i < il; i ++ ) {

        if ( this.opened ) {
        
            if ( ! this.elements[ i ].hiddenIfNotAuthentificated ) {

                this.elements[ i ].set({ visible: this.opened });

            }

        } else {

            this.elements[ i ].set({ visible: this.opened });

        }

    }

    if ( this.opened ) { 

        $('#settings').css( 'display', 'flex' );

    } else {

        $('#settings').hide();

    }

};

DT.LeftMenu.prototype.addBarBackground = function () {

    this.background = new fabric.Rect({
        width: 200,
        height: this.tree.canvas.height,
        stroke: '#c8c8c8',
        strokeWidth: 1,
        originX: 'left',
        originY: 'top',
        left: -1,
        top: -1,
        fill: '#eee',
        selectable: false,
        hasControls: false,
        hasBorders: false
    });

    this.tree.canvas.add( this.background );
    this.elements.push( this.background );

};

DT.LeftMenu.prototype.addSlider = function () {

    var scope = this;
    var left = 100;

    var rplus = new fabric.Rect({
        strokeWidth: 1,
        width: 35,
        height: 35,
        originX: 'center',
        originY: 'center',
        fill: '#fff',
        stroke: '#e1e1e1',
        rx: 1,
        ry: 1
    });

    rplus.hasControls = rplus.hasBorders = false;

    var tplus = new fabric.IText( "+", {
        backgroundColor: 'transparent',
        fill: '#424242',
        fontSize: 30,
        originX: 'center',
        originY: 'center',
        fontFamily: 'Verdana'
    });

    var plus = new fabric.Group([ rplus, tplus ], {
        left: left,
        top: 114,
        hasControls: false,
        hasBorders: false,
        selectable: false,
        lockMovementX: true,
        lockMovementY: true,
        hoverCursor : 'pointer'
    });

    var rminus = new fabric.Rect({
        strokeWidth: 1,
        width: 35,
        height: 35,
        originX: 'center',
        originY: 'center',
        fill: '#fff',
        stroke: '#e1e1e1',
        rx: 1,
        ry: 1
    });

    rminus.hasControls = rminus.hasBorders = false;

    var tminus = new fabric.IText( "—", {
        backgroundColor: 'transparent',
        fill: '#424242',
        fontSize: 22,
        originX: 'center',
        originY: 'center',
        fontFamily: 'Verdana'
    });

    var minus = new fabric.Group([ rminus, tminus ], {
        left: left,
        top: 214,
        hasControls: false,
        hasBorders: false,
        selectable: false,
        lockMovementX: true,
        lockMovementY: true,
        hoverCursor : 'pointer'
    });

    var params = {
        fill: 'transparent',
        stroke: '#8c8e90',
        strokeWidth: 1,
        selectable: false,
        hasControls: false,
        hasBorders: false
    };

    var line = new fabric.Line([ left, 132, left, 196 ], params );

    var rslider = new fabric.Rect({
        strokeWidth: 1,
        width: 25,
        height: 8,
        originX: 'center',
        originY: 'center',
        fill: '#689f38',
        hasControls : false,
        hasBorders : false,
        rx: 0,
        ry: 0,
        selecatble: true,
        left: left,
        top: 164,
        lockMovementX : true,
        sliderCoff : 0.5,
        hoverCursor : 'pointer'
    });

    this.tree.canvas.add( plus );
    this.tree.canvas.add( minus );
    this.tree.canvas.add( line );
    this.tree.canvas.add( rslider );

    scope.elements.push( plus );
    scope.elements.push( minus );
    scope.elements.push( line );
    scope.elements.push( rslider );

    this.slider = rslider;

    rslider.on( 'moving', function ( event ) {

        scope.tree.canvas.moveCursor = 'pointer';

        if ( this.top < 136 ) {

            this.set({ top: 136 });

        } else if ( this.top > 192 ) {

            this.set({ top: 192 });

        }

        scope.zoomIt( scope.slider.sliderCoff * 266 / this.top );
        this.setCoords();

    });

    rslider.on( 'modified', function ( event ) {

        scope.tree.canvas.moveCursor = 'move';

        if ( this.top < 136 ) {

            this.set({ top: 136 });

        } else if ( this.top > 192 ) {

            this.set({ top: 192 });

        }

        scope.zoomIt( scope.slider.sliderCoff * 266 / this.top );
        this.setCoords();

    });

    this.tree.canvas.on( 'mouse:down', function ( event ) {

        if ( event.target === plus ) {

            if ( rslider.top <= 146 ) {

                rslider.set({ top: 136 }); 

            } else {

                rslider.set({ top: rslider.top - 10 });

           }

           scope.zoomIt( scope.slider.sliderCoff * 266 / rslider.top );
           rslider.setCoords();

        }

        if ( event.target === minus ) {

            if ( rslider.top >= 182 ) {

                rslider.set({ top: 192 }); 

            } else {

                rslider.set({ top: rslider.top + 10 });

           }

           scope.zoomIt( scope.slider.sliderCoff * 266 / rslider.top );
           rslider.setCoords();

        }

    });

    var temp = false;
    this.tree.canvas.on( 'mouse:move', function ( event ) {

        if ( event.target === plus || event.target === minus ){

            scope.tree.canvas.defaultCursor = 'pointer';
            temp = true;

        } else if ( temp ) {

            scope.tree.canvas.defaultCursor = 'default';   
            temp = false;

        }

    });

};

DT.LeftMenu.prototype.addTrash = function () {

    var scope = this;

    fabric.Image.fromURL( '/images/trash6.png', function ( oImg ) {

        oImg.scale( 1 );
        oImg.set({ opacity: 0.4, selectable: false, left: 100, top: scope.tree.canvas.height - 90, hasControls: false, hasBorders: false, strokeWidth: 0  });

        scope.tree.canvas.add( oImg );
        scope.trash = oImg;
        scope.trash.state = 'out';
        scope.elements.push( oImg );

        if ( scope.readOnlyMode ) {

            scope.trash.set({ visible: false });

        }

        scope.trash.hiddenIfNotAuthentificated = true;

        scope.trash.startAnimate = function ( type ) {

            if ( type === 'in' ) {

                scope.trash.set({ opacity: 0.8 });

                scope.trash.animate( 'scaleX', '1.5', {
                    duration: 200
                });

                scope.trash.animate( 'scaleY', '1.5', {
                    duration: 200,
                    onChange: scope.tree.canvas.renderAll.bind( scope.tree.canvas )
                });

            } else if ( type === 'out' ) {

                scope.trash.set({ opacity: 0.4 });

                scope.trash.animate( 'scaleX', '1', {
                    duration: 200
                });

                scope.trash.animate( 'scaleY', '1', {
                    duration: 200,
                    onChange: scope.tree.canvas.renderAll.bind( scope.tree.canvas )
                });

            }

        }

    });

};

DT.LeftMenu.prototype.zoomIt = function ( scale ) {

    var scope = this;
    var scaleDiff = scale / this.tree.scale;
    var nodes = this.tree.nodes;

    if ( scaleDiff === 1 ) return;

    // down nodes on height difference

    var heightDiff = nodes[0].group.get('height') * ( scale - this.tree.scale ) / 2;

    for ( var i = 0, il = nodes.length; i < il; i ++ ) {

        nodes[ i ].group.top += heightDiff;
        nodes[ i ].mytop = nodes[ i ].group.top;

    }

    this.tree.NODE_MARGIN_TOP *= scaleDiff;
    this.tree.treeHeight *= scaleDiff;

    // prevent disappear tree when zoom down

    var offsetX = 0;
    var offsetY = 0;

    if ( nodes[0].group.left < - nodes[0].group.mywidth * scaleDiff / 2  + 200 ) { 

        offsetX = nodes[0].group.left - ( - nodes[0].group.mywidth * scaleDiff / 2 + 200 );

    }

    if ( nodes[0].group.left > window.innerWidth - 100  + nodes[0].group.mywidth * scaleDiff / 2 ) {

        offsetX = nodes[0].group.left - ( window.innerWidth - 100  + nodes[0].group.mywidth * scaleDiff / 2 );

    }

    if ( nodes[0].group.top < - ( scope.tree.treeHeight - window.innerHeight + 100 ) ) {

        offsetY = nodes[0].group.top + ( scope.tree.treeHeight - window.innerHeight + 100 );

    }

    if ( nodes[0].group.top > window.innerHeight - 100 ) { 

        offsetY = nodes[0].group.top - ( window.innerHeight - 100 );

    }  

    for ( var i = 0, il = nodes.length; i < il; i ++ ) {

        nodes[ i ].group.top -= offsetY;
        nodes[ i ].mytop = nodes[ i ].group.top;
        nodes[ i ].group.left -= offsetX;
        nodes[ i ].myleft = nodes[ i ].group.left;

    };

    nodes[0].group.setCoords();

    //

    this.tree.scale = scale;
    this.zoomNode( nodes[0], scaleDiff );

    for ( var i = 0, il = nodes.length; i < il; i ++ ) {

        if ( nodes[ i ].group.left < 200 - nodes[ i ].group.width * scope.tree.scale / 2 ||
             nodes[ i ].group.left > scope.tree.canvas.width + nodes[ i ].group.width * scope.tree.scale / 2 ||
             nodes[ i ].group.top < 0 - nodes[ i ].group.height * scope.scale / 2 ||
             nodes[ i ].group.top > scope.tree.canvas.height + nodes[ i ].group.height * scope.tree.scale / 2  ) {

            nodes[ i ].group.visible = false;

        } else {

            nodes[ i ].group.visible = true;

        }

    }

    this.tree.canvas.deactivateAll().renderAll();
    this.tree.canvas.calcOffset();

};

DT.LeftMenu.prototype.zoomNode = function ( node, factor ) {

    var nodes = this.tree.nodes;

    node.group.scaleX *= factor;
    node.group.scaleY *= factor;

    for ( var i = 0, il = node.children.length; i < il; i ++ ) {

        node.children[ i ].group.left += ( nodes[0].group.left - node.children[ i ].group.left ) * ( 1 - factor );
        node.children[ i ].group.top += ( nodes[0].group.top - node.children[ i ].group.top ) * ( 1 - factor );
        node.children[ i ].myleft = node.children[ i ].group.left;
        node.children[ i ].mytop = node.children[ i ].group.top;

        if ( node.children[ i ].group.line ) {

            node.children[ i ].group.line[0].set({ strokeWidth: 2 * this.tree.scale });
            node.children[ i ].group.line[1].set({ strokeWidth: 2 * this.tree.scale });
            node.children[ i ].group.line[2].set({ strokeWidth: 2 * this.tree.scale });

            this.tree.paintLine( node.children[ i ], node.children[ i ].parent, false );

        }

        this.zoomNode( node.children[ i ], factor );

    }

    if ( node.group.mywidth ) {

        node.group.mywidth = node.group.mywidth * factor;

    }

    node.group.setCoords();

};

DT.LeftMenu.prototype.addNewNodes = function () {

    var scope = this;

    var backgroundNode = new fabric.Rect({
        strokeWidth: 1,
        width: 96,
        height: 48,
        originX: 'center',
        originY: 'center',
        stroke: '#777',
        fill: '#bbb',
        rx: 0,
        ry: 0,
        left: 100,
        top: 289,
        hasControls: false,
        hasBorders: false,
        selectable: false,
        elemType: 'background'
    });

    backgroundNode.hiddenIfNotAuthentificated = true;

    scope.tree.canvas.add( backgroundNode );
    scope.elements.push( backgroundNode );

    scope.addNewPageNode( scope );

    //

    backgroundNode = new fabric.Rect({
        strokeWidth: 1,
        width: 96,
        height: 96,
        originX: 'center',
        originY: 'center',
        fill: '#bbb',
        stroke: '#777',
        rx: 0,
        ry: 0,
        left: 100,
        top: 389,
        hasControls: false,
        hasBorders: false,
        selectable: false,
        elemType: 'background'
    });

    backgroundNode.hiddenIfNotAuthentificated = true;

    scope.tree.canvas.add( backgroundNode );
    scope.elements.push( backgroundNode );

    setTimeout( function() { scope.addNewBlogImageNode( scope ) } , 100 ); // tmp hack ?!!

};

DT.LeftMenu.prototype.addNewPageNode = function () {

    var scope = this;

    scope.newPageNode = new DT.PageNode( scope.tree, 100, 289 );
    scope.newPageNode.id = -1;

    scope.newPageNode.group.set({ height: 50, width: 100 });
    scope.newPageNode.group.item(0).set({ visible: false });
    scope.newPageNode.group.item(1).set({ visible: false });
    scope.newPageNode.group.set({ hoverCursor: 'pointer' });

    fabric.Image.fromURL( '/images/new-page.png', function ( oImg ) {

        oImg.set({ left: 0, top: 0, hasControls: false, hasBorders: false, opacity: 0 });
        scope.newPageNode.group.add( oImg );
        scope.elements.push( scope.newPageNode.group );
        scope.tree.canvas.add( scope.newPageNode.group );
        scope.tree.canvas.moveTo( scope.newPageNode.group, scope.tree.canvas.getObjects().length - 2 );
        scope.newPageNode.dendoTree = scope.tree;

        oImg.animate( 'opacity', 1, {

            onChange: scope.tree.canvas.renderAll.bind( scope.tree.canvas ),
            duration: 500

        });

        scope.newPageNode.group.on('object:over', scope.nodeOverHandler.bind( scope ) );
        scope.newPageNode.group.on('object:out', scope.nodeOutHandler.bind( scope ) );
        scope.newPageNode.group.hiddenIfNotAuthentificated = true;

        scope.newPageNode.group.movingProxyHandler = function ( event ) { 

            DT.Node.newNodeHandler.call( this, event, scope.tree ); 
            scope.addNewPageNode.call( scope );
            this.bringToFront();

        };

        scope.newPageNode.group.on( 'moving', scope.newPageNode.group.movingProxyHandler );

        if ( scope.tree.readOnlyMode ) {

            scope.newPageNode.group.visible = false;

            if ( scope.newPageNode.group.elemType === 'background' ) {

                scope.newPageNode.group.visible = false;

            }

        }

    });

};

DT.LeftMenu.prototype.addNewBlogImageNode = function ( scope ) {

    scope.newBlogImageNode = new DT.Node( scope.tree, 100, 389, 'Node' );
    scope.newBlogImageNode.nodeType = 'BlogNode';

    scope.newBlogImageNode.group.set({ height: 100, width: 100 });
    scope.newBlogImageNode.group.item(0).set({ visible: false });
    scope.newBlogImageNode.group.item(1).set({ visible: false })

    fabric.Image.fromURL( '/images/image_blog.png', function ( oImg ) {

        oImg.set({ left: 0, top: 0, hasControls: false, hasBorders: false, opacity: 0 });
        scope.newBlogImageNode.group.add( oImg );
        scope.elements.push( scope.newBlogImageNode.group );
        scope.tree.canvas.add( scope.newBlogImageNode.group );
        scope.tree.canvas.moveTo( scope.newBlogImageNode.group, scope.tree.canvas.getObjects().length - 2 );
        scope.newBlogImageNode.tree = scope.tree;

        oImg.animate( 'opacity', 1, {

            onChange: scope.tree.canvas.renderAll.bind( scope.tree.canvas ),
            duration: 500

        });

        scope.newBlogImageNode.group.on('object:over', scope.nodeOverHandler.bind( scope ) );
        scope.newBlogImageNode.group.on('object:out', scope.nodeOutHandler.bind( scope ) );
        scope.newBlogImageNode.group.hiddenIfNotAuthentificated = true;

        scope.newBlogImageNode.group.movingProxyHandler = function ( event ) {

            this.set({ height: 120, width: 120 });
            this.item(2).set({ height: 120, width: 120, scaleX: this.node.tree.scale, scaleY: this.node.tree.scale });
            DT.Node.paintLineHandler.call( this, event, scope.tree );

        };
        scope.newBlogImageNode.group.on( 'moving', scope.newBlogImageNode.group.movingProxyHandler );

        scope.newBlogImageNode.group.movingProxyHandler2 = function ( event ) { 

            this.off( 'moving', this.movingProxyHandler2 );
            scope.addNewBlogImageNode.call( this, scope );
            this.bringToFront();

        };
        scope.newBlogImageNode.group.on( 'moving', scope.newBlogImageNode.group.movingProxyHandler2 );

        scope.newBlogImageNode.group.modifiedProxyHandler = function ( event ) {

            DT.Node.newNodeHandler.call( this, event, scope.tree );

        };
        scope.newBlogImageNode.group.on( 'modified', scope.newBlogImageNode.group.modifiedProxyHandler );

        if ( scope.tree.readOnlyMode ) {

            scope.newBlogImageNode.group.visible = false;

            if ( scope.newBlogImageNode.group.elemType === 'background' ) {

                scope.newBlogImageNode.group.visible = false;

            }

        }

    });

};

DT.LeftMenu.prototype.nodeOverHandler = function ( event ) { 

    event.target.item(2).set({ shadow: { color : 'rgba( 0, 0, 0, 0.4)', blur : 5, offsetX:  3, offsetY: 3 } });

    event.target.animate( { left: 110 }, {

        onChange: this.tree.canvas.renderAll.bind( this.tree.canvas ),
        duration: 50

    });

    this.tree.canvas.calcOffset(); 

};

DT.LeftMenu.prototype.nodeOutHandler = function ( event ) { 

    event.target.item(2).set({ shadow: null });

    event.target.animate({ left: 100 }, {

        onChange: this.tree.canvas.renderAll.bind( this.tree.canvas ),
        duration: 200

    });

    this.tree.canvas.calcOffset(); 

};

DT.LeftMenu.prototype.setReadOnlyMode = function ( value ) {

    if ( value ) {

        for ( var i = 0, il = this.elements.length; i < il; i ++ ) {

            if ( this.elements[ i ].node ) {

                this.elements[ i ].visible = false;

            }

            if ( this.elements[ i ].elemType === 'background' ) {

                this.elements[ i ].visible = false;

            }

        }

        this.trash.set({ visible: false });

    } else {

        for ( var i = 0, il = this.elements.length; i < il; i ++ ) {

            if ( this.elements[ i ].node ) {

                this.elements[ i ].visible = true;

            }

            if ( this.elements[ i ].elemType === 'background' ) {

                this.elements[ i ].visible = true;

            }

        }

        this.trash.set({ visible: true });

    }

};

DT.LeftMenu.prototype.hideMenu = function () {

    for ( var i = 0, il = this.elements.length; i < il; i ++ ) {

        this.elements[ i ].set({ visible: false });

    }

};

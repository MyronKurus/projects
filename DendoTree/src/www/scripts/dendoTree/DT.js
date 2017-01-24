/*
 * core file
 */

var DT = function ( params ) {

    this.canvasID = params.canvasID;

    this.nodes = [];

    this.leftBar = false;

    this.treeChanges = false;
    this.number = 0;
    this.swaping = false;

    this.NODE_MARGIN_TOP = 35;
    this.MAINPAGENODE_MARGIN = 60;

    this.scale = 1;
    this.treeHeight = 0;
    this.animDuration = 500;
    this.dragTree = false;

    this.position = { x: 0, y: 0 };

    this.editNode = false;
    this.dragoverNode = false;
    this.readOnlyMode = false;
    this.newBlogImageNode = false;
    this.newPageNode = false;

    this.savedTimer = 0;
    this.sliderAnimation = false;

    this.loadPercent = 0;
    this.loadImagesArray = [];
    this.isRenderAll = false;

    //

    this.init();

};

DT.prototype.init = function () {

    var scope = this;

    if ( ! window.fabric ) {

        console.error( 'Fabric lib not found.' );
        return false;

    }

    //

    this.__wrapper = $('#bd-wrapper');

    this.__canvas = document.getElementById( this.canvasID );

    this.__canvas.width = window.innerWidth;
    this.__canvas.height = window.innerHeight;

    this.__canvas.setAttribute( 'width', this.__canvas.width );
    this.__canvas.setAttribute( 'height',  this.__canvas.height );
    this.__canvas.getContext('2d').scale( window.devicePixelRatio, window.devicePixelRatio );

    //

    this.canvas = new fabric.CanvasEx( 'dt-canvas', { selection: false, renderOnAddRemove: false, backgroundColor: '#f5f5f5' } );
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

    //

    this.leftMenu = new DT.LeftMenu( this );
    this.handlers = new DT.Handlers();

    //

    this.addHandlers();

};

DT.prototype.addHandlers = function () {

    // add drang&drop handlers for adding new image node

    this.__wrapper[0].addEventListener( 'dragover', this.handlers.dragOver.bind( this ), false );
    this.__wrapper[0].addEventListener( 'dragleave', this.handlers.dragLeave.bind( this ), false );
    this.__wrapper[0].addEventListener( 'drop', this.handlers.drop.bind( this ), false );

    // add moving tree handlers on canvas

    this.canvas.on( 'mouse:down', this.handlers.mouseDown.bind( this ) );
    this.canvas.on( 'mouse:move', this.handlers.mouseMove.bind( this ) );
    this.canvas.on( 'mouse:up', this.handlers.mouseUp.bind( this ) );

    // add object:over object:out event

    this.canvas.findTarget = this.handlers.findTarget.call( this, this.canvas.findTarget );

    // window resize

    $( window ).resize( this.handlers.windowResize.bind( this ) );

};

DT.prototype.removeHandlers = function () {



};

DT.prototype.removeNodeWithChildren = function ( node, withoutChildren ) {

    var scope = this;

    node.item(0).fill = null;

    scope.canvas.remove( node );

    if ( node.get( 'line' ) ) {

        this.canvas.remove( node.get( 'line' )[0] );
        this.canvas.remove( node.get( 'line' )[1] );
        this.canvas.remove( node.get( 'line' )[2] );

    }

    for ( var i = 0, il = this.nodes.length; i < il; i ++ ) {

        if ( node.node === this.nodes[ i ] ) {

            this.nodes.splice( i, 1 );
            break;

        }

    }

    if ( withoutChildren ) {

        for ( var i = 0, il = node.node.children.length; i < il; i ++ ) {

            node.node.parent.children.push( node.node.children[ i ] );
            node.node.children[ i ].parent = node.node.parent;

        }

    } else {

        for ( var i = 0, il = node.node.children.length; i < il; i ++ ) {

            this.removeNodeWithChildren( node.node.children[ i ].group );

        }

    }

};

DT.prototype.checkAddingRules = function ( children, parent ) {

    if ( children.nodeType.indexOf('PageNode') > -1 ) {

        if ( parent.nodeType == 'MainPageNode' ) {

            if ( children.nodeType === 'SubPageNode' ) return true;
            if ( children.nodeType === 'PageNode' ) return DT.PageNode.makeSubPage( children );

            return false;

        }

        if ( parent.nodeType == 'HOME' ){

            if ( children.nodeType === 'MainPageNode' ) return true;
            if ( children.nodeType !== 'MainPageNode' ) return DT.PageNode.makeMainPage( children );

            return false;

        }

    }

    if ( children.nodeType == 'BlogNode' ) {

        if ( parent.nodeType !== 'HOME' && ( parent.children.length == 0 || parent.children[0].nodeType !== 'SubPageNode' ) ) return true;
        return false;

    } 

    if ( children.nodeType == 'ImageNode' ) {

        if (  parent.nodeType !== 'HOME' && ( parent.children.length == 0 || parent.children[0].nodeType !== 'SubPageNode' ) ) return true;
        return false;

    }

};

DT.prototype.paintLine = function ( children, parent, dragingMode ) {

    var x1 = parent.group.left;
    var y1 = parent.group.top + parent.group.get('height') * this.scale / 2;
    var x2 = parent.group.left;
    var y2 = parent.group.top + parent.group.get('height') * this.scale / 2 + this.NODE_MARGIN_TOP / 2;
    var x3 = children.group.get('left');
    var y3 = parent.group.top + parent.group.get('height') * this.scale / 2 + this.NODE_MARGIN_TOP / 2;
    var x4 = children.group.get('left');
    var y4 = children.group.get('top') - children.group.get('height') * this.scale / 2;

    if ( dragingMode ) {

        children.group.item(0).set({ stroke: '#4caf50' });

    }

    if ( children.group.get( 'line' ) ) { 

        children.group.get( 'line' )[0].set({ x1: x1, y1: y1, x2: x2, y2: y2 + 1 * this.scale, opacity: 1 });
        children.group.get( 'line' )[1].set({ x1: x2, y1: y2, x2: x3, y2: y3, opacity: 1 });
        children.group.get( 'line' )[2].set({ x1: x3, y1: y3 - 1 * this.scale, x2: x4, y2: y4, opacity: 1 });

        children.group.get( 'line' )[0].set({ stroke: dragingMode ? '#4caf50' : '#9d9d9d' });
        children.group.get( 'line' )[1].set({ stroke: dragingMode ? '#4caf50' : '#9d9d9d' });
        children.group.get( 'line' )[2].set({ stroke: dragingMode ? '#4caf50' : '#9d9d9d' });

    } else {

        var line = [];

        var params = {
            fill: 'transparent',
            stroke: dragingMode ? '#4caf50' : '#9d9d9d',
            strokeWidth: 2 * this.scale,
            selectable: false,
            hasControls: false,
            hasBorders: false
        };

        line[0] = new fabric.Line([ x1, y1, x2, y2 ], params );
        line[1] = new fabric.Line([ x2, y2, x3, y3 ], params );
        line[2] = new fabric.Line([ x3, y3, x4, y4 ], params );

        children.group.set({ line: line });
        this.canvas.add( line[0], line[1], line[2] );

    }

    this.updateLines();

};

DT.prototype.moveTree = function ( deltaX, deltaY, scope ) {

    for ( var i = 0, il = scope.nodes.length; i < il; i ++ ) {

        scope.nodes[ i ].group.left += deltaX;
        scope.nodes[ i ].group.top += deltaY;
        scope.nodes[ i ].myleft = scope.nodes[ i ].group.left;
        scope.nodes[ i ].mytop = scope.nodes[ i ].group.top;

        if ( scope.nodes[ i ].group.left < 200 - scope.nodes[ i ].group.width * scope.scale / 2 ||
             scope.nodes[ i ].group.left > scope.canvas.width + scope.nodes[ i ].group.width * scope.scale / 2 ||
             scope.nodes[ i ].group.top < 0 - scope.nodes[ i ].group.height * scope.scale / 2 ||
             scope.nodes[ i ].group.top > scope.canvas.height + scope.nodes[ i ].group.height * scope.scale / 2 ) {

            scope.nodes[ i ].group.visible = false;

            if ( scope.nodes[ i ].group.line ) {
            
                scope.nodes[ i ].group.line[0].visible = false;
                scope.nodes[ i ].group.line[2].visible = false;

            }

        } else {

            scope.nodes[ i ].group.visible = true;

            if ( scope.nodes[ i ].group.line ) {

                scope.nodes[ i ].group.line[0].visible = true;
                scope.nodes[ i ].group.line[2].visible = true;

            }

        }

        if ( scope.nodes[ i ].group.line ) {

            scope.nodes[ i ].group.line[0].set({ x1: scope.nodes[ i ].group.line[0].x1 + deltaX, y1: scope.nodes[ i ].group.line[0].y1 + deltaY, x2: scope.nodes[ i ].group.line[0].x2 + deltaX, y2: scope.nodes[ i ].group.line[0].y2 + deltaY });
            scope.nodes[ i ].group.line[1].set({ x1: scope.nodes[ i ].group.line[1].x1 + deltaX, y1: scope.nodes[ i ].group.line[1].y1 + deltaY, x2: scope.nodes[ i ].group.line[1].x2 + deltaX, y2: scope.nodes[ i ].group.line[1].y2 + deltaY });
            scope.nodes[ i ].group.line[2].set({ x1: scope.nodes[ i ].group.line[2].x1 + deltaX, y1: scope.nodes[ i ].group.line[2].y1 + deltaY, x2: scope.nodes[ i ].group.line[2].x2 + deltaX, y2: scope.nodes[ i ].group.line[2].y2 + deltaY });

        }

        scope.nodes[ i ].group.setCoords();

    }

};

DT.prototype.readOnly = function ( value ) {

    this.leftMenu.setReadOnlyMode( value );

    if ( value ) { 

        this.readOnlyMode = true;
        this.canvas.deactivateAll();

        $('#viewer-edit').hide();
        $('#settings').hide();

    } else {

        this.readOnlyMode = false;
        $('#viewer-edit').show();

        if ( this.loadPercent >= 99 ) {

            $('#settings').css('display', 'flex');

        }

    }

    this.canvas.renderAll();

};

DT.prototype.updateLines = function () {

    if ( this.nodes.length ) {

        var opened = [ this.nodes[0] ];

        while ( opened.length ) {

        var current = opened.pop();

            for ( var i = 0, il = current.children.length; i < il; i ++ ) {

                if ( current.children[ i ] instanceof DT.PageNode ) {

                    opened.push( current.children[ i ] );

                    var opacity = 0;

                    if ( i === 0 || i === ( current.children.length - 1 ) ) {

                        opacity = 1;

                    }

                    if ( current.children[ i ].group.line ) current.children[ i ].group.line[0].set({ opacity: opacity });
                    if ( current.children[ i ].group.line ) current.children[ i ].group.line[1].set({ opacity: opacity });

                }

            }

        }

    }

};

DT.prototype.recountNodesWidth = function ( newParent, oldParent, animation ) {

    var parent = newParent;

    this.canvas.stateful = false;

    while ( parent ) {

        var mywidth = 0;
        var left = 0;

        for ( var i = 0, il = parent.children.length; i < il; i ++ ) {

            if ( parent.children[ i ] ) {

                mywidth += parent.children[ i ].group.get('mywidth');

            }

        }

        parent.group.set({ mywidth: Math.max( mywidth, parent.group.get( 'width' ) * this.scale * 1.2 ) }); //  when get width item(0) remove, potentionally bug

        if ( parent == this.nodes[0] ) {

            parent.group.set({ mywidth: mywidth });

        }

        parent = parent.parent;

    }

    parent = oldParent;

    while ( parent ) {

        var mywidth = 0;
        var left = 0;

        for ( var i = 0, il = parent.children.length; i < il; i ++ ) {

            if ( parent.children[ i ] ) {

                mywidth += parent.children[ i ].group.get( 'mywidth' );

            }

        }

        parent.group.set({ mywidth : Math.max( mywidth, parent.group.item(0).get( 'width' ) * this.scale * 1.2 ) });

        if ( parent == this.nodes[0] ) {

            parent.group.set({ mywidth : mywidth });

        }

        parent = parent.parent;

    }

    this.nodes[0].group.mywidth += this.nodes[0].children.length * this.MAINPAGENODE_MARGIN * this.scale;
    this.treeChanges = true;

    while ( this.treeChanges ) {

        this.treeChanges = false;
        this.updateNodePositions( this.nodes[0] );

    }

    if ( animation ) {

        for ( var i = 1; i < this.nodes.length; i ++ ) {

            if ( this.nodes[ i ].mytop !== this.nodes[ i ].group.get('top') || this.nodes[ i ].myleft !== this.nodes[i].group.get('left') ) {

                this.nodes[ i ].group.animate({ top: this.nodes[ i ].mytop, left: this.nodes[ i ].myleft }, {
                    duration: this.animDuration
                });

            }

            if ( this.nodes[ i ].mytop !== this.nodes[ i ].group.get('top') ||
                 this.nodes[ i ].myleft !== this.nodes[ i ].group.get('left') ||
                 this.nodes[ i ].group.get('line')[0].get('x1') !== this.nodes[ i ].parent.myleft ) {

                var x1 = this.nodes[ i ].parent.myleft;
                var y1 = this.nodes[ i ].parent.mytop + this.nodes[ i ].parent.group.get('height') * this.scale / 2;
                var x2 = this.nodes[ i ].parent.myleft;
                var y2 = this.nodes[ i ].parent.mytop + this.nodes[ i ].parent.group.get('height') * this.scale / 2 + this.NODE_MARGIN_TOP / 2;
                var x3 = this.nodes[ i ].myleft;
                var y3 = this.nodes[ i ].parent.mytop + this.nodes[ i ].parent.group.get('height') * this.scale / 2 + this.NODE_MARGIN_TOP / 2;
                var x4 = this.nodes[ i ].myleft;
                var y4 = this.nodes[ i ].mytop - this.nodes[i].group.get('height') * this.scale / 2; 

                this.nodes[ i ].group.line[0].animate({ x1: x1, y1: y1, x2: x2, y2: y2 + 1 * this.scale }, { duration: this.animDuration });
                this.nodes[ i ].group.line[0].set({ opacity: 1 });

                this.nodes[ i ].group.line[1].animate({ x1: x2, y1: y2, x2: x3, y2: y3 }, { duration: this.animDuration });
                this.nodes[ i ].group.line[1].set({ opacity: 1 });

                this.nodes[ i ].group.line[2].animate({ x1: x3, y1: y3 - 1 * this.scale, x2: x4, y2: y4 }, { duration: this.animDuration });
                this.nodes[ i ].group.line[2].set({ opacity: 1 });

            }

        };

        this.nodes[0].group.animate({ top: this.nodes[0].mytop, left: this.nodes[0].myleft }, {
            onChange: this.canvas.renderAll.bind( this.canvas ),
            duration: this.animDuration
        });

    } else {

        this.nodes[0].group.set({ top: this.nodes[0].mytop, left: this.nodes[0].myleft });

        for ( var i = 1; i < this.nodes.length; i++ ) {

            if ( this.nodes[ i ].mytop !== this.nodes[i].group.get('top') || this.nodes[ i ].myleft !== this.nodes[ i ].group.get('left') ) {

                this.nodes[ i ].group.set({ top: this.nodes[ i ].mytop, left: this.nodes[ i ].myleft });
                this.nodes[ i ].group.setCoords();
                this.paintLine( this.nodes[ i ], this.nodes[ i ].parent, false );

            }

            if (  this.nodes[ i ].group.get('line')[0].get('x1') !== this.nodes[ i ].parent.myleft ) {

                this.paintLine( this.nodes[ i ], this.nodes[ i ].parent, false );

            }

        };

        this.canvas.deactivateAll().renderAll();

    }

    this.canvas.stateful = true;
    setTimeout( this.updateTreeHeight.bind( this ), this.animDuration );

    this.updateLines();

};

DT.prototype.updateTreeHeight = function () {

    var height = 0;

    for ( var i = 0, il = this.nodes.length; i < il; i ++ ) {

        if ( this.nodes[ i ].mytop + this.nodes[ i ].group.height / 2  > height ) {

            height = this.nodes[ i ].mytop + this.nodes[ i ].group.height / 2 * this.scale;

        }

    };

    this.treeHeight = Math.max( this.nodes[0].group.height * 20 * this.scale, height - this.nodes[0].mytop + this.nodes[0].group.height / 2 * this.scale );
    var top = this.leftMenu.slider.get('top') * ( ( this.canvas.height - 75 ) / this.treeHeight * this.scale ) / this.leftMenu.slider.sliderCoff;
    this.leftMenu.slider.sliderCoff = ( this.canvas.height - 75 ) / this.treeHeight * this.scale;

    if ( top > 192 ) {

        this.leftMenu.slider.set({ top: 192 });

    } else if ( top < 136 ) {

        this.leftMenu.slider.set({ top: 136 }); 

    } else {

        this.leftMenu.slider.set({ top: top });

    }

    this.leftMenu.zoomIt( this.leftMenu.slider.sliderCoff * 266 / this.leftMenu.slider.top );
    this.leftMenu.slider.setCoords();

};

DT.prototype.updateNodePositions = function ( node ) {

    var left = node.myleft - node.group.get('mywidth') / 2;
    var children = node.children;

    if ( this.nodes[0] == node ) {

        for ( var i = 0, il = children.length; i < il; i ++ ) {

            var child = children[ i ];

            if ( child.myleft !== left + ( child.group.get('mywidth') + this.MAINPAGENODE_MARGIN * this.scale ) / 2 ||
                 child.mytop !== node.mytop + ( node.group.get('height') + child.group.get('height') ) / 2 * this.scale + this.NODE_MARGIN_TOP ) {

                this.treeChanges = true;
                child.myleft = left + ( child.group.get('mywidth') + this.MAINPAGENODE_MARGIN * this.scale ) / 2;
                child.mytop = node.mytop + ( node.group.get('height') + child.group.get('height') ) / 2 * this.scale + this.NODE_MARGIN_TOP;

            }

            left += child.group.get( 'mywidth' ) + this.MAINPAGENODE_MARGIN * this.scale;
            this.updateNodePositions( node.children[ i ] );

        }

    } else {

        if ( children.length === 1 ) {

            var child = node.children[0];
            if ( child.myleft !== node.myleft || child.mytop !== node.mytop + ( node.group.get('height') + child.group.get('height') ) / 2 * this.scale + this.NODE_MARGIN_TOP ) {

                this.treeChanges = true;
                child.myleft = node.myleft;
                child.mytop = node.mytop + ( node.group.get('height') + child.group.get('height') ) / 2 * this.scale + this.NODE_MARGIN_TOP;

            }

            this.updateNodePositions( child );

        } else {

            for ( var i = 0, il = children.length; i < il; i ++ ) {

                var child = children[ i ];

                if ( child.myleft !== left + child.group.get('mywidth') / 2 || child.mytop !== node.mytop + ( node.group.get('height') + child.group.get('height') ) / 2 * this.scale + this.NODE_MARGIN_TOP ) {

                    this.treeChanges = true;
                    child.myleft = left + child.group.get('mywidth') / 2;
                    child.mytop = node.mytop + ( node.group.get('height') + child.group.get('height') ) / 2 * this.scale + this.NODE_MARGIN_TOP;

                }

                left += child.group.get( 'mywidth' );
                this.updateNodePositions( node.children[ i ] );

            }
        }

    }

};

DT.prototype.getNodeById = function ( id ) {

    for ( var i = 0, il = this.nodes.length; i < il; i ++ ) {

        if ( this.nodes[ i ].id === id ) return this.nodes[ i ];

    }

    return false;

};

DT.prototype.homeNodeRepaint = ( function () {

    var timeoutId;

    return function () {

        var scope = this;

        clearInterval( scope.savedTimer );
        // $('#banner .status').text('Saving changes');
        // $('#banner .status').css('color', 'green');

        clearTimeout( timeoutId );

        timeoutId = setTimeout( function () {

            var div = document.createElement('div');
            div = $('#curbanner').clone().appendTo( document.body );
            $(div).css({
                'display':      'flex',
                'width':        '427px',
                'position':     'static',
                'margin-left':  '500px',
                'margin-top':   '1000px',
                'border':       '0px;',
                'transform':    'scale(2.34,2.34)'
            });

            html2canvas( div, {

                letterRendering: true,
                height: 150,
                width: 1000,
                onrendered: function ( canvas ) {

                    $( div ).remove();

                    var width = scope.nodes[0].group.width;
                    var height = scope.nodes[0].group.height;

                    scope.nodes[0].group.remove( scope.nodes[0].group.item(1) );
                    $('#set_title .image').css( 'background-image', 'url(' + canvas.toDataURL() + ')' );

                    fabric.Image.fromURL( canvas.toDataURL(), function ( oImg ) {

                        scope.nodes[0].group.add( oImg );
                        oImg.set({ rx: 5, ry: 5, left: 0, top: 0 });
                        scope.canvas.renderAll();

                    });

                }

            });

            $.post( HOST + '/api/tree/updateHome', { title: $('#title_input .website_inputs').val(), subTitle: $('#subtitle_input .website_inputs').val(), hash: localStorage.getItem('hash'), email: localStorage.getItem('email'), siteId: localStorage.getItem('siteId') }, function ( data ) {

                if ( data.success === 1 ) {

                    // $('#banner .status').text('Changes Saved');
                    // $('#banner .status').css('color', 'green');

                    scope.savedTimer = setTimeout( function () {

                        $('#banner .status').fadeOut( 'slow', function () {

                            // $('#banner .status').text('');
                            // $('#banner .status').show();

                        });

                    }, 3000 );

                }

            });

        }, 1000 );

    };

}) ();

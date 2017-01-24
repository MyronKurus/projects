/*
 * Page Node class
 */

DT.PageNode = function ( tree, left, top, text ) {

    this.text = text || 'New Branch';

    DT.Node.call( this, tree, left, top, this.text, 180, false, DT.PageNode.bgColor, DT.PageNode.textColor );
    this.nodeType = 'PageNode';

    //

    this.init();

};

DT.PageNode.prototype = Object.create( DT.Node.prototype );

DT.PageNode.prototype.init = function () {

    if ( ! app.dendoTree.readOnlyMode ) { // need to change this

        this.cursor = 'text';
        this.group.set({ hoverCursor: 'text' });

    } else {

        this.cursor = 'default';
        this.group.set({ hoverCursor: 'default' });

    }

};

DT.PageNode.makeMainPage  = function ( node ) {

    node.nodeType = 'MainPageNode';

    // node.group.set({mywidth: 400});

    return true;

};

DT.PageNode.makeSubPage = function ( node ) {

    node.nodeType = 'SubPageNode';

    // node.group.set({mywidth: 150});

    return true;

};

DT.PageNode.makeEditable = function ( node ) {

    var scope = node.node.tree;

    var ungroup = function ( group ) {

        group.item(1).set({ visible : false });
        scope.canvas.renderAll();

    };

    node.on( 'mouseup', function ( e ) {  // old event object:dblclick;

        if ( ! node.active ) return;

        ungroup( node );
        node.line[0].set({ opacity: 1 });
        node.line[1].set({ opacity: 1 });
        node.line[2].set({ opacity: 1 });

        var dimensionText = new fabric.IText( this.node.text, {
            backgroundColor: '#fff',
            fill: node.item(1).get('fill'),
            fontSize: node.item(1).get('fontSize') * scope.scale,
            originX: 'center',
            originY: 'center',
            fontFamily: 'Verdana',
            top: node.get( 'top' ),
            left: node.get( 'left' ),
            width: 50
        });

        scope.canvas.add( dimensionText );

        dimensionText.on( 'editing:exited', function () {

            node.node.text = this.get( 'text');
            node.item(1).set({ text : this.get( 'text').substring( 0, 22 ) });
            node.item(1).set({ visible : true });
            scope.canvas.remove( dimensionText );

            for ( i in scope.elements ) {

                scope.elements[ i ].bringToFront();

            }

            scope.saveTree();

        });

        //

        dimensionText.on( 'changed', function( e ) {

            if ( this.get('height') > this.__lineHeights[0] * 1.2 ) {

                this.set({ text : this.get('text').replace( '\n', '' ) });
                this.moveCursorLeft(e);
                dimensionText.trigger( "editing:exited" );

            }

            this.canvas.renderAll();

        });

        scope.canvas.setActiveObject( dimensionText );
        dimensionText.enterEditing();
        dimensionText.selectAll();

    });

};

DT.PageNode.bgColor = '#fff';
DT.PageNode.textColor = '#000';

DT.PageNode.count = 0;

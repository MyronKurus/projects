/*
 * Tree import / export functions
*/

DT.prototype.export = function () {

    var result = {};

    console.log( 'export ' + new Date() );

    result.meta = {
        zoom:           this.scale,
        sliderTop:      this.leftMenu.slider.get('top'),
        sliderCoff:     this.leftMenu.slider.sliderCoff,
        nodesCount:     this.nodes.length,
        title:          $('#title_input .website_inputs').val(),
        subTitle:       $('#subtitle_input .website_inputs').val(),
        imagesParams:   this.imagesParams
    };

    result.content = {};

    for ( var i = 0, il = this.nodes[0].children.length; i < il; i ++ ) {

        var tempMP = this.nodes[0].children[ i ]; // temp Main Page
        result.content[ tempMP.id ] = { title: tempMP.text, order: i };

        if ( tempMP.children[0] && tempMP.children[0].nodeType === 'SubPageNode' ) {

            result.content[ tempMP.id ].pages = {};

            for ( var j = 0, jl = tempMP.children.length; j < jl; j ++ ) {

                var tempSP = tempMP.children[ j ];
                result.content[ tempMP.id ].pages[ tempSP.id ] = { title: tempSP.text, content: [], order: j };
                var tempNode = tempSP.children[0];

                while ( tempNode ) {

                    result.content[ tempMP.id ].pages[ tempSP.id ].content.push( tempNode.toJSON() );
                    tempNode = tempNode.children[0];

                }

            }

        } else if ( tempMP.children[0] && ( tempMP.children[0].nodeType === 'ImageNode' || tempMP.children[0].nodeType === 'BlogNode' ) ) {

            result.content[ tempMP.id ].content = [];
            result.content[ tempMP.id ].pages = {};
            var tempNode = tempMP.children[0];

            while ( tempNode ) {

                result.content[ tempMP.id ].content.push( tempNode.toJSON() );
                tempNode = tempNode.children[0];

            }

        }

    }

    return JSON.stringify( result );

};

DT.prototype.import = function ( data, callback ) {

    var scope = this;

    this.loadPercent = 0;
    this.canvas.stateful = false;

    this.callback = callback;

    this.scale = data.meta.zoom;
    this.NODE_MARGIN_TOP = 35 * this.scale;
    this.leftMenu.slider.set({ top: data.meta.sliderTop, sliderCoff: data.meta.sliderCoff });
    nodesCount = data.meta.nodesCount;
    scope.imagesParams = data.meta.imagesParams;

    var deltaY = 50 - data.meta.posY;
    var deltaX = ( window.innerWidth + scope.leftMenu.background.width ) / 2 - data.meta.posX;

    this.nodes = [];

    var node;
    node = new DT.Node( scope, ( window.innerWidth + scope.leftMenu.background.width ) / 2, 68, 'HOME', 1000, 150, '#fff' );
    node.nodeType = 'HOME';
    node.group.item(0).set({ width: 1000 });
    node.group.item(1).set({ fill : '#000' });
    this.nodes.push( node );
    node.cursor = 'default';
    node.group.set({ hoverCursor: 'default', selectable: false });
    node.mytop = node.group.top;
    node.myleft = node.group.left;
    node.group.set({  scaleX: this.scale, scaleY: this.scale, mywidth: 120 * 1.2 * scope.scale });
    node.group.setCoords();
    scope.canvas.add( node.group );
    node.tree = scope;

    scope.loading( 'nodes', nodesCount );

    data.order = [];

    for ( var i = 0, il = Object.keys( data.content ).length; i < il; i ++ ) {

        for ( var tempMP in data.content ) {

            if ( data.content[ tempMP ].order == i ) {

                data.order.push( tempMP );
                break;

            }

        }

    }

    for ( var i = 0, il = data.order.length; i < il; i ++ ) {

        var tempMP = data.order[ i ];

        setTimeout( function ( i, tempMP ) {

            var node = new DT.PageNode( scope, 750, 125, data.content[ tempMP ].title.substring( 0, 15 ) );
            node.text = data.content[ tempMP ].title;
            node.id = tempMP;

            scope.nodes.push( node );
            scope.canvas.add( node.group );
            node.tree = scope;
            scope.loading( 'nodes', nodesCount );

            node.parent = scope.nodes[0];
            scope.nodes[0].children.push( node );

            node.group.set({ scaleX: scope.scale, scaleY: scope.scale });
            node.group.setCoords();

            node.group.movingProxyHandler = function ( event ) { DT.Node.paintLineHandler.call( this, event, scope ); };
            node.group.on( 'moving', node.group.movingProxyHandler );

            node.group.modifiedProxyHandler = function ( event ) { DT.Node.nodeModifiedHandler.call( this, event, scope ); };
            node.group.on( 'modified', node.group.modifiedProxyHandler );

            node.group.selectedProxyHandler = function ( event ) { DT.Node.selectedHandler.call( this, event, scope ); };
            node.group.on( 'selected', node.group.selectedProxyHandler );

            if ( Object.keys( data.content[ tempMP ].pages ).length === 0  ) {

                node.group.set( 'mywidth', 180 * 1.2 * scope.scale );

            } else {

                node.group.set( 'mywidth', 180 * 1.2 * scope.scale * Object.keys( data.content[ tempMP ].pages ).length );

            }

            if ( data.content[ tempMP ].content ) {

                scope.importBlogImageNodes( node, data.content[ tempMP ].content );

            }

            if ( Object.keys( data.content[ tempMP ].pages ).length > 0 ) {

                var parent = node;
                var childrens = data.content[ tempMP ].pages;

                data.content[ tempMP ].order = [];

                for ( var j = 0, jl = Object.keys( data.content[ tempMP ].pages ).length; j < jl; j ++ ) {

                    for ( var tempSP in data.content[ tempMP ].pages ) {

                        if ( data.content[ tempMP ].pages[ tempSP ].order === j ) {

                            data.content[ tempMP ].order.push( tempSP );
                            break;

                        }

                    }

                }

                for ( var j = 0, jl = data.content[ tempMP ].order.length; j < jl; j ++ ) {

                    var tempSP = data.content[ tempMP ].order[ j ];
                    node = new DT.PageNode( scope, 750, 125, childrens[ tempSP ].title.substring( 0, 12 ) );
                    node.text = childrens[ tempSP ].title;

                    node.id = tempSP;

                    scope.nodes.push( node );
                    scope.canvas.add( node.group );
                    node.dendoTree = scope;
                    scope.loading( 'nodes', nodesCount );

                    node.parent = parent;
                    parent.children.push( node );

                    node.group.set({ scaleX: scope.scale, scaleY: scope.scale });
                    node.group.setCoords();

                    node.group.movingProxyHandler = function ( event ) { DT.Node.paintLineHandler.call( this, event, scope ); };
                    node.group.on( 'moving', node.group.movingProxyHandler );

                    node.group.modifiedProxyHandler = function ( event ) { DT.Node.nodeModifiedHandler.call( this, event, scope ); };
                    node.group.on( 'modified', node.group.modifiedProxyHandler );

                    node.group.selectedProxyHandler = function ( event ) { DT.Node.selectedHandler.call( this, event, scope ); };
                    node.group.on( 'selected', node.group.selectedProxyHandler );

                    node.group.set( 'mywidth', node.group.width * 1.2 * scope.scale );

                    if ( childrens[ tempSP ].content ) {

                        scope.importBlogImageNodes( node, childrens[ tempSP ].content );

                    }

                }

            }

        }, 100 * i, i, tempMP );

    };

    //

    var timer = setInterval( function () {

        if ( scope.loadPercent >= 99 ) {

            clearInterval( timer );

            // Home node repaint & settings menu init

            $('#title_input input')[0].value = data.meta.title;
            $('#curbanner .title').html( $('#title_input input')[0].value );
            $('#title_input .website_title_bottom_label').html( (30 - $('#title_input input')[0].value.length) + ' characters left' );
            $('#subtitle_input input')[0].value = data.meta.subTitle;
            $('#curbanner .subtitle').html( $('#subtitle_input input')[0].value );
            $('#subtitle_input .website_title_bottom_label').html( (50 - $('#subtitle_input input')[0].value.length) + ' characters left' );

            scope.homeNodeRepaint();

            if ( ! scope.readOnlyMode ) {

                $('#settings').css('display', 'flex');

            }

            for ( var i = 0, il = scope.nodes[0].children.length; i < il; i ++ ) {

                DT.PageNode.makeMainPage( scope.nodes[0].children[ i ] );

                if ( ! scope.readOnlyMode ) {

                    DT.PageNode.makeEditable( scope.nodes[0].children[ i ].group );

                }

                for ( var j = 0, jl = scope.nodes[0].children[ i ].children.length; j < jl; j ++ ) {

                    if ( scope.nodes[0].children[ i ].children[ j ].nodeType === 'PageNode' ) {

                        DT.PageNode.makeSubPage( scope.nodes[0].children[ i ].children[ j ] );  

                        if ( ! scope.readOnlyMode ) {

                            DT.PageNode.makeEditable( scope.nodes[0].children[ i ].children[ j ].group );

                        }

                    }

                };

            };

            //

            for ( var i = 1, il = scope.nodes.length; i < il; i ++ ) {

                scope.paintLine( scope.nodes[ i ], scope.nodes[ i ].parent, false );

            }

            for ( var i in scope.leftMenu.elements ) {

                scope.leftMenu.elements[ i ].bringToFront();
                scope.loading( 'menu', scope.leftMenu.elements.length );

            }

            scope.canvas.renderAll();
            scope.canvas.stateful = true;
            scope.recountNodesWidth( scope.nodes[0] );
            scope.timer = ( new Date() - scope.timer ) / 1000;

            if ( window.location.pathname.indexOf( 'general' ) >= 0 ) {

                $('.account h3 span').css( 'opacity', '0');
                $('.engines h3 span').css( 'opacity', '0');
                $('.prof-data h3 span').css( 'opacity', '0');

                $('#set_leftBar').addClass('opened');
                $('#bd-wrapper').hide();
                $('#set_body').show();

                $('body').addClass('overflow');

                $('#leftBarGeneral').addClass('selectedLeftBarItem');
                $('#leftBarCustomization').removeClass('selectedLeftBarItem');
                $('#leftBarSearch').removeClass('selectedLeftBarItem'); 
                $('#leftBarYourData').removeClass('selectedLeftBarItem');

                $('#set_General').show();
                $('#set_Customization').hide();
                $('#set_Search').hide();
                $('#user_Data').hide();

                app.ui.settingsMenu.setValues();

            }

            if ( window.location.pathname.indexOf( 'customization' ) >= 0 ) {

                $('#set_leftBar').addClass('opened');
                $('#set_leftBar').addClass('opened');
                $('#bd-wrapper').hide();
                $('#set_body').show();

                $('#set_Customization #banner' ).addClass('open');
                $('#custom_body').show();

                $('body').addClass('overflow');

                $('#leftBarGeneral').removeClass('selectedLeftBarItem');
                $('#leftBarCustomization').addClass('selectedLeftBarItem');
                $('#leftBarSearch').removeClass('selectedLeftBarItem'); 
                $('#leftBarYourData').removeClass('selectedLeftBarItem');

                $('#set_General').hide();
                $('#set_Customization').show();
                $('#set_Search').hide();
                $('#user_Data').hide();

            }

            if ( window.location.pathname.indexOf( 'sharing' ) >= 0 ) {

                $('.account h3 span').css( 'opacity', '0');
                $('.engines h3 span').css( 'opacity', '0');
                $('.prof-data h3 span').css( 'opacity', '0');

                $('#set_leftBar').addClass('opened');
                $('#set_leftBar').addClass('opened');
                $('#bd-wrapper').hide();
                $('#set_body').show();

                $('body').addClass('overflow');

                $('#leftBarGeneral').removeClass('selectedLeftBarItem');
                $('#leftBarCustomization').removeClass('selectedLeftBarItem');
                $('#leftBarSearch').addClass('selectedLeftBarItem'); 
                $('#leftBarYourData').removeClass('selectedLeftBarItem');

                $('#set_General').hide();
                $('#set_Customization').hide();
                $('#set_Search').show();
                $('#user_Data').hide();

                app.ui.settingsMenu.setValues();

            }

            if ( window.location.pathname.indexOf( 'user_data' ) >= 0 ) {

                $('.account h3 span').css( 'opacity', '0');
                $('.engines h3 span').css( 'opacity', '0');
                $('.prof-data h3 span').css( 'opacity', '0');

                $('#set_leftBar').addClass('opened');
                $('#set_leftBar').addClass('opened');
                $('#bd-wrapper').hide();
                $('#set_body').show();

                $('body').addClass('overflow');

                $('#leftBarGeneral').removeClass('selectedLeftBarItem');
                $('#leftBarCustomization').removeClass('selectedLeftBarItem');
                $('#leftBarSearch').removeClass('selectedLeftBarItem');
                $('#leftBarYourData').addClass('selectedLeftBarItem');

                $('#set_General').hide();
                $('#set_Customization').hide();
                $('#set_Search').hide();
                $('#user_Data').show();

                app.ui.settingsMenu.setValues();

            }

            if ( window.location.pathname[1] >= '0' && window.location.pathname[1] <= '9' ) {

                var nodeId = + window.location.pathname.split('/')[1];
                var tempNode = scope.getNodeById( nodeId );

                $('#canvas-disable').show();

                setTimeout( function () {

                    tempNode.view.call( tempNode );

                }, scope.animDuration * 1.5 );

            }

            scope.loadImages();
            scope.loadImages();
            scope.loadImages();
            scope.loadImages();
            scope.loadImages();

        }

    }, 100 );

};

DT.prototype.importBlogImageNodes = function ( parent, childrens ) {

    var scope = this;

    for ( var i = 0, il = childrens.length; i < il; i ++ ) {

        if ( childrens[ i ].type === 'image' ) {

            var id = + childrens[ i ].id;
            var node = new DT.ImageNode( scope );

            this.loadImagesArray.push( { node: node, url: '/img/' + localStorage.getItem( 'siteId' ) + '/0/' + id + '.jpg?w=100&h=100' } );

            node.setText( 'Loading' );
            node.id = + childrens[ i ].id;
            node.title = childrens[ i ].title;
            node.innerHTML = childrens[ i ].text;
            node.watermarkType = childrens[ i ].watermarkType || 0;

            if ( scope.imagesParams[ node.id ] ) {

                node.size = {
                    height: scope.imagesParams[ node.id ].height,
                    width:  scope.imagesParams[ node.id ].width
                };

            } else {

                node.size = {
                    height: 200,
                    width: 200
                };

            }

            node.parent = parent;
            parent.children.push( node );
            parent = node;

            node.setSize( null, 120 );

        } else if ( childrens[ i ].type === 'blog' ) {

            var id = + childrens[ i ].id;
            node = new DT.BlogNode( scope, 750, 125, ' ' + childrens[ i ].id + ' ' );
            node.id = childrens[ i ].id;

            this.loadImagesArray.push( { node: node, url: '/img/' + localStorage.getItem( 'siteId' ) + '/0/' + id + '&w=100&h=100' } );

            node.setText( 'Loading' );
            node.title = childrens[ i ].title;
            node.image = childrens[ i ].image;
            node.innerHTML = childrens[ i ].text;

            node.parent = parent;
            parent.children.push( node );
            parent = node;

        }

        this.nodes.push( node );
        scope.canvas.add( node.group );
        node.dendoTree = scope;
        scope.loading( 'nodes', nodesCount );

        node.group.set({ scaleX: this.scale, scaleY: this.scale, mywidth: 120 * 1.2 * scope.scale });
        node.group.setCoords();

        node.group.movingProxyHandler = function ( event ) { DT.Node.paintLineHandler.call( this, event, scope ); };
        node.group.on( 'moving', node.group.movingProxyHandler );

        node.group.modifiedProxyHandler = function ( event ) { DT.Node.nodeModifiedHandler.call( this, event, scope ); };
        node.group.on( 'modified', node.group.modifiedProxyHandler );

        node.group.selectedProxyHandler = function ( event ) { DT.Node.selectedHandler.call( this, event, scope ); };
        node.group.on( 'selected', node.group.selectedProxyHandler );

    }

};

DT.prototype.loadImages = function () {

    $('#preloader').hide();
    $('canvas').show();

    var image = this.loadImagesArray.shift();

    if ( image ) {

        image.node.setImage( image.url );

    }

};

DT.prototype.loading = function ( flag, count ) {

    if ( flag === 'nodes' ) this.loadPercent += 100 / count;
    $('#preloader').text( 'Loading..  ' + Math.floor( this.loadPercent ) + '%' );

    if ( this.loadPercent >= 99 && this.callback ) {

        this.callback();

    }

};

DT.prototype.saveTree = function ( callback ) {

    app.services.saveTree({ tree: this.export() }, function ( data ) {

        if ( callback ) callback();

    });

};

DT.prototype.saveNode = function ( node, callback ) {

    app.services.saveNode({ 
        id: node.id, 
        type: node.nodeType.split('Node')[0].toLowerCase(), 
        title: node.title,
        innerHTML: node.innerHTML,
        watermarkType: node.watermarkType 
    }, function ( data ) {

        if ( callback ) callback();

    });

};

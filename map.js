// MAP
function map() {
  var margin = {
  	top: 20,
  	right: 50,
  	bottom: 30,
  	left: 20
  };

  var rXPlus = [ 1, 2.1, 2.3, 2.2, 3.1, 3.2, 12 ];
  var rYPlus = [ 2.1, 9.3, 4, 7, 11, 14 ];
  var rDiag = [ 2.1, 2.3, 9.1, 9.3 ]

  var areaStrokeWidth = 8;
  var outlineStrokeWidth = 12;
  var pointRadius = 13.5;
  var polyPointDist = 0.02;

  var outlineColor = '#505050';

  var mapXScale = 250;
  var mapYRatio = 1;
  var mapYScale = ( mapXScale * mapYRatio );

  var mapHorizMargin = 100;
  var mapVertMargin = 200;

  function scaleX( rawX ) {
  	return ( rawX * mapXScale ) + mapHorizMargin;
  };

  function scaleY( rawY ) {
  	return ( rawY * mapYScale ) + mapVertMargin;
  };
  var selectableElements = d3.select(null),
    dispatcher;

    var streetLabels = [ {
    		name: 'Tremont St.',
    		x: 0.5,
    		y: -0.1,
    		transform: null
    	},
    	{
    		name: 'Shawmut Ave.',
    		x: 0.5,
    		y: 2.1,
    		transform: null
    	},
    	{
    		name: 'W. Springfield St.',
    		x: 1.1,
    		y: 1,
    		transform: 'rotate(90,' + scaleX( 1.1 ) + ',' + scaleY( 1 ) + ')'
    	},
    	{
    		name: 'Northampton St.',
    		x: -0.1,
    		y: 1.0,
    		transform: 'rotate(-90,' + scaleX( -0.1 ) + ',' + scaleY( 1 ) + ')'
    	},
    	{
    		name: 'Mass. Ave.',
    		x: 0.57,
    		y: 0.25,
    		transform: 'rotate(90,' + scaleX( 0.57 ) + ',' + scaleY( 0.25 ) + ')'
    	},
    	{
    		name: 'Mass. Ave.',
    		x: 0.43,
    		y: 1.75,
    		transform: 'rotate(-90,' + scaleX( 0.43 ) + ',' + scaleY( 1.75 ) + ')'
    	},
    	{
    		name: 'Chester Sq.',
    		x: 0.77,
    		y: 1,
    		transform: 'rotate(90,' + scaleX( 0.77 ) + ',' + scaleY( 1 ) + ')'
    	},
    	{
    		name: 'Chester Sq.',
    		x: 0.22,
    		y: 1,
    		transform: 'rotate(-90,' + scaleX( 0.22 ) + ',' + scaleY( 1 ) + ')'
    	}
    ]

    var colorScale = d3.scaleLinear()
    	.domain( [ 0, 0.5, 1 ] )
    	.range( [ 'green', 'white', 'red' ] );

  function chart(selector, data) {
    let mapSvg = d3.select(selector)
     .append("svg")
       .attr("preserveAspectRatio", "xMidYMid meet")
       .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
       .classed("svg-content", true);

   mapSvg = mspSvg.append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function drawIntersections( intersections, strokeWidth ) {
    	mapSvg.selectAll( '.intersection' )
    		.data( intersections )
    		.enter()
    		.append( 'rect' )
    		.attr( 'class', 'intersection' )
    		.attr( 'fill', outlineColor )
    		.attr( 'x', function( d ) {
    			return scaleX( d.x - polyPointDist ) - ( strokeWidth * 0.5 );
    		} )
    		.attr( 'y', function( d ) {
    			return scaleY( d.y - polyPointDist ) - ( strokeWidth * 0.5 );
    		} )
    		.attr( 'width', strokeWidth * ( 11 / 6 ) )
    		.attr( 'height', strokeWidth * ( 11 / 6 ) );
    };

    function drawSegments( segments, strokeWidth, isParkingArea ) {
    	var className = ( isParkingArea ? 'fill' : 'outline' );
    	mapSvg.selectAll( className )
    		.data( segments )
    		.enter()
    		.append( 'line' )
    		.attr( 'class', className )
    		.attr( 'stroke-width', strokeWidth )
    		.attr( 'stroke', outlineColor )
    		.attr( 'x1', function( d ) {
    			return scaleX( d.x1 );
    		} )
    		.attr( 'y1', function( d ) {
    			return scaleY( d.y1 );
    		} )
    		.attr( 'x2', function( d ) {
    			return scaleX( d.x2 );
    		} )
    		.attr( 'y2', function( d ) {
    			return scaleY( d.y2 );
    		} )
    };

    function labelStreets() {
    	for ( street of streetLabels ) {
    		mapSvg.append( 'text' )
    			.attr( 'x', scaleX( street.x ) )
    			.attr( 'y', scaleY( street.y ) )
    			.text( street.name )
    			.attr( 'transform', street.transform )
    			.attr( 'text-anchor', 'middle' )
    			.attr( 'font-family', 'sans-serif' )
    			.attr( 'font-size', '10px' )
    			.attr( 'fill', outlineColor );
    	}
    }

    mapSvg.append( 'text' )
    	.attr( 'x', scaleX( -0.2 ) )
    	.attr( 'y', scaleY( -0.23 ) )
    	.text( 'Street Occupancy Map' )
    	.attr( 'font-family', 'sans-serif' )
    	.attr( 'font-size', '20px' )
    	.attr( 'fill', 'black' );

    mapSvg.append( 'text' )
    	.attr( 'x', scaleX( -0.2 ) )
    	.attr( 'y', scaleY( -0.70 ) )
    	.text( 'Survey Time' )
    	.attr( 'font-family', 'sans-serif' )
    	.attr( 'font-size', '20px' )
    	.attr( 'fill', 'black' );

    d3.csv( './data/intersections_data.csv' )
    	.then( function( intersections_data ) {
    		var intersections = intersections_data;
    		d3.csv( './data/segments_data.csv' )
    			.then( function( segments_data ) {
    				segments_data.forEach( function( d ) {

    					var mult = ( ( rDiag.includes( +d[ 'Segment Number' ] ) ) ? 0.7 : 1 );
    					var polyPointOffset = polyPointDist * mult;

    					if ( d[ 'Street Side' ] === 'R' ) {
    						if ( rXPlus.includes( +d[ 'Segment Number' ] ) ) {
    							d.x1 = ( +d.x1 ) + polyPointOffset;
    							d.x2 = ( +d.x2 ) + polyPointOffset;
    						} else {
    							d.x1 = ( +d.x1 ) - polyPointOffset;
    							d.x2 = ( +d.x2 ) - polyPointOffset;
    						}
    					} else {
    						if ( rXPlus.includes( +d[ 'Segment Number' ] ) ) {
    							d.x1 = ( +d.x1 ) - polyPointOffset;
    							d.x2 = ( +d.x2 ) - polyPointOffset;
    						} else {
    							d.x1 = ( +d.x1 ) + polyPointOffset;
    							d.x2 = ( +d.x2 ) + polyPointOffset;
    						}
    					};

    					if ( d[ 'Street Side' ] === 'R' ) {
    						if ( rYPlus.includes( +d[ 'Segment Number' ] ) ) {
    							d.y1 = ( +d.y1 ) + polyPointOffset;
    							d.y2 = ( +d.y2 ) + polyPointOffset;
    						} else {
    							d.y1 = ( +d.y1 ) - polyPointOffset;
    							d.y2 = ( +d.y2 ) - polyPointOffset;
    						}
    					} else {
    						if ( rYPlus.includes( +d[ 'Segment Number' ] ) ) {
    							d.y1 = ( +d.y1 ) - polyPointOffset;
    							d.y2 = ( +d.y2 ) - polyPointOffset;
    						} else {
    							d.y1 = ( +d.y1 ) + polyPointOffset;
    							d.y2 = ( +d.y2 ) + polyPointOffset;
    						}
    					}
    				} );

    				var botSegments = segments_data.filter( function( d ) {
    					return !( [ 3.1, 10.1 ].includes( +d[ 'Segment Number' ] ) )
    				} );

    				drawSegments( botSegments, outlineStrokeWidth, false );
    				drawSegments( botSegments, areaStrokeWidth, true );

    				var topSegments = segments_data.filter( function( d ) {
    					return [ 3.1, 10.1 ].includes( +d[ 'Segment Number' ] )
    				} );

    				drawSegments( topSegments, outlineStrokeWidth, false );
    				drawSegments( topSegments, areaStrokeWidth, true );

    				drawIntersections( intersections, outlineStrokeWidth );
    				labelStreets();
  }
}
}

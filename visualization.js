/* 0. SETUP
 *************************************************************/

/* 0.1. SVG selection & creation
 *************************************************************/

var svg = d3.select( '#vis-svg' );

var mapSvg = svg.append( 'svg' )
	.attr( 'id', 'map-svg' )
	.attr( 'width', '50%' )
	.attr( 'height', '100%' );

var barSvg = svg.append( 'svg' )
	.attr( 'id', 'bar-svg' )
	.attr( 'width', '50%' )
	.attr( 'height', '100%' );

/* 0.2. Misc. DataArrays and Global Variables
 *************************************************************/

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


/* 1. VIS.1: Street Occupancy Map
 *************************************************************/

// // 1.1 UNUSED CODE
//
// // ALTERNATIVE COLOR SCALES
//
// var colorScale = d3.scaleLinear()
// 	.domain( [ 0, 0.25, 0.5, 0.75, 1 ] )
// 	.range( [ 'green', 'yellow', 'white', 'orange', 'red' ] );
//
// var colorScale = d3.scaleLinear()
// 	.domain( [ 0, 0.5, 1 ] )
// 	.range( [ 'green', 'yellow', 'red' ] );
//
// var colorScale = d3.scaleSequential()
// 	.domain( [ 0, 1 ] )
// 	.interpolator( d3.interpolateYlOrRd );

// SQUARE INTERSECTIONS
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

barSvg.append( 'text' )
	.attr( 'x', scaleX( 1.75 ) )
	.attr( 'y', scaleY( -0.23 ) )
	.text( 'Parking Inventory Bar Chart' )
	.attr( 'font-family', 'sans-serif' )
	.attr( 'font-size', '20px' )
	.attr( 'fill', 'black' );

barSvg.append( 'text' )
	.attr( 'x', scaleX( 1.75 ) )
	.attr( 'y', scaleY( -0.15 ) )
	.text( 'coming soon...' )
	.attr( 'font-family', 'sans-serif' )
	.attr( 'font-size', '10px' )
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

				d3.csv( './Aggregated_FINALV2.csv' )
					.then( function( agg_data ) {

						var dataTime = d3.range( 0, 15 ).map( function( d ) {
							var dt = new Date( 2019, 29, 9, 6, 0, 0, 0 );
							dt.setMinutes( dt.getMinutes() + d * 60 );
							return dt
						} );

						var sliderTime = d3.sliderBottom()
							.min( d3.min( dataTime ) )
							.max( d3.max( dataTime ) )
							.step( 1000 * 60 * 60 )
							.width( 750 )
							.tickFormat( d3.timeFormat( '%-I:%M %p' ) )
							.tickValues( dataTime )
							.default( d3.min( dataTime ) )
							.on( 'onchange', val => {
								sliderTime = d3.timeFormat( '%-I:%M %p' )( val ) + ' Occupied';
								updateDisplayedTime( sliderTime, val );
							} );

						var gTime = svg.append( 'svg' )
							.attr( 'width', '100%' )
							.attr( 'height', '100%' )
							.append( 'g' )
							.attr( 'transform', 'translate(100,50)' );

						gTime.call( sliderTime );

						d3.select( 'p#value-time' )
							.text( d3.timeFormat( '%I' )( sliderTime.value() ) );

						updateDisplayedTime( '6:00 AM Occupied', new Date( 2019, 9, 29, 6, 0, 0, 0 ) );

						function updateDisplayedTime( time, timeVal ) {
							mapSvg.selectAll( '.fill' )
								.attr( 'stroke', function( d ) {
									var id = d.id;
									var idVal = d[ 'Route Number' ]
									var idSide = d[ 'Street Side' ]
									var agg_value = agg_data.find( function( a ) {
										return ( a[ 'Route Number' ] === idVal && ( a[ 'Side of Street' ].charAt( 0 ) === idSide ) );
									} );
									var occupancy_total = agg_value[ 'Total Spots' ];
									var occupancy_rate = agg_value[ time ] / occupancy_total;

									if ( ( timeVal.getHours() >= 9 && timeVal.getHours() <= 17 ) && ( '1' === idVal || '2' === idVal ) ) {
										return 'gray'
									} else {
										return colorScale( occupancy_rate );
									}
								} );
						}
					} );
			} );
	} );


var outlineSize = 2;
var mapLgndStep = 0.05;
var adjMapLgndStep = mapLgndStep * 2;

var maplgndMax = 1 + adjMapLgndStep;
var mapLgndArr = d3.range( 0, maplgndMax, mapLgndStep );

var mapFillWidth = 10;
var mapFillHeight = 30;

var xAdj = -.065;
var xPadding = ( 11 / 2 );
var yAdj = 2.3;

// var mapOutlineWidth = scaleX( maplgndMax ) - scaleX( 0 );
var mapOutlineWidth = mapFillWidth + outlineSize;
var mapOutlineHeight = mapFillHeight + outlineSize;

mapSvg.selectAll( 'rect.mapLgndOutline' )
	.data( mapLgndArr )
	.enter()
	.append( 'rect' )
	.attr( 'class', 'mapLgndOutline' )
	.attr( 'x', function( d ) {
		return scaleX( d + xAdj ) + ( 0.75 * xPadding ) - ( outlineSize * 0.5 );
	} )
	.attr( 'y', function( d ) {
		return scaleY( yAdj ) - 0.5 * ( xPadding - ( outlineSize * 0.5 ) );
	} )
	.attr( 'width', mapOutlineWidth + ( 0.5 * xPadding ) )
	.attr( 'height', mapOutlineHeight + 0.5 * ( xPadding - ( outlineSize * 0.5 ) ) )
	.style( 'fill', outlineColor );


mapSvg.selectAll( 'rect.mapLgndFill' )
	.data( mapLgndArr )
	.enter()
	.append( 'rect' )
	.attr( 'class', 'mapLgndFill' )
	.attr( 'x', function( d ) {
		return scaleX( d + xAdj ) + xPadding;
	} )
	.attr( 'y', function( d ) {
		return scaleY( yAdj );
	} )
	.attr( 'width', mapFillWidth )
	.attr( 'height', mapFillHeight )
	.style( 'fill', function( d ) {
		if ( d <= 1 ) {
			return colorScale( d );
		} else {
			return 'gray';
		}
	} );



/* 2. VIZ.2: Stacked Bar Chart
 *************************************************************/

var barXScale = 250;
var barYRatio = 1;
var barYScale = ( barXScale * barYRatio );

var barHorizMargin = ( mapHorizMargin + 100 );
var barVertMargin = mapVertMargin;

var margin = {
	top: 20,
	right: 20,
	bottom: 30,
	left: 120
}
width = +svg.attr( 'width' ) - margin.left - margin.right,
	height = 200;
var y = d3.scaleBand()
	.rangeRound( [ 0, height ] )
	.paddingInner( 0.05 )
	.align( 0.1 );

var x = d3.scaleLinear()
	.rangeRound( [ 0, width ] );

var m = d3.scaleOrdinal()
	.range( [ '#98abc5', '#8a80a6' ] );

var z = d3.scaleOrdinal()
	.range( [ '#98abc5' ] );



d3.csv( 'Aggregated_Bar_Chart.csv' )
	.then( function( d, i, columns ) {
		var keys = d.columns.slice( 1 );
		var array = [ keys[ keys.length - 1 ], keys[ 0 ] ]
		console.log( "2 variables for bar chart" )
		console.log( array )
		//  create the x, y and z domain of the bar chart
		y.domain( d.map( function( d ) {
			return d.Street;
		} ) );

		x.domain( [ 0, d3.max( d, function( d ) {
			return parseInt( d.Total )
		} ) ] )

		z.domain( array );

		barSvg.append( 'barSvg' )
			.selectAll( 'barSvg' )
			.data( d3.stack().keys( array )( d ) )
			.enter().append( 'barSvg' )
			.attr( 'fill', function( d ) {
				console.log( "arra" )
				console.log( array )
				return '#8a80a6';
			} )
			.selectAll( 'rect' )
			.data( function( d ) {
				return d;
			} )
			.enter().append( 'rect' )
			.attr( 'class', 'chartRow' )
			.attr( 'y', function( d ) {
				console.log( d.data[ "Street Name" ] )
				return y( d.data[ "Street Name" ] );
			} )
			.attr( 'x', function( d ) {
				console.log( d[ 0 ] )
				return d[ 0 ];
			} )
			.attr( 'width', function( d ) {
				return d[ 1 ] - d[ 0 ];
			} )
			.attr( 'height', y.bandwidth() );
	} )



// 		 // the y axis
barSvg.append( 'barSvg' )
	.attr( 'class', 'axis' )
	.attr( 'transform', 'translate(0,0)' )
	.call( d3.axisLeft( y ) );
//
// 		 // the x axis
barSvg.append( 'barSvg' )
	.attr( 'class', 'axis' )
	.attr( 'transform', 'translate(0,' + height + ')' )
	.call( d3.axisBottom( x ).ticks( null, 's' ) )
	.append( 'text' )
	.attr( 'y', 2 )
	.attr( 'x', x( x.ticks().pop() ) + 0.5 )
	.attr( 'dy', '0.32em' )
	.attr( 'fill', '#000' )
	.attr( 'font-weight', 'bold' )
	.attr( 'text-anchor', 'start' )
	.text( 'Parking Spots' )
	.attr( 'transform', 'translate(' + ( -width ) + ',-10)' );

// TODO: BAR CHART LEGEND
//
// 		 // create the legend for the bar chart
// 		 var legend = barSvg.append('barSvg')
// 			 .attr('font-family', 'sans-serif')
// 			 .attr('font-size', 12)
// 			 .attr('text-anchor', 'end')
// 			 .selectAll('g')
// 			 .data(array.slice().reverse())
// 			 .enter().append('g')
// 			 .attr('transform', function(d, i) {
// 				 return 'translate(-50,' + (300 + i * 20) + ')';
// 			 });

// // 		 // colors for the legend of bar chart
// 		 legend.append('rect')
// 			 .attr('x', width - 19)
// 			 .attr('width', 19)
// 			 .attr('height', 10)
// 			 .attr('fill', m)

// // 		 // text of legend for bar chart
// 		 legend.append('text')
// 			 .attr('class', 'legendtext')
// 			 .attr('x', width - 24)
// 			 .attr('y', 9.5)
// 			 .attr('dy', '0.32em')
// 			 .text(function(d) {
// 				 return d;
// 			 });


// 		 // function to update the bar chart link to the hour scroller given a new val of hour
function textChange( val ) {
	d3.selectAll( 'g.chartRow' ).remove();
	d3.selectAll( 'text.legendtext' ).remove();
	if ( val instanceof Date ) {
		var hour = val.getHours()
	} else {
		var hour = val;
	}

	d3.select( 'p#value-time' ).text( d3.timeFormat( '%H' )( val ) );
	var array = [ keys[ hour - 5 ] ]
	var arrayy = [ keys[ 0 ], keys[ hour - 5 ] ]
	//  var okay = d3.stack().keys(array)(data)

	g.append( 'g' )
		.attr( 'class', 'chartRow' )

		.selectAll( 'g' )
		.data( d3.stack().keys( array )( data ) )
		.enter().append( 'g' )
		.attr( 'fill', function( d ) {
			return z( d.key );
		} )
		.selectAll( 'rect' )
		.data( function( d ) {
			return d;
		} )
		.enter().append( 'rect' )
		.attr( 'y', function( d ) {
			return y( d.data.Street );
		} )
		.attr( 'x', function( d ) {
			return x( d[ 0 ] );
		} )
		.attr( 'width', function( d ) {
			return x( d[ 1 ] ) - x( d[ 0 ] );
		} )
		.attr( 'height', y.bandwidth() );

	// update the legend with the new time
	//  var legend = g.append('g')
	// 	 .attr('font-family', 'sans-serif')
	// 	 .attr('font-size', 12)
	// 	 .attr('text-anchor', 'end')
	// 	 .selectAll('g')
	// 	 .data(arrayy.slice().reverse())
	// 	 .enter().append('g')
	// 	 .attr('transform', function(d, i) {
	// 		 return 'translate(-50,' + (300 + i * 20) + ')';
	// 	 });

	//  legend.append('text')
	// 	 .attr('class', 'legendtext')
	// 	 .attr('x', width - 24)
	// 	 .attr('y', 9.5)
	// 	 .attr('dy', '0.32em')
	// 	 .text(function(d) {
	// 		 console.log('jiim')
	// 		 console.log(d)
	// 		 return d;
	// 	 });

}


/* 3. Unused Code: Map Viz Responsive Quadrangles
 *************************************************************/

// // ----------
// // ATTEMPT AT RESPONSIVE POLYGONS
//
// function calcSlope(segment) {
//   var dY = (segment.y2 - segment.y1);
//   var dX = (segment.x2 - segment.x1);
//   var slope = (dY / dX);
//   if (slope === Infinity || slope === -Infinity) {
//     return 0;
//   } else {
//     return (dY / dX);
//   }
// };
//
// function calcInteriorAngle(segmentA, segmentB) {
//   var slopeA = calcSlope(segmentA);
//   var slopeB = calcSlope(segmentB);
//   var tanTheta = 0;
//   if (slopeA === 0 || slopeA === -0) {
//     tanTheta = (slopeA - slopeB) / (1 + (slopeA * slopeB));
//   }
//   var tanTheta = (slopeA - slopeB) / (1 + (slopeA * slopeB));
//   var theta = Math.atan(tanTheta);
//
//   if (theta > Math.PI * 2) {
//     return (theta - (Math.PI * 2));
//   } else if (theta < 0){
//     return (theta +(Math.PI * 2));
//   } else {
//     return theta;
//   }
// };
//
// function findIntersection(segmentA, segmentB){
//   var aX1 = segmentA['x1'];
//   var aY1 = segmentA['y1'];
//   var aX2 = segmentA['x2'];
//   var aY2 = segmentA['y2'];
//
//   var bX1 = segmentB['x1'];
//   var bY1 = segmentB['y1'];
//   var bX2 = segmentB['x2'];
//   var bY2 = segmentB['y2'];
//
//   if ((aX1 == bX1 && aY1 == bY1) || (aX1 == bX2 && aY1 == bY2)) {
//     return [aX1, aY1];
//   } else {
//     return [aX2, aY2];
//   }
// };
//
// function calcPoints(segmentA, segmentB) {
//   var intAngle = calcInteriorAngle(segmentA, segmentB);
//   var intersectCoord = findIntersection(segmentA, segmentB);
//
//   var bisectX0 = intersectCoord[0];
//   var bisectY0 = intersectCoord[1];
//
//   var bisectSlope = Math.tan(intAngle);
//   var bisectIntercept = bisectY0 - (bisectSlope * bisectX0);
//
//   var bisectX1 = ((bisectSlope < 0) ? 2 : -1);
//   var bisectY1 = (bisectSlope * bisectX1) + bisectIntercept;
//
//   var v1 = (bisectX1 - bisectX0);
//   var v2 = (bisectY1 - bisectY0);
//
//   var bNorm = Math.sqrt(Math.pow(v1, 2) + Math.pow(v2, 2));
//   var u1 = v1 / bNorm;
//   var u2 = v2 / bNorm;
//
//   var intX = bisectX0 + (u1 * polyPointDist);
//   var intY = bisectY0 + (u2 * polyPointDist);
//
//   var extX = bisectX0 + (u1 * polyPointDist);
//   var extY = bisectY0 + (u2 * polyPointDist);
//
//   var rExt = [1.0, 2.1, 2.2, 2.3, 3.1, 3.2, 8, 9.1, 9.2, 9.3, 10.1, 10.2]
//
//   if (segmentA['Street Side'] === 'R') {
//     if (rExt.includes(segmentA['Segment Number'])) {
//       return [extX, extY];
//     } else {
//       return [intX, intY];
//     }
//   } else {
//     if (rExt.includes(segmentA['Segment Number'])) {
//       return [intX, intY];
//     } else {
//       return [extX, extY];
//     }
//   }
// }
//
// function genPolygonPoints(segments) {
//   for (s of segments) {
//     var currSegment = s;
//     var prevSegment = segments.find(function(p) {
//       return p['Street Name'] === s['Start Bound Street'];
//     });
//     var nextSegment = segments.find(function(n) {
//       return n['Street Name'] === s['End Bound Street'];
//     });
//
//     var polyPoints = [[s['x2'], s['y2']], [s['x1'], s['y1']]];
//
//     var prevPoints = calcPoints(currSegment, prevSegment);
//     polyPoints.push(prevPoints);
//
//     var nextPoints = calcPoints(currSegment, nextSegment);
//     polyPoints.push(nextPoints);
//
//     s['polyPoints'] = polyPoints;
//   };
//   return segments;
// };
//
// function drawParkingPolygons(segments) {
//   segments = genPolygonPoints(segments)
//
//   mapSvg.selectAll('polygon')
//   .data(segments)
//   .enter()
//   .append('polygon')
//   .attr('points', function(d) {
//      var polyPoints =  d.polyPoints;
//      polyPoints.forEach(function(lop) {
//       lop[0] = scaleX(lop[0]);
//       lop[1] = scaleY(lop[1]);
//     });
//     console.log(polyPoints);
//     return polyPoints;
//   })
//   .attr('stroke','black');
// };
//
// d3.csv('./data/intersections_data.csv')
//   .then(function(intersections_data) {
//     var intersections = intersections_data;
//     drawIntersections(intersections);
//
//     d3.csv('./data/segments_data.csv')
//       .then(function(segments_data) {
//         segments_data.forEach(function(d) {
//           d.x1 = +d.x1;
//           d.y1 = +d.y1;
//           d.x2 = +d.x2;
//           d.y2 = +d.y2;
//         });
//         drawParkingPolygons(segments_data);
//       });
//   });
// // ---------
//
// // ---------
// // DIFFERENT INTERSECTION SHAPES
//
// // CIRCULAR INTERSECTIONS
// function drawIntersections( intersections, strokeWidth ) {
// 	mapSvg.selectAll( 'circle' )
// 		.data( intersections )
// 		.enter()
// 		.append( 'circle' )
// 		.attr( 'fill', outlineColor )
// 		.attr( 'cx', function( d ) {
// 			return scaleX( +d.x );
// 		} )
// 		.attr( 'cy', function( d ) {
// 			return scaleY( +d.y - ( polyPointDist * 0.5 ) ) + ( strokeWidth * 0.25 );
// 		} )
// 		.attr( 'r', pointRadius );
// };
//
// // POLYGON INTERSECTIONS
// function drawIntersections( intersections, strokeWidth ) {
// 	mapSvg.selectAll( 'polygon' )
// 		.data( intersections )
// 		.enter()
// 		.append( 'polygon' )
// 		.attr( 'stroke', 'black' )
// 		.attr( 'points', function( d ) {
// 			return [
// 				scaleX( +d.x ) - strokeWidth,
// 				scaleY( +d.y ) - strokeWidth,
// 				scaleX( +d.x ) - strokeWidth,
// 				scaleY( +d.y ) + strokeWidth,
// 				scaleX( +d.x ) + strokeWidth,
// 				scaleY( +d.y ) + strokeWidth,
// 				scaleX( +d.x ) + strokeWidth,
// 				scaleY( +d.y ) - strokeWidth
// 			];
// 		} );
// };
// // --------
//
// // --------
// // RENAMED GLOBAL VARIABLES
// var R_X_PLUS = [ 1, 2.1, 2.3, 2.2, 3.1, 3.2, 12 ];
// var R_Y_PLUS = [ 2.1, 9.3, 4, 7, 11, 14 ];
// var R_DIAG = [ 2.1, 2.3, 9.1, 9.3 ]
//
// var AREA_STROKE_WIDTH = 8;
// var OUTLINE_STROKE_WIDTH = 12;
// var POINT_RADIUS = 13.5;
// var POLY_POINT_DIST = 0.02;
//
// var OUTLINE_COLOR = '#505050';
//
// var MAP_X_SCALE = 250;
// var MAP_Y_RATIO = 1;
// var MAP_Y_SCALE = ( mapXScale * mapYRatio );
//
// var MAP_HORIZ_MARGIN = 100;
// var MAP_VERT_MARGIN = 200;
// // --------
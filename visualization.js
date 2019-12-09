/* 0. SETUP
 *************************************************************/

/* 0.1. SVG selection & creation
 *************************************************************/


let margin = {
	top: 20,
	right: 200,
	bottom: 30,
	left: 150
};

let div = d3.select("body").append("div")
     .attr("class", "tooltip-donut")
     .style("opacity", 0);

let msvg = d3.select( '#map' );

let mapSvg = msvg.append( 'svg' )
	.attr( 'id', 'map-svg' )
	.attr( "width", "50%" )
	.attr( "height", "100%" );
// .append("g")
// 	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

// var barSvg = svg.append( 'svg' )
// 	.attr( 'id', 'bar-svg' )
// 	.attr( 'width', '50%' )
// 	.attr( 'height', '100%' );


/* 0.2. Misc. DataArrays and Global Variables
 *************************************************************/

let rXPlus = [ 1, 2.1, 2.3, 2.2, 3.1, 3.2, 12 ];
let rYPlus = [ 2.1, 9.3, 4, 7, 11, 14 ];
let rDiag = [ 2.1, 2.3, 9.1, 9.3 ]

let areaStrokeWidth = 8;
let outlineStrokeWidth = 12;
let pointRadius = 13.5;
let polyPointDist = 0.02;

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

						var gTime = msvg.append( 'svg' )
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
								d3.csv( 'Aggregated_Bar_Chart.csv' ).then(
									function( agg_bar_data ) {
										//var currentTimeOcc = "6:00 AM Occupied"

										var barchartWidth = 800 - margin.left - margin.right,
								        barchartHeight = 1000 - margin.top - margin.bottom;

										var barSvg = d3.select("#barchart").append("svg")
								            .attr("width", barchartWidth + margin.left + margin.right)
								            .attr("height", barchartHeight + margin.top + margin.bottom)
								            .append("g")
								            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

										var x = d3.scaleLinear()
														        .range([0, barchartWidth])
														        .domain([0, d3.max(agg_bar_data, function (d) {
														            return d["Total Spots"];
														        })]);

										var y = d3.scaleBand()
															.domain(agg_bar_data.map(function(d) { return d["Street Name"]; }))
															.rangeRound([0, barchartWidth])
															.padding(0.1);

									//make y axis to show bar names
											var yAxis = d3.axisLeft()
																		 			.scale(y)
																		      //no tick marks
																		      .tickSize(0);

										var gy = barSvg.append("g")
																		.attr("class", "y axis")
																		.call(yAxis)

										var bars = barSvg.selectAll(".bar")
																	.data(agg_bar_data)
																	.enter()
																	.append("g")

								 //append rects
											bars.append("rect")
													.attr("class", "bar")
													.attr("y", function (d) {
																		return y(d["Street Name"]);
																		})
													.attr("height", y.bandwidth())
													.attr("x", 0)
													.attr("width", function (d) {
																		    return x(d["Total Spots"]);
														 });

									//add a value label to the right of each bar
									bars.append("text")
											.attr("class", "label")
											//y position of the label is halfway down the bar
											.attr("y", function (d) {
																		             return y(d["Street Name"]) + y.bandwidth() / 2 + 4;
																		            })
																		            //x position is 3 pixels to the right of the bar
																		            .attr("x", function (d) {
																		                return x(d["Total Spots"]) + 3;
																		            });
																		            // .text(function (d) {
																		            //     return ("There are " + (d["Total Spots"]-d[time])
																								// 		+ " empty spots!");
																		            // });

									//stacked bar
									var stackbars = barSvg.selectAll(".stackbar")
																	.data(agg_bar_data)
																	.enter()
																	.append("g")


								 //append rects
											stackbars.append("rect")
													.attr("class", "stackbar")
													.attr("y", function (d) {
																		return y(d["Street Name"]);
																		})
													.attr("height", y.bandwidth())
													.attr("x", 0)
													.attr("width", function (d) {
																		    return x(d[time]);
														 })

								stackbars.on('mouseover', function (d, i) {
								          d3.select(this).transition()
								               .duration('50')
								               .attr('opacity', '.85');
								          div.transition()
								               .duration("50")
								               .style("opacity", 1);
								          let num = d[time] + " spots are currently occupied.";
								          div.html(num)
								               .style("left", (d3.event.pageX + 10) + "px")
								               .style("top", (d3.event.pageY - 15) + "px");
								     })
								     .on('mouseout', function (d, i) {
								          d3.select(this).transition()
								               .duration('50')
								               .attr('opacity', '1');
								          div.transition()
								               .duration('50')
								               .style("opacity", 0);
								     });
									} );
						}
						// trying to add bar chart code

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

var xAdj = -0.065;
var xPadding = ( 11 / 2 );
var yAdj = 2.3;

var mapOutlineWidth = mapFillWidth + outlineSize;
var mapOutlineHeight = mapFillHeight + outlineSize;

mapSvg.selectAll( '.mapLgndOutline' )
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


mapSvg.selectAll( '.mapLgndFill' )
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
// var bsvg = d3.select( '#barchart' );
//
//  var barSvg = bsvg.append( 'svg' )
//  	.attr( 'id', 'bar-svg' )
//  	.attr( 'width', '100%' )
//  	.attr( 'height', '100%' );

// barSvg.append( 'text' )
// 	.attr( 'x', 20 )
// 	.attr( 'y', 50 )
// 	.text( 'Parking Inventory Bar Chart' )
// 	.attr( 'font-family', 'sans-serif' )
// 	.attr( 'font-size', '20px' )
// 	.attr( 'fill', 'black' );

//
// function findMaxTotal( data_arr ) {
// 	var maxTotal = 0;
// 	for ( street of data_arr ) {
// 		var streetTotal = street[ 'Total Spots' ]
// 		if ( streetTotal > maxTotal ) {
// 			maxTotal = streetTotal;
// 		} else {
// 			continue
// 		}
// 	}
// 	return maxTotal;
// };

// create the legend
var legendSvg = d3.select("#barchart")

// Handmade legend
legendSvg.append("circle").attr("cx", 170).attr("cy",550).attr("r", 10).style("fill", "#7f868a")
legendSvg.append("circle").attr("cx", 170).attr("cy", 580).attr("r", 10).style("fill", "#db3232")
legendSvg.append("text").attr("x", 200).attr("y", 550).text("Empty Spots").style("font-size", "20px").attr("alignment-baseline","middle")
legendSvg.append("text").attr("x", 200).attr("y", 580).text("Occupied Spots").style("font-size", "20px").attr("alignment-baseline","middle")


// d3.csv( 'Aggregated_Bar_Chart.csv' ).then(
// 	function( agg_bar_data ) {
// 		var currentTimeOcc = "6:00 AM Occupied"
//
// 		var barchartWidth = 800 - margin.left - margin.right,
//         barchartHeight = 1000 - margin.top - margin.bottom;
//
// 		var barSvg = d3.select("#barchart").append("svg")
//             .attr("width", barchartWidth + margin.left + margin.right)
//             .attr("height", barchartHeight + margin.top + margin.bottom)
//             .append("g")
//             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// 		var x = d3.scaleLinear()
// 						        .range([0, barchartWidth])
// 						        .domain([0, d3.max(agg_bar_data, function (d) {
// 						            return d["Total Spots"];
// 						        })]);
//
// 		var y = d3.scaleBand()
// 							.domain(agg_bar_data.map(function(d) { return d["Street Name"]; }))
// 							.rangeRound([0, barchartWidth])
// 							.padding(0.1);
//
// 	//make y axis to show bar names
// 			var yAxis = d3.axisLeft()
// 										 			.scale(y)
// 										      //no tick marks
// 										      .tickSize(0);
//
// 		var gy = barSvg.append("g")
// 										.attr("class", "y axis")
// 										.call(yAxis)
//
// 		var bars = barSvg.selectAll(".bar")
// 									.data(agg_bar_data)
// 									.enter()
// 									.append("g")
//
//  //append rects
// 			bars.append("rect")
// 					.attr("class", "bar")
// 					.attr("y", function (d) {
// 										return y(d["Street Name"]);
// 										})
// 					.attr("height", y.bandwidth())
// 					.attr("x", 0)
// 					.attr("width", function (d) {
// 										    return x(d["Total Spots"]);
// 						 });
//
// 	//add a value label to the right of each bar
// 	bars.append("text")
// 			.attr("class", "label")
// 			//y position of the label is halfway down the bar
// 			.attr("y", function (d) {
// 										             return y(d["Street Name"]) + y.bandwidth() / 2 + 4;
// 										            })
// 										            //x position is 3 pixels to the right of the bar
// 										            .attr("x", function (d) {
// 										                return x(d["Total Spots"]) + 3;
// 										            })
// 										            .text(function (d) {
// 										                return ("There are " + (d["Total Spots"]-d[currentTimeOcc])
// 																		+ " empty spots!");
// 										            });
//
// 	//stacked bar
// 	var stackbars = barSvg.selectAll(".stackbar")
// 									.data(agg_bar_data)
// 									.enter()
// 									.append("g")
//
//
//  //append rects
// 			stackbars.append("rect")
// 					.attr("class", "stackbar")
// 					.attr("y", function (d) {
// 										return y(d["Street Name"]);
// 										})
// 					.attr("height", y.bandwidth())
// 					.attr("x", 0)
// 					.attr("width", function (d) {
// 										    return x(d[currentTimeOcc]);
// 						 })
//
// stackbars.on('mouseover', function (d, i) {
//           d3.select(this).transition()
//                .duration('50')
//                .attr('opacity', '.85');
//           div.transition()
//                .duration("50")
//                .style("opacity", 1);
//           let num = d[currentTimeOcc] + " spots are currently occupied.";
//           div.html(num)
//                .style("left", (d3.event.pageX + 10) + "px")
//                .style("top", (d3.event.pageY - 15) + "px");
//      })
//      .on('mouseout', function (d, i) {
//           d3.select(this).transition()
//                .duration('50')
//                .attr('opacity', '1');
//           div.transition()
//                .duration('50')
//                .style("opacity", 0);
//      });
// 	} );
		// var barXScale = 250;
		// var barYRatio = 1;
		// var barYScale = ( barXScale * barYRatio );
		//
		// //
		// var barHorizMargin = ( mapHorizMargin + 100 );
		// var barVertMargin = mapVertMargin;
		// //
		// var barSpacing = 7;
		// //
		// var chartHorizMargin = 60;
		// var chartStartX = ( window.innerWidth * 0.5 ) + chartHorizMargin;
		// var chartEndX = window.innerWidth - chartHorizMargin;
		//
		// var chartH = 500;
		// var chartW = window.innerWidth * 0.5;
		// //
		// var maxY = findMaxTotal( agg_bar_data );
		// var xPadding = 5;
		// var lenData = agg_bar_data.length;
		// var keys = agg_bar_data.columns.slice( 1 );
		// var array = [ keys[ keys.length - 1 ], keys[ 0 ] ];
		//
		//
		// // Instantiate the X Axis
		//
		// // var tickVals = [ 0.5, 3.5, 6.5, 9.5, 12.5, 15.5 ];
		// var tickVals = [ 0.25, 1.25, 2.25, 3.25, 4.25, 5.25 ];
		// var tickLabels = agg_bar_data.map( s => s[ 'Street Name' ] );
		//
		// var xScale = d3.scaleLinear()
		// 	// .domain( [ 0, lenData ] )
		// 	.domain( [ 0, lenData ] )
		// 	.range( [ 0, chartW ] );
		//
		// var xAxis = d3.axisTop( xScale )
		// 	.tickSize( 5 )
		// 	.tickValues( tickVals )
		// 	.tickFormat( function( d, i ) {
		// 		console.log( tickLabels [ i ] )
		// 		return tickLabels [ i ]
		// 	} );
		//
		//
		// // Instantiate the Y Axis
		// var yScaleMax = Math.ceil( maxY / 10 ) * 10;
		//
		// var yScale = d3.scaleLinear()
		// 	.domain( [ 0, yScaleMax ] )
		// 	.range( [ barVertMargin, chartH + barVertMargin ] );
		//
		// var yAxis = d3.axisLeft()
		// 	.scale( yScale );
		//
		//
		// // Instantiate the bars
		// var axisY = barVertMargin - barSpacing;
		// var axisX = xScale( 0 ) - barSpacing;
		// var axisYMargin = yScale( yScaleMax );
		//
		// var barWidth = ( ( chartEndX - chartStartX ) / lenData ) - barSpacing;
		//
		// barSvg.selectAll( '.bars' )
		// 	.data( agg_bar_data )
		// 	.enter()
		// 	.append( 'rect' )
		// 	.attr( 'class', 'bars' )
		// 	.attr( 'x', function( d, i ) {
		// 		return xScale( i );
		// 	} )
		// 	.attr( 'y', function( d ) {
		// 		return barVertMargin;
		// 	} )
		// 	.attr( 'width', barWidth )
		// 	.attr( 'height', function( d ) {
		// 		return yScale( d[ 'Total Spots' ] ) - barVertMargin;
		// 	} )
		// 	.style( 'fill', 'gray' );
		//
		// // Create the X Axis
		//
		// barSvg.append( 'g' )
		// 	.attr( 'class', 'xaxis axis' )
		// 	.attr( "transform", "translate(" + ( -barSpacing ) + "," + axisY + ")" )
		// 	.call( xAxis );
		//
		// // Create Y axis
		//
		// barSvg.append( 'g' )
		// 	.attr( 'class', 'axis' )
		// 	.attr( 'transform', 'translate(' + axisX + ', 0)' )
		// 	.call( yAxis );


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


// // 		 // function to update the bar chart link to the hour scroller given a new val of hour
// function textChange( val ) {
// 	d3.selectAll( 'g.chartRow' ).remove();
// 	d3.selectAll( 'text.legendtext' ).remove();
// 	if ( val instanceof Date ) {
// 		var hour = val.getHours()
// 	} else {
// 		var hour = val;
// 	}


// Create Y axis

// 	barSvg.append( 'g' )
// 		.attr( 'class', 'axis' )
// 		.attr( 'transform', 'translate(' + axisX + ', 0)' )
// 		.call( yAxis );
// ;


// width = +svg.attr( 'width' ) - margin.left - margin.right, height = 200;
//
// var y = d3.scaleBand()
// 	.rangeRound( [ 0, height ] )
// 	.paddingInner( 0.05 )
// 	.align( 0.1 );
//
// var x = d3.scaleLinear()
// 	.rangeRound( [ 0, width ] );
//
// var m = d3.scaleOrdinal()
// 	.range( [ '#98abc5', '#8a80a6' ] );
//
// var z = d3.scaleOrdinal()
// 	.range( [ '#98abc5' ] );
//
// d3.csv( 'Aggregated_Bar_Chart.csv' )
// 	.then( function( d ) {
// 		var keys = d.columns.slice( 1 );
// 		var array = [ keys[ keys.length - 1 ], keys[ 0 ] ];
//
// 		//  create the x, y and z domain of the bar chart
// 		y.domain( d.map( function( d ) {
// 			return d.Street;
// 		} ) );
//
// 		x.domain( [ 0, d3.max( d, function( d ) {
// 			return parseInt( d.Total )
// 		} ) ] );
//
// 		z.domain( array );
//
// 		barSvg.append( 'barSvg' )
// 			.selectAll( 'barSvg' )
// 			.data( d3.stack().keys( array )( d ) )
// 			.enter()
// 			.append( 'barSvg' )
// 			.attr( 'fill', function( d ) {
// 				console.log( 'arra' )
// 				console.log( array )
// 				return '#8a80a6';
// 			} )
// 			.selectAll( 'rect' )
// 			.data( function( d ) {
// 				return d;
// 			} )
// 			.enter()
// 			.append( 'rect' )
// 			.attr( 'class', 'chartRow' )
// 			.attr( 'y', function( d ) {
// 				console.log( d.data[ 'Street Name' ] )
// 				return y( d.data[ 'Street Name' ] );
// 			} )
// 			.attr( 'x', function( d ) {
// 				console.log( d[ 0 ] )
// 				return d[ 0 ];
// 			} )
// 			.attr( 'width', function( d ) {
// 				return d[ 1 ] - d[ 0 ];
// 			} )
// 			.attr( 'height', y.bandwidth() );
// 	} );
//
// // the y axis
// barSvg.append( 'barSvg' )
// 	.attr( 'class', 'axis' )
// 	.attr( 'transform', 'translate(0,0)' )
// 	.call( d3.axisLeft( y ) );
//
// // the x axis
// barSvg.append( 'barSvg' )
// 	.attr( 'class', 'axis' )
// 	.attr( 'transform', 'translate(0,' + height + ')' )
// 	.call( d3.axisBottom( x ).ticks( null, 's' ) )
// 	.append( 'text' )
// 	.attr( 'y', 2 )
// 	.attr( 'x', x( x.ticks().pop() ) + 0.5 )
// 	.attr( 'dy', '0.32em' )
// 	.attr( 'fill', '#000' )
// 	.attr( 'font-weight', 'bold' )
// 	.attr( 'text-anchor', 'start' )
// 	.text( 'Parking Spots' )
// 	.attr( 'transform', 'translate(' + ( -width ) + ',-10)' );
//
// // TODO: BAR CHART LEGEND
// //
// // 		 // create the legend for the bar chart
// // 		 var legend = barSvg.append('barSvg')
// // 			 .attr('font-family', 'sans-serif')
// // 			 .attr('font-size', 12)
// // 			 .attr('text-anchor', 'end')
// // 			 .selectAll('g')
// // 			 .data(array.slice().reverse())
// // 			 .enter().append('g')
// // 			 .attr('transform', function(d, i) {
// // 				 return 'translate(-50,' + (300 + i * 20) + ')';
// // 			 });
//
// // // 		 // colors for the legend of bar chart
// // 		 legend.append('rect')
// // 			 .attr('x', width - 19)
// // 			 .attr('width', 19)
// // 			 .attr('height', 10)
// // 			 .attr('fill', m)
//
// // // 		 // text of legend for bar chart
// // 		 legend.append('text')
// // 			 .attr('class', 'legendtext')
// // 			 .attr('x', width - 24)
// // 			 .attr('y', 9.5)
// // 			 .attr('dy', '0.32em')
// // 			 .text(function(d) {
// // 				 return d;
// // 			 });
//
// // function to update the bar chart link to the hour scroller given a new val of hour
// function textChange( val ) {
// 	d3.selectAll( 'g.chartRow' ).remove();
// 	d3.selectAll( 'text.legendtext' ).remove();
// 	if ( val instanceof Date ) {
// 		var hour = val.getHours()
// 	} else {
// 		var hour = val;
// 	}
//
// 	d3.select( 'p#value-time' ).text( d3.timeFormat( '%H' )( val ) );
// 	var array = [ keys[ hour - 5 ] ]
// 	var arrayy = [ keys[ 0 ], keys[ hour - 5 ] ]
// 	//  var okay = d3.stack().keys(array)(data)
//
// 	g.append( 'g' )
// 		.attr( 'class', 'chartRow' )
//
// 		.selectAll( 'g' )
// 		.data( d3.stack().keys( array )( data ) )
// 		.enter().append( 'g' )
// 		.attr( 'fill', function( d ) {
// 			return z( d.key );
// 		} )
// 		.selectAll( 'rect' )
// 		.data( function( d ) {
// 			return d;
// 		} )
// 		.enter().append( 'rect' )
// 		.attr( 'y', function( d ) {
// 			return y( d.data.Street );
// 		} )
// 		.attr( 'x', function( d ) {
// 			return x( d[ 0 ] );
// 		} )
// 		.attr( 'width', function( d ) {
// 			return x( d[ 1 ] ) - x( d[ 0 ] );
// 		} )
// 		.attr( 'height', y.bandwidth() );
//
// 	// update the legend with the new time
// 	//  var legend = g.append('g')
// 	// 	 .attr('font-family', 'sans-serif')
// 	// 	 .attr('font-size', 12)
// 	// 	 .attr('text-anchor', 'end')
// 	// 	 .selectAll('g')
// 	// 	 .data(arrayy.slice().reverse())
// 	// 	 .enter().append('g')
// 	// 	 .attr('transform', function(d, i) {
// 	// 		 return 'translate(-50,' + (300 + i * 20) + ')';
// 	// 	 });
//
// 	//  legend.append('text')
// 	// 	 .attr('class', 'legendtext')
// 	// 	 .attr('x', width - 24)
// 	// 	 .attr('y', 9.5)
// 	// 	 .attr('dy', '0.32em')
// 	// 	 .text(function(d) {
// 	// 		 console.log('jiim')
// 	// 		 console.log(d)
// 	// 		 return d;
// 	// 	 });
//
// }


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

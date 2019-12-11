/* 0. SETUP
 *************************************************************/

/* 0.1. SVG selection & creation
 *************************************************************/

// create universal margins
let margin = {
	top: 20,
	right: 200,
	bottom: 30,
	left: 150
};

// Create a div for hovering over barchart
let div = d3.select("body").append("div")
     .attr("class", "tooltip-bar")
     .style("opacity", 0);

// create a legend for the bar chart
let legendSvg = d3.select("#barchart")
legendSvg.append("circle").attr("cx", 170).attr("cy",550).attr("r", 10).style("fill", "#7f868a")
legendSvg.append("circle").attr("cx", 170).attr("cy", 580).attr("r", 10).style("fill", "#1f1b1b")
legendSvg.append("text").attr("x", 200).attr("y", 550).text("Empty Spots").style("font-size", "20px").attr("alignment-baseline","middle")
legendSvg.append("text").attr("x", 200).attr("y", 580).text("Occupied Spots").style("font-size", "20px").attr("alignment-baseline","middle")

let mapLegend = d3.select("#map")
mapLegend.append("text").attr("x", 50).attr("y", 835).text("Green (All Open Spots) -> White (Half Spots Open) -> Red (No Open Spots)")
.style("font-size", "10px").attr("alignment-baseline","middle")

let msvg = d3.select( '#map' );

let mapSvg = msvg.append( 'svg' )
	.attr( 'id', 'map-svg' )
	.attr( "width", "50%" )
	.attr( "height", "100%" );
// .append("g")
// 	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

// let barSvg = svg.append( 'svg' )
// 	.attr( 'id', 'bar-svg' )
// 	.attr( 'width', '50%' )
// 	.attr( 'height', '100%' );


/* 0.2. Misc. DataArrays and Global letiables
 *************************************************************/

let rXPlus = [ 1, 2.1, 2.3, 2.2, 3.1, 3.2, 12 ];
let rYPlus = [ 2.1, 9.3, 4, 7, 11, 14 ];
let rDiag = [ 2.1, 2.3, 9.1, 9.3 ]

let areaStrokeWidth = 8;
let outlineStrokeWidth = 12;
let pointRadius = 13.5;
let polyPointDist = 0.02;

let outlineColor = '#505050';

let mapXScale = 250;
let mapYRatio = 1;
let mapYScale = ( mapXScale * mapYRatio );

let mapHorizMargin = 100;
let mapVertMargin = 200;

function scaleX( rawX ) {
	return ( rawX * mapXScale ) + mapHorizMargin;
};

function scaleY( rawY ) {
	return ( rawY * mapYScale ) + mapVertMargin;
};

let streetLabels = [ {
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

let colorScale = d3.scaleLinear()
	.domain( [ 0, 0.5, 1 ] )
	.range( [ 'green', 'white', 'red' ] );


//Street Occupancy Map
 //*************************************************************/

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
	let className = ( isParkingArea ? 'fill' : 'outline' );
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
		let intersections = intersections_data;
		d3.csv( './data/segments_data.csv' )
			.then( function( segments_data ) {
				segments_data.forEach( function( d ) {

					let mult = ( ( rDiag.includes( +d[ 'Segment Number' ] ) ) ? 0.7 : 1 );
					let polyPointOffset = polyPointDist * mult;

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

				let botSegments = segments_data.filter( function( d ) {
					return !( [ 3.1, 10.1 ].includes( +d[ 'Segment Number' ] ) )
				} );

				drawSegments( botSegments, outlineStrokeWidth, false );
				drawSegments( botSegments, areaStrokeWidth, true );

				let topSegments = segments_data.filter( function( d ) {
					return [ 3.1, 10.1 ].includes( +d[ 'Segment Number' ] )
				} );

				drawSegments( topSegments, outlineStrokeWidth, false );
				drawSegments( topSegments, areaStrokeWidth, true );

				drawIntersections( intersections, outlineStrokeWidth );
				labelStreets();

				d3.csv( './Aggregated_FINALV2.csv' )
					.then( function( agg_data ) {

						let dataTime = d3.range( 0, 15 ).map( function( d ) {
							let dt = new Date( 2019, 29, 9, 6, 0, 0, 0 );
							dt.setMinutes( dt.getMinutes() + d * 60 );
							return dt
						} );

						let sliderTime = d3.sliderBottom()
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

						let gTime = msvg.append( 'svg' )
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
									let id = d.id;
									let idVal = d[ 'Route Number' ]
									let idSide = d[ 'Street Side' ]
									let agg_value = agg_data.find( function( a ) {
										return ( a[ 'Route Number' ] === idVal && ( a[ 'Side of Street' ].charAt( 0 ) === idSide ) );
									} );
									let occupancy_total = agg_value[ 'Total Spots' ];
									let occupancy_rate = agg_value[ time ] / occupancy_total;

									if ( ( timeVal.getHours() >= 9 && timeVal.getHours() <= 17 ) && ( '1' === idVal || '2' === idVal ) ) {
										return 'gray'
									} else {
										return colorScale( occupancy_rate );
									}
								} );
								// draw the bar chart below with time passed to it from slider
								d3.csv( 'Aggregated_Bar_Chart.csv' ).then(
									function( agg_bar_data ) {

										// set chart width and height
										let barchartWidth = 800 - margin.left - margin.right,
								        barchartHeight = 1000 - margin.top - margin.bottom;

										// create bar svg
										let barSvg = d3.select("#barchart").append("svg")
								            .attr("width", barchartWidth + margin.left + margin.right)
								            .attr("height", barchartHeight + margin.top + margin.bottom)
								            .append("g")
								            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

										// set the x scale
										let x = d3.scaleLinear()
														        .range([0, barchartWidth])
														        .domain([0, d3.max(agg_bar_data, function (d) {
														            return d["Total Spots"];
														        })]);
										// set the y scale
										let y = d3.scaleBand()
															.domain(agg_bar_data.map(function(d) { return d["Street Name"]; }))
															.rangeRound([0, barchartWidth])
															.padding(0.1);

									// make y axis and show bar names
											let yAxis = d3.axisLeft()
																		 			.scale(y)
																		      .tickSize(0);

										let gy = barSvg.append("g")
																		.attr("class", "y axis")
																		.call(yAxis)
										// create bars
										let bars = barSvg.selectAll(".bar")
																	.data(agg_bar_data)
																	.enter()
																	.append("g")

								 // append rectangles as bars
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

							// create hover functionality on main bars
							bars.on('mouseover', function (d, i) {
											d3.select(this).transition()
												.duration('50')
												.attr('opacity', '.85');
												div.transition()
												.duration("50")
												.style("opacity", 1);
												// set label
												let num = (d["Total Spots"] - d[time]) + " spots are currently empty.";
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

									// make the stacked bars
									let stackbars = barSvg.selectAll(".stackbar")
																	.data(agg_bar_data)
																	.enter()
																	.append("g")


								 // append rectangles for stacked bars
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
								// hover functionality for stacked bar
								stackbars.on('mouseover', function (d, i) {
								          d3.select(this).transition()
								               .duration('50')
								               .attr('opacity', '.85');
								          div.transition()
								               .duration("50")
								               .style("opacity", 1);
								          let stacknum = d[time] + " spots are currently occupied.";
								          div.html(stacknum)
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
					} );
			} );
	} );


let outlineSize = 2;
let mapLgndStep = 0.05;
let adjMapLgndStep = mapLgndStep * 2;

let maplgndMax = 1 + adjMapLgndStep;
let mapLgndArr = d3.range( 0, maplgndMax, mapLgndStep );

let mapFillWidth = 10;
let mapFillHeight = 30;

let xAdj = -0.065;
let xPadding = ( 11 / 2 );
let yAdj = 2.3;

let mapOutlineWidth = mapFillWidth + outlineSize;
let mapOutlineHeight = mapFillHeight + outlineSize;

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

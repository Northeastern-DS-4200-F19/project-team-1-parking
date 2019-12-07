// BAR CHART
var svg1 = d3.select( '#barchart' );

var barSvg = svg1.append( 'svg' )
	.attr( 'id', 'bar-svg' )
	.attr( 'width', '50%' )
	.attr( 'height', '100%' );

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

function findMaxTotal( data_arr ) {
	var maxTotal = 0;
	for ( street of data_arr ) {
		var streetTotal = street[ 'Total Spots' ]
		if ( streetTotal > maxTotal ) {
			maxTotal = streetTotal;
		} else {
			continue
		}
	}
	return maxTotal;
};


d3.csv( 'Aggregated_Bar_Chart.csv' ).then(
	function( agg_bar_data ) {

		var barXScale = 250;
		var barYRatio = 1;
		var barYScale = ( barXScale * barYRatio );

		var barHorizMargin = ( mapHorizMargin + 100 );
		var barVertMargin = mapVertMargin;

		var barSpacing = 7;

		var chartHorizMargin = 60;
		var chartStartX = ( window.innerWidth * 0.5 ) + chartHorizMargin;
		var chartEndX = window.innerWidth - chartHorizMargin;

		var chartH = 500;
		var chartW = ( chartEndX - chartStartX );

		var maxY = findMaxTotal( agg_bar_data );
		var xPadding = 5;
		var lenData = agg_bar_data.length;
		var keys = agg_bar_data.columns.slice( 1 );
		var array = [ keys[ keys.length - 1 ], keys[ 0 ] ];


		// Instantiate the X Axis

		// var tickVals = [ 0.5, 3.5, 6.5, 9.5, 12.5, 15.5 ];
		var tickVals = [ 0.25, 1.25, 2.25, 3.25, 4.25, 5.25 ];
		var tickLabels = agg_bar_data.map( s => s[ 'Street Name' ] );

		var xScale = d3.scaleLinear()
			// .domain( [ 0, lenData ] )
			.domain( [ 0, 3 ] )
			.range( [ chartStartX, chartEndX ] );

		var xAxis = d3.axisTop( xScale )
			.tickSize( 5 )
			.tickValues( tickVals )
			.tickFormat( function( d, i ) {
				console.log( tickLabels[ i ] )
				return tickLabels[ i ]
			} );


		// Instantiate the Y Axis
		var yScaleMax = Math.ceil( maxY / 10 ) * 10;

		var yScale = d3.scaleLinear()
			.domain( [ 0, yScaleMax ] )
			.range( [ barVertMargin, chartH + barVertMargin ] );

		var yAxis = d3.axisLeft()
			.scale( yScale );


		// Instantiate the bars
		var axisY = barVertMargin - barSpacing;
		var axisX = xScale( 0 ) - barSpacing;
		var axisYMargin = yScale( yScaleMax );

		var barWidth = ( ( chartEndX - chartStartX ) / lenData ) - barSpacing;

		barSvg.selectAll( '.bars' )
			.data( agg_bar_data )
			.enter()
			.append( 'rect' )
			.attr( 'class', 'bars' )
			.attr( 'x', function( d, i ) {
				return xScale( i );
			} )
			.attr( 'y', function( d ) {
				return barVertMargin;
			} )
			.attr( 'width', barWidth )
			.attr( 'height', function( d ) {
				return yScale( d[ 'Total Spots' ] ) - barVertMargin;
			} )
			.style( 'fill', 'gray' );

		// Create the X Axis

		barSvg.append( 'g' )
			.attr( 'class', 'xaxis axis' )
			.attr( "transform", "translate(" + ( -barSpacing ) + "," + axisY + ")" )
			.call( xAxis );

		// Create Y axis

		barSvg.append( 'g' )
			.attr( 'class', 'axis' )
			.attr( 'transform', 'translate(' + axisX + ', 0)' )
			.call( yAxis );
	} );

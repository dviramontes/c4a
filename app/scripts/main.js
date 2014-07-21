$(function(){

	// DONE : load .csv data
	// DONE : # of violentions in each category
	// TODO : draw histogram with category count as y axis
	// TODO : draw histogram with category time as x axis

	// uses TABLETOP.JS to serve data from google spreadsheets
	var spreadSheetUrl = "https://docs.google.com/spreadsheets/d/1gfPjLfIJHXSH5plx-FgThng0S1t9JKIfujm_9KK-V5w/pubhtml"

	function init() {
		Tabletop.init( { key: spreadSheetUrl,
			callback: tableTopCallback,
			simpleSheet: true } )
	}

	function draw(data){

		//console.log(data)

		var categories = _.pluck(data,'violationcategory');
		var uniqueCategories = _.unique(categories);
		var violations= []

		// init violations Object
		_.each(uniqueCategories, function(e){
			return violations.push(new Object({
				"name": e,
				"count": 0

			}))
		})

		_.each(categories, function(cat){
			_.each(uniqueCategories, function(unique){
				var match
				if(cat === unique){
					match = cat;
					_.find(violations,{'name': match}).count += 1;
				}
			})
		})

		var totalViolations = _.reduce(violations,function(sum, obj){
			return obj.count +  sum;;
		}, 0)

		var maxVioletionsCategory  = _.max(violations,function(cat) {
			console.info(cat.name + " :: " + cat.count)
			return cat.count
		});

		var minVioletionsCategory  = _.min(violations,function(cat) {
			return cat.count
		});


		//console.log("number of unique categoies :: " + uniqueCategories.length)
		//console.log("unique violations ::" + uniqueCategories)
		//console.log("violations :: " + violations.length)
		//console.dir(violations)
		//console.log('Max violetions category', maxVioletionsCategory.name, " with " + maxVioletionsCategory.count )

		// assert that total violation obj.count is equal to data.length
		console.assert(categories.length == totalViolations, "watch out, totals do not addup!" )

		var width = 500,
			height = 380;


		// setup svg
		d3.select('.jumbotron')
			.append('svg')
			.attr('class','viz')
			.attr('width', width)
			.attr('height', height)
			//.style('background', '#ccc')

		// shortcuts
		var svg = d3.select('svg')
		var maxc = maxVioletionsCategory.count;
		var minc = minVioletionsCategory.count;

		var scale = d3.scale.linear()
			.domain([minc,maxc])
			.range([0,width - 50])

		var axis = d3.svg.axis()
			.scale(scale)
			.orient('top')
			.ticks(7)

		var gAxis  = svg.append('g')
			.attr('class','axis')

		var gBars  = svg.append('g')
			.attr('class','bars')

		axis(gAxis);

		// scale label
		gAxis.append('text')
			.attr('class','xlabel')
			.attr("class", "x label")
			.attr("text-anchor", "end")
			.attr("x", 250)
			.attr("y", -40)
			.text("violations");

		//var label = d3.select('.xlabel')

		gAxis.attr('transform', 'translate(25,50)')

		// scale line
		gAxis.selectAll('path')
			.style({
				'fill':'none',
				'stroke':'#000'
			})
		// scale ticks
		gAxis.selectAll('line')
			.style({
				'stroke':"#000"
			})

		// generate scales for bars
		var barScales = []
		_.each(violations, function(e,i){
			var _scale = d3.scale.linear()
				.domain([minc,maxc])
				.range([10, e.count])
			//console.log(_scale.range())
			barScales.push(_scale);
		})



		var hist = d3.layout.histogram()
			.value(function(d) { return d.count })
			.range([0, maxc])
			.bins(9);

		var layout = hist(violations);
		console.log("histogram:", layout)

		svg.selectAll("rect")
			.data(layout)
			.enter().append("rect")
			.attr({
				x: function(d,i) {
					return 150 + i * 30
				},
				y: 50,
				width: 20,
				height: function(d,i) {
					console.log(d)
					return 20 * d.length
				}
			})


		// generate brushes
//		_.each(barScales, function(e,i) {
//			console.log(e)
//			var index = i;
//			var gBrush = svg.append('g')
//				.attr('class','bar' + i)
//
//			var _scale = e
//			console.log(_scale.range())
//			//console.log(e.count, i)
//			var _brush = d3.svg.brush()
//			_brush.x(_scale)
//			_brush.extent([minc,maxc])
//
//			_brush(gBrush)
//
//			gBrush.selectAll('rect')
//				.data(violations, function(d){
//					return d
//				})
//				.enter()
//				.append('rect')
//
//
//			gBrush.selectAll('rect')
//				.attr('height', 30)
//			gBrush.selectAll('.background')
//				.style({fill:"red", visibility:"visible"})
//			gBrush.selectAll('.extent')
//				.style({fill:"blue", visibility:"visible"})
//			gBrush.selectAll('.resize rect')
//				.style({fill:"green", visibility:"visible"})
//			gBrush
//				.attr('transform','translate(25,50)')
//				// stack transform method
//				.attr("transform", function (d, i) {
//					return this.getAttribute("transform") + "scale(0.75)" + "translate(" + 0 + "," + index * 35 + ")"
//				})
//
//		})



	}

	function tableTopCallback(data, tabletop) {
		console.info("Successfully processed!")
		//console.table(data);
		draw(data);
	}

	init();

})
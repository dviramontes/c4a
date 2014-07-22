$(function () {

	// DONE : load .csv data
	// DONE : # of violentions in each category
	// TODO : draw bar with category count as x axis
	// TODO : on :hover event for displaying last and earliest event

	// uses TABLETOP.JS to serve data from google spreadsheets
	var spreadSheetUrl = "https://docs.google.com/spreadsheets/d/1gfPjLfIJHXSH5plx-FgThng0S1t9JKIfujm_9KK-V5w/pubhtml"

	function init() {
		Tabletop.init({ key: spreadSheetUrl,
			callback: tableTopCallback,
			simpleSheet: true })
	}

	function draw(data) {

		//console.log(data)

		var categories = _.pluck(data, 'violationcategory');
		//var dates = _.pluck(data, 'violationdate');
		var uniqueCategories = _.unique(categories);
		var violations = []


		// Violation prototype
		var Violation = function (name, earliest, latest) {
			this.name = name;
			this.count = 0;
			this.dates = [];
		}

		// init violations Object
		_.each(uniqueCategories, function (e) {
			return violations.push(new Violation(e))
		})

		// inc cat count
		_.each(categories, function (cat) {
			_.each(uniqueCategories, function (unique) {
				var match
				if (cat === unique) {
					match = cat;
					_.find(violations, {'name': match}).count += 1;
				}
			})
		})

		// clean dates &
		// match date to its category parent
		_.each(data, function(row,i){
			var _n  = row.violationcategory
			var _t  = row['violationdate'].split(" ")[0];
			var _d  = moment(_t)
			//console.log(_d.unix())
			_.each(uniqueCategories, function(unique,i){
				var match;
				if(_n === unique){
					match = _n;
					if(moment(_d).isValid()){
						_.find(violations, {'name': match}).dates.push(_d);
					}
				}
			})
		})

		var totalViolations = _.reduce(violations, function (sum, obj) {
			return obj.count + sum;
		}, 0)

		var maxVioletionsCategory = _.max(violations, function (cat) {
			//console.info(cat.name + " :: " + cat.count)
			return cat.count
		});

		var minVioletionsCategory = _.min(violations, function (cat) {
			return cat.count
		});


		//console.log("number of unique categoies :: " + uniqueCategories.length)
		//console.log("unique violations ::" + uniqueCategories)
		//console.log("violations :: " + violations.length)
		//console.dir(violations)
		//console.log('Max violetions category', maxVioletionsCategory.name, " with " + maxVioletionsCategory.count)

		// assert that total violation obj.count is equal to data.length
		console.assert(categories.length == totalViolations, "watch out, totals do not addup!")

		var width = 500,
			height = 380;


		// setup svg
		d3.select('.jumbotron')
			.append('svg')
			.attr('class', 'viz')
			.attr('width', width)
			.attr('height', height)
		//.style('background', '#ccc')

		// shortcuts
		var svg = d3.select('svg')
		var maxc = maxVioletionsCategory.count;
		var minc = minVioletionsCategory.count;

		var scale = d3.scale.linear()
			.domain([1, 200])
			.range([1, 390])

		var axis = d3.svg.axis()
			.scale(scale)
			.orient('top')
			.ticks(6)

		var gAxis = svg.append('g')
			.attr('class', 'axis')

		var gBars = svg.append('g')
			.attr('class', 'bars')

		axis(gAxis);

		// scale label
		gAxis.append('text')
			.attr('class', 'xlabel')
			.attr("text-anchor", "end")
			.attr("x", 250)
			.attr("y", -40)
			.text("violations");

		//var label = d3.select('.xlabel')

		gAxis.attr('transform', 'translate(25,50)')

		// scale line
		gAxis.selectAll('path')
			.style({
				'fill': 'none',
				'stroke': '#000'
			})
		// scale ticks
		gAxis.selectAll('line')
			.style({
				'stroke': "#000"
			})

		var x, y, chart;

		svg.append('g')
			.attr('class', 'chart')

		svg.append('g')
			.attr('class', 'textField')

		d3.select('g.textField')
			.append('text')
			.attr('class', 'hoverme')
			.attr("text-anchor", "left")
			.attr("x", 100)
			.attr("y", height - 20)
			.text("Hover over violation category to view more")

		var textField = d3.select('.hoverme')

		chart = d3.select('g.chart')


		chart
			.attr('transform', 'translate(25,50)')

		var color = d3.scale.linear()
			.domain([0, violations.length])
			.range(["orange", "red"]);

		chart.selectAll("rect")
			.data(violations)
			.enter()
			.append("rect")
			.transition()
			.attr("x", 0)
			.attr("y", function (d, i) {
				return i * 30 + 1
			})
			.attr("width", 0)
			.transition()
			.attr("width", function (d) {
				return d.count * 2;
			})
			.attr("height", 30)
			.attr('fill', function (d, i) {
				return color(i)
			})


		chart.append('g')
			.attr('class', 'names')

		chart.append('g')
			.attr('class', 'count')


		chart.select('g.names')
			.selectAll("text")
			.data(violations)
			.enter().append("text")
			.attr('class', 'name')
			.attr("x", 0)
			.attr("y", function (d, i) {
				return i * 30 + 15
			})
			.attr("dx", 5)
			.attr("dy", ".36em")
			.attr("text-anchor", "left")
			.text(function (d) {
				return d.name
			})
			.on('mouseover', function(){
				d3.select('.hoverme').text('ahhh!    ')
			})
			.on('mouseleave', function(){
				d3.select('.hoberme').text("Hover over violation category to view more");
			})


		chart.select('g.count')
			.selectAll('text')
			.data(violations)
			.enter().append("text")
			.attr('class', 'count')
			.attr("x", function (d, i) {
				return d.count >= 20 ? d.count * 2 - 10 : -20
			})
			.attr("y", function (d, i) {
				return i * 30 + 15
			})
			.attr("dx", 8)
			.attr("dy", ".26em")
			.attr("text-anchor", "end")
			.text(function (d) {
				return d.count
			})
			.attr('fill', function (d, i) {
				return d.count >= 20 ? 'white' : color(i)
			})


	}

	function tableTopCallback(data, tabletop) {
		console.info("Successfully processed!")
		//console.table(data);
		draw(data);
	}

	init();

})
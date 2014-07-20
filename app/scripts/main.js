$(function(){

	// DONE : load .csv data
	// TODO : # of violentions in each category

	// uses TABLETOP.JS to serve data from google spreadsheets
	var spreadSheetUrl = "https://docs.google.com/spreadsheets/d/1gfPjLfIJHXSH5plx-FgThng0S1t9JKIfujm_9KK-V5w/pubhtml"

	function init() {
		Tabletop.init( { key: spreadSheetUrl,
			callback: tableTopCallback,
			simpleSheet: true } )
	}

	function draw(data){

		var catergories = _.pluck(data,'violationcategory');
		var uniqueCategories = _.unique(catergories);
		var violationCount= []

		_.each(uniqueCategories, function(e){
			return violationCount.push(new Object({"name": e, "count":0}))
		})

//		_.each(catergories, function(cat){
//			if(_.indexOf(uniqueCategories, cat) >= 0){
//				violationCount.cat.count += 1;
//			}
//		})

		console.log("number of unique categoies :: " + uniqueCategories.length)
		console.dir(uniqueCategories)
		console.dir(violationCount)


		// setup svg
		d3.select('.jumbotron')
			.append('svg')
			.attr('class','viz')
			.attr('width', 500)
			.attr('height', 350)
			//.style('background', '#ccc')

		// shortcuts
		var svg = d3.select('svg')

		// selectAll + data + enter + append
		svg
			.selectAll()

	}

	function tableTopCallback(data, tabletop) {
		console.info("Successfully processed!")
//		console.table(data);
		draw(data);
	}

	init();

})
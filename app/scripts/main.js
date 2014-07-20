$(function(){

	// uses TABLETOP.JS to serve data from google spreadsheets
	var spreadSheetUrl = "https://docs.google.com/spreadsheets/d/1gfPjLfIJHXSH5plx-FgThng0S1t9JKIfujm_9KK-V5w/pubhtml"

	function init() {
		Tabletop.init( { key: spreadSheetUrl,
			callback: tableTopCallback,
			simpleSheet: true } )
	}

	function draw(data){
		// setup svg
		d3.select('.jumbotron')
			.append('svg')
			.attr('class','viz')
			.attr('width', '500')
			.attr('height', '350')
			.style('background', 'white')

	}

	function tableTopCallback(data, tabletop) {
		console.info("Successfully processed!")
		//console.table(data);
		draw(data);
	}

	init();

})
$(function(){function t(){Tabletop.init({key:a,callback:e,simpleSheet:!0})}function n(t){var n=_.pluck(t,"violationcategory"),e=_.unique(n),a=[];_.each(e,function(t){return a.push(new Object({name:t,count:0}))}),_.each(n,function(t){_.each(e,function(n){var e;t===n&&(e=t,_.find(a,{name:e}).count+=1)})});var r=_.reduce(a,function(t,n){return n.count+t},0),c=_.max(a,function(t){return console.info(t.name+" :: "+t.count),t.count}),o=_.min(a,function(t){return t.count});console.assert(n.length==r,"watch out, totals do not addup!");var s=500,l=380;d3.select(".jumbotron").append("svg").attr("class","viz").attr("width",s).attr("height",l).style("background","#ccc");var u=d3.select("svg"),i=(c.count,d3.scale.linear().domain([o.count,c.count]).range([0,s-50])),d=d3.svg.axis().scale(i).orient("top").ticks(7),f=u.append("g").attr("class","axis"),p=u.append("g").attr("class","bar");d(f),f.append("text").attr("class","xlabel").attr("class","x label").attr("text-anchor","end").attr("x",250).attr("y",-40).text("violations"),f.attr("transform","translate(25,50)"),f.selectAll("path").style({fill:"none",stroke:"#000"}),f.selectAll("line").style({stroke:"#000"});var h=d3.layout.histogram().value(function(t){return t.count}).range([0,r]).bins(i.ticks(10)),g=h(a);p.attr("transform","translate(250,250)").attr("transform",function(){return"rotate(0)"}),p.selectAll("rect").data(g).enter().append("rect").attr({x:function(t,n){return 150+35*n},y:50,width:20,height:function(t){return 20*t.length}})}function e(t){console.info("Successfully processed!"),n(t)}var a="https://docs.google.com/spreadsheets/d/1gfPjLfIJHXSH5plx-FgThng0S1t9JKIfujm_9KK-V5w/pubhtml";t()});
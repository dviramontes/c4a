$(function(){function t(){Tabletop.init({key:a,callback:e,simpleSheet:!0})}function n(t){var n=_.pluck(t,"violationcategory"),e=_.unique(n),a=[];_.each(e,function(t){return a.push(new Object({name:t,count:0}))}),_.each(n,function(t){_.each(e,function(n){var e;t===n&&(e=t,_.find(a,{name:e}).count+=1)})});var o=_.reduce(a,function(t,n){return n.count+t},0),c=_.max(a,function(t){return console.info(t.name+" :: "+t.count),t.count}),r=_.min(a,function(t){return t.count});console.assert(n.length==o,"watch out, totals do not addup!");var l=500,s=380;d3.select(".jumbotron").append("svg").attr("class","viz").attr("width",l).attr("height",s);{var u=d3.select("svg"),i=c.count,d=r.count,h=d3.scale.linear().domain([d,i]).range([0,l-50]),f=d3.svg.axis().scale(h).orient("top").ticks(7),p=u.append("g").attr("class","axis");u.append("g").attr("class","bars")}f(p),p.append("text").attr("class","xlabel").attr("class","x label").attr("text-anchor","end").attr("x",250).attr("y",-40).text("violations"),p.attr("transform","translate(25,50)"),p.selectAll("path").style({fill:"none",stroke:"#000"}),p.selectAll("line").style({stroke:"#000"});var g=[];_.each(a,function(t){var n=d3.scale.linear().domain([d,i]).range([10,t.count]);g.push(n)});var v=d3.layout.histogram().value(function(t){return t.count}).range([0,i]).bins(9),m=v(a);console.log("histogram:",m),u.selectAll("rect").data(m).enter().append("rect").attr({x:function(t,n){return 150+30*n},y:50,width:20,height:function(t){return console.log(t),20*t.length}})}function e(t){console.info("Successfully processed!"),n(t)}var a="https://docs.google.com/spreadsheets/d/1gfPjLfIJHXSH5plx-FgThng0S1t9JKIfujm_9KK-V5w/pubhtml";t()});
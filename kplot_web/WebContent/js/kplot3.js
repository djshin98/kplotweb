var kplot = {
	colors : ["#1E90FF","#FFA500","#3CB371","#9370DB","#FF4500","#808000",
		"#0000CD","#FF00FF","#7CFC00","#87CEBB","#FF1493","#008000","#6495ED","#FFD700","#BDB76B","#000080","#800000","#778899",
		"#CD853F","#8B008B","#00FFFF","#1E90FF","#FFA500","#3CB371","#9370DB","#FF4500","#808000","#0000CD","#FF00FF","#7CFC00"],
	getColorArray : function( size ){
		var colors=[];
		for( var i = 0 ; i < size ;i++){ 
			colors.push( kplot.colors[i%kplot.colors.length]);
		}
		return colors;
	},
	init : function( ds , textareaid ){
		var msg = new RequestDataSource();
		msg.request( function(receivedData, setting) {
			$(ds).empty();
			$(textareaid).prop('disabled', true);
			for( i = 0 ; i < receivedData.names.length ; i++ ){
				avv= receivedData.names[i]; //데이터 소스 리스트
				var is = $("<li role='presentation'><a role='menuitem' tabindex='-1' href='#'>"+avv+"</a></li>");
				is.bind('click',function(e){
					$( "#"+ $(ds).attr("aria-labelledby") ).text( $(this).text() );
					$(textareaid).prop('disabled', false);
				});
				$(ds).append( is );
			}
		},function(receivedData, setting) {
			
		});
	},
	ui : {
		menu : {
			select : {
				home : function() {
					$('#section-home').show();
					$('#section-example').hide();
					$('#section-sample').hide();
				},
				example : function() {
					$('#section-home').hide();
					$('#section-example').show();
					$('#section-sample').hide();
				},
				sample : function() {
					$('#section-home').hide();
					$('#section-example').hide();
					$('#section-sample').show();
				},
				graph : {
					bar : {
						vertical : function() {
							//alert('kplot.ui.menu.select.graph.bar.vertical');
							var ids=kplot.panel.create(1);
							for( var i = 0 ; i < ids.length ; i++ ){
								kplot.graph.bar( ids[i] );
							}
						},
						horizontal : function() {
							alert('kplot.ui.menu.select.graph.bar.horizontal');
						},
						stack : function() {
							alert('kplot.ui.menu.select.graph.bar.stack');
						},
						ratio : function() {
							alert('kplot.ui.menu.select.graph.bar.ratio');
						},
						multi : function() {
							var ids=kplot.panel.create(1);
							for( var i = 0 ; i < ids.length ; i++ ){
								kplot.graph.multibar( ids[i] );
							}
						}
					},
					pie : {
						pie : function() {
							var ids = kplot.panel.create( kplot.sheet.data.fields.length-1 );
							for( var i = 0 ; i < ids.length ; i++ ){
								kplot.graph.pie2( ids[i] , i );
							}
						},
						donut : function() {
							alert('kplot.ui.menu.select.graph.pie.donut');
						},
						band : function() {
							alert('kplot.ui.menu.select.graph.pie.band');
						}
					},
					histo : {
						vertical : function() {
							alert('kplot.ui.menu.select.graph.histo.vertical');
						},
						horizontal : function() {
							alert('kplot.ui.menu.select.graph.histo.horizontal');
						}
					},
					line : function(){
						var ids = kplot.panel.create( kplot.sheet.data.fields.length-1 );
						for( var i = 0 ; i < ids.length ; i++ ){
							kplot.graph.line( ids[i] , i );
						}
					}
				},
				search : function( searchText , eachfn ){
					
					var msg = new RequestTableList();
					msg.prop.requestObject.searchText=searchText;
					msg.prop.requestObject.searchTarget='table';
					
					msg.request(function(receivedData, setting){
							for( i = 0 ; i < receivedData.tableList.length ; i++ ){
								var avv= receivedData.tableList[i];	
								eachfn( i , avv );
							}
						},
						function(receivedData, setting){
						
					});
				}
			}
		}
	},
	getTable : function(id,tableName){
		var msg = new RequestTable();
		msg.prop.requestObject.tableName=tableName;
		
		msg.request(function(receivedData, setting){
			var data = JSON.parse(receivedData.tableContent);
			kplot.sheet.writeFromJson(data);
			
		},
		function(receivedData, setting){
			
		});
	},
	panel : {
		lastIndex : 0,
		createIds : [],
		id : function(){
			return "chart-panel-" + (kplot.panel.lastIndex++);
		},
		create : function(div){
			var ids = [];
			var id = kplot.panel.id();
			var panel = $('<div class="panel panel-default"><div class="panel-heading"><div class="panel-title">'
					+'<h4 id="'+id+'-title" ></h4></div></div><div class="panel-body">'
					+'<div class="media"><div class="media-left"></div>'
					+'<div class="media-body"><svg id="'+id+'"></svg></div>'
					+'</div></div></div>');
			panel.css("width","700px");
			$('#graph-content').append(panel);
			panel.lobiPanel();
			//$('.lobipanel').lobiPanel();
			
			//$('#lobipanel-multiple').find('.panel').lobiPanel({
			//	sortable : true
			//});
			ids.push( id );
			return ids;
		}
	},
	grid : null,
	sheet : {
		reset : function(){
			var i = 0 ;
			while( document.getElementById("ht_"+i) ){
				$("#ht_"+(i)).html( "V"+i );
				i++;
			}
			var rowSize = ip_GridProps["demo"].rows;
			var colSize = ip_GridProps["demo"].cols;
			kplot.grid.ip_ResetRange({range:[{startRow:0, startCol:0, endRow:rowSize, endCol:colSize}]});
			
//			for( var r = 0 ; r < rowSize ; r++ ){
//				for( var c = 0 ; c < colSize ; c++ ){
//					kplot.grid.ip_CellInput({row:r,col:c,value:""});
//				}
//			}
		},
		title : function(){
			var buf = "";
			for(var i = 0 ; i < kplot.sheet.data.fields.length ; i++ ){
				if( i > 0 ) buf += " - ";
				buf += kplot.sheet.data.fields[i];
			}
			return buf;
		},
		data : null,
		writeFromJson : function( data ){
			kplot.sheet.reset();
			ip_GridProps["demo"].userDefineColumns = [];
			kplot.sheet.data = {fields:[],types:[],cols:[]};
			for( var i = 1 ; i < data.header.length ; i++ ){
				var col = data.header[i];
				$("#ht_"+(i-1)).html( col.name );
				kplot.sheet.data.fields.push( col.name );
				kplot.sheet.data.types.push( col.type );
				ip_GridProps["demo"].userDefineColumns[i-1] = col.name;
			}
			
			for( var r = 1 ; r < data.rows.length ; r++ ){
				var row = data.rows[r];
				var cols = [];
				var row_json = "{";
				for( var c = 1 ; c < row.length ; c++ ){
					if( c > 1 ){
						row_json +=",";
					}
					var value = row[c];
					
					if( data.header[c].type == 'number' ){
						value = value.length == 0 ? 0 : parseFloat( value );
						$(kplot.grid.ip_CellHtml(r-1,c-1)).css('text-align','right');
						row_json += '"' + kplot.sheet.data.fields[c-1] + '":'+ value ;
					}else{
						row_json += '"' + kplot.sheet.data.fields[c-1] + '":"' + value + '"';
					}
					ip_SetCellFormat("demo",{row:r-1,col:c-1, dataType: { dataType: data.header[c].type, dataTypeName: data.header[c].type }});
					kplot.grid.ip_CellInput({row:r-1,col:c-1,value:value});
					
					
				}
				row_json += "}";
				//console.log( row_json );
				var row_json_obj = JSON.parse(row_json);
				cols.push( row_json_obj );
				kplot.sheet.data.cols[r-1] = cols;
			}
			console.log( 'end' );
		}
	},
	graph : {
		clear : function( id ){
			var $graph = $("#"+id);
			$graph.empty();
		},
		bar : function( id ){
			kplot.graph.clear( id );
			var data = kplot.sheet.data.cols;
			var $graph = $("#"+id);
			var owidth = $graph.parent().parent().width();
			var oheight = $graph.parent().parent().height();
			$("#"+id+"-title").text( kplot.sheet.title() + " Bar Chart");
			var margin = {top: 20, right: 30, bottom: 30, left: 40},
		    width = owidth - margin.left - margin.right,
		    height = oheight - margin.top - margin.bottom;

			var totalWidth = 0;
			var maxWidth = d3.max( data , function(d) { 
				var w = d[0][kplot.sheet.data.fields[0]].toString().width(); 
				totalWidth += w; 
				return w; });
			var rotateNeeded=(totalWidth>(width*0.8))?true:false;
			if( rotateNeeded && margin.bottom < Math.sqrt(2)*maxWidth ){
				margin.bottom = Math.sqrt(2)*maxWidth;
				height = oheight - margin.top - margin.bottom;
			}
			// Scale	
			var x0 = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
			var y = d3.scale.linear().range([height, 0]);

			// Axis
			var xAxis = d3.svg.axis().scale(x0).orient("bottom");
			var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10, "");

			var keys = d3.keys(kplot.sheet.data.fields).filter(function(key) { return key !== kplot.sheet.data.fields[0]; });
			
			var chart = d3.select("#"+id).attr("width", width + margin.left + margin.right)
		      .attr("height", height + margin.top + margin.bottom).append("g")
		      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
			x0.domain( data.map(function(d) { return d[0][kplot.sheet.data.fields[0]]; }) );
			
			var max = parseFloat(d3.max( data, function(d){ var max=d[0][kplot.sheet.data.fields[1]]; for(var i=2;i<d.length;i++){max=Math.max(max,d[0][kplot.sheet.data.fields[i]]);} return max;}));
			var min = parseFloat(d3.min( data, function(d){ var min=d[0][kplot.sheet.data.fields[1]]; for(var i=2;i<d.length;i++){min=Math.min(min,d[0][kplot.sheet.data.fields[i]]);} return min;}));
			if( min > 0 ){ min = 0; }else{ min = min + min*0.2; } max = max + (max-min)*0.2;
			y.domain( [min,max] );
			
			chart.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
			chart.append("g").attr("class", "y axis").call(yAxis);  
			
			chart.selectAll(".bar").data(data).enter().append("rect").attr("class", "bar")
			.attr("x", function(d) { 
				return x0(d[0][kplot.sheet.data.fields[0]]); 
				}).attr("y", function(d) { 
					return y(d[0][kplot.sheet.data.fields[1]]); 
					})
			.attr("height", function(d) { 
				return height - y(d[0][kplot.sheet.data.fields[1]]); }).attr("width", x0.rangeBand());
			
			if( rotateNeeded ){
				chart.call(xAxis).selectAll("text").attr("y", 0).attr("x", 9)
		    		.attr("dy", ".35em").attr("transform", "rotate(45)")
		    		.style("text-anchor", "start");
			}
		},
		multibar:function(id){
			kplot.graph.clear( id );
			var data = kplot.sheet.data.cols;
			var $graph = $("#"+id);
			var owidth = $graph.parent().parent().width();
			var oheight = $graph.parent().parent().height();
			$("#"+id+"-title").text( kplot.sheet.title() + " Bar Chart");
			var margin = {top: 20, right: 30, bottom: 30, left: 40},
		    width = owidth - margin.left - margin.right,
		    height = oheight - margin.top - margin.bottom;

			var totalWidth = 0;
			var maxWidth = d3.max( data , function(d) { 
				var w = d[0][kplot.sheet.data.fields[0]].toString().width(); 
				totalWidth += w; 
				return w; });
			var rotateNeeded=(totalWidth>(width*0.8))?true:false;
			if( rotateNeeded && margin.bottom < Math.sqrt(2)*maxWidth ){
				margin.bottom = Math.sqrt(2)*maxWidth;
				height = oheight - margin.top - margin.bottom;
			}

			var x0 = d3.scale.ordinal().rangeRoundBands([0, width], .1);
			var x1 = d3.scale.ordinal();

			var y = d3.scale.linear().range([height, 0]);
			
			colors = [];
			for( var i = 0 ; i < kplot.sheet.data.fields.length ; i++ ){
				colors.push(kplot.colors[i+1]);
			}
			var color = d3.scale.ordinal().range(colors);

			var xAxis = d3.svg.axis().scale(x0).orient("bottom");

			var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

			var svg = d3.select("#"+id).attr("width", width + margin.left + margin.right)
		    	.attr("height", height + margin.top + margin.bottom).append("g")
		    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var keys = d3.keys(data[0][0]).filter(function(key) { return key !== kplot.sheet.data.fields[0]; });
			x0.domain( data.map(function(d) { return d[0][kplot.sheet.data.fields[0]]; }) );
			x1.domain(keys).rangeRoundBands([0, x0.rangeBand()]);
			
			var max = parseFloat(d3.max( data, function(d){ var max=d[0][kplot.sheet.data.fields[1]]; for(var i=2;i<d.length;i++){max=Math.max(max,d[0][kplot.sheet.data.fields[i]]);} return max;}));
			var min = parseFloat(d3.min( data, function(d){ var min=d[0][kplot.sheet.data.fields[1]]; for(var i=2;i<d.length;i++){min=Math.min(min,d[0][kplot.sheet.data.fields[i]]);} return min;}));
			if( min > 0 ){ min = 0; }else{ min = min + min*0.2; } max = max + (max-min)*0.2;
			y.domain( [min,max] );
			
			data.forEach(function(d) {
			    d.values = keys.map(function(name) { return {name: name, value: +d[0][name]}; });
			});
			
			svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);
			
			svg.append("g").attr("class", "y axis")
		      .call(yAxis).append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		    //  .text("Population");
			
			var state = svg.selectAll(".state")
		      .data(data).enter().append("g").attr("class", "state")
		      .attr("transform", function(d) { 
		    	  return "translate(" + x0(d[0][kplot.sheet.data.fields[0]]) + ",0)"; });

			state.selectAll("rect").data( function(d) { return d.values; } ).enter().append("rect").attr("width", x1.rangeBand())
		      .attr("x", function(d) {
		    	  return x1(d.name); })
		      .attr("y", function(d) { 
		    	  return y(d.value); })
		      .attr("height", function(d) { return height - y(d.value); })
		      .style("fill", function(d) { return color(d.name); });

		  var legend = svg.selectAll(".legend")
		      .data(keys.slice().reverse()).enter().append("g")
		      .attr("class", "legend")
		      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		  legend.append("rect")
		      .attr("x", width - 18)
		      .attr("width", 18)
		      .attr("height", 18)
		      .style("fill", color);

		  legend.append("text")
		      .attr("x", width - 24)
		      .attr("y", 9)
		      .attr("dy", ".35em")
		      .style("text-anchor", "end")
		      .text(function(d) { return d; });
		  
		  if( rotateNeeded ){
			  svg.call(xAxis).selectAll("text").attr("y", 0).attr("x", 9)
		    		.attr("dy", ".35em").attr("transform", "rotate(45)")
		    		.style("text-anchor", "start");
			}
		  
		},
		pie : function(id,index){
			kplot.graph.clear( id );
			var data = kplot.sheet.data.cols;
			
			var idstr = "#"+id;
			var $graph = $(idstr);
			var owidth = $graph.parent().parent().width();
			var oheight = $graph.parent().parent().height();
			$(idstr+"-title").text( kplot.sheet.title() + " Pie Chart");
			var margin = {top: 20, right: 30, bottom: 30, left: 40},
		    width = owidth - margin.left - margin.right,
		    height = oheight - margin.top - margin.bottom;
			radius = Math.min(width, height) / 2;
			
			var color = kplot.getColorArray( data.length );
			var pie = d3.layout.pie();
			var arc = d3.svg.arc().innerRadius(0).outerRadius(100);
			var pieSlice = d3.select(idstr).selectAll("g").data(data).enter().append("g").attr("transform","translate("+width/2+","+height/2+")");
			pieSlice.append("path").attr("class","pie").attr("d",arc).style("fill",function(d,i){return color[i];})
			.transition().duration(1000).delay(function(d,i){return i*200}).ease("liner").attrTween("d",function(d,i){
				var interpolate = d3.interpolate(
						{ startAngle:d.startAngle,endAngle:d.startAngle },
						{ startAngle:d.startAngle,endAngle:d.endAngle }
				);
				return function(t){ return arc(interpolate(t)); };
			});
			
			pieSlice.append("text").attr("class","pieFreq").attr("transform",function(d,i){ return "translate("+arc.centroid(d)+")"} )
				.text(function(d,i){return d[0][kplot.sheet.data.fields[0]];});
			
		},
		pie2 : function(id,index){
			kplot.graph.clear( id );
			var data = kplot.sheet.data.cols;
			
//			data = [{"label":"one", "value":20}, 
//		            {"label":"two", "value":50}, 
//		            {"label":"three", "value":30}];
//			
			var idstr = "#"+id;
			var $graph = $(idstr);
			var owidth = $graph.parent().parent().width();
			var oheight = $graph.parent().parent().height();
			$(idstr+"-title").text( kplot.sheet.title() + " Pie Chart");
			var margin = {top: 20, right: 30, bottom: 30, left: 40},
		    width = owidth - margin.left - margin.right,
		    height = oheight - margin.top - margin.bottom;
			radius = Math.min(width, height) / 2;
			
			var color = kplot.getColorArray( data.length );
			
		    //color = d3.scale.category20c();     //builtin range of colors

		    var vis = d3.select(idstr).data([data])                   //associate our data with the document
		            .attr("width", width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
		            .attr("height", height)
		        .append("svg:g")                //make a group to hold our pie chart
		            .attr("transform", "translate(" + radius + "," + radius + ")")    //move the center of the pie chart from 0, 0 to radius, radius

		    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
		        .outerRadius(radius);

		    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
		        .value(function(d) { return kplot.d.val(d,index); });    //we must tell it out to access the value of each element in our data array

		    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
		        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
		        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
		            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
		                .attr("class", "slice");    //allow us to style things in the slices (like text)

		        arcs.append("svg:path")
		                .attr("fill", function(d, i) { return color[i]; } ) //set the color for each slice to be chosen from the color function defined above
		                .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

		        arcs.append("svg:text")                                     //add a label to each slice
		                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
		                //we have to make sure to set these before calling arc.centroid
		                d.innerRadius = 0;
		                d.outerRadius = radius;
		                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
		            })
		            .attr("text-anchor", "middle")                          //center the text on it's origin
		            .text(function(d, i) { return kplot.d.text(d) });        //get the label from our original data array
		},
		line : function( id , index ){
			kplot.graph.clear( id );
			var data = kplot.sheet.data.cols;
			var $graph = $("#"+id);
			var owidth = $graph.parent().parent().width();
			var oheight = $graph.parent().parent().height();
			$("#"+id+"-title").text( kplot.sheet.title() + " Bar Chart");
			var margin = {top: 20, right: 30, bottom: 30, left: 40},
		    width = owidth - margin.left - margin.right,
		    height = oheight - margin.top - margin.bottom;

			var totalWidth = 0;
			var maxWidth = d3.max( data , function(d) { 
				var w = d[0][kplot.sheet.data.fields[0]].toString().width(); 
				totalWidth += w; 
				return w; });
			var rotateNeeded=(totalWidth>(width*0.8))?true:false;
			if( rotateNeeded && margin.bottom < Math.sqrt(2)*maxWidth ){
				margin.bottom = Math.sqrt(2)*maxWidth;
				height = oheight - margin.top - margin.bottom;
			}

			var x0 = d3.scale.ordinal().rangeRoundBands([0, width], .1);
			var y = d3.scale.linear().range([height, 0]);
			
			colors = [];
			for( var i = 0 ; i < data.width ; i++ ){
				colors.push(kplot.colors[i+1]);
			}
			var color = d3.scale.ordinal().range(colors);

			var xAxis = d3.svg.axis().scale(x0).orient("bottom");

			var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

			var svg = d3.select("#"+id).attr("width", width + margin.left + margin.right)
		    	.attr("height", height + margin.top + margin.bottom).append("g")
		    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			//var keys = d3.keys(data[0]).filter(function(key) { return key !== kplot.sheet.data.fields[0]; });
			//x0.domain( data.map(function(d) { return d[0][kplot.sheet.data.fields[0]]; }) );
			x0.domain(keys).rangeRoundBands([0, x0.rangeBand()]);
			
			var max = parseFloat(d3.max( data, function(d){ var max=d[0][kplot.sheet.data.fields[1]]; for(var i=2;i<d.length;i++){max=Math.max(max,d[0][kplot.sheet.data.fields[i]]);} return max;}));
			var min = parseFloat(d3.min( data, function(d){ var min=d[0][kplot.sheet.data.fields[1]]; for(var i=2;i<d.length;i++){min=Math.min(min,d[0][kplot.sheet.data.fields[i]]);} return min;}));
			if( min > 0 ){ min = 0; }else{ min = min + min*0.2; } max = max + (max-min)*0.2;
			y.domain( [min,max] );
			
			data.forEach(function(d) {
			    d.values = keys.map(function(name) { return {name: name, value: +d[0][name]}; });
			});
			
			svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);
			
			svg.append("g").attr("class", "y axis")
		      .call(yAxis).append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		    //  .text("Population");
			/*
			var state = svg.selectAll(".state")
		      .data(data).enter().append("g").attr("class", "state")
		      .attr("transform", function(d) { 
		    	  return "translate(" + x0(d[0][kplot.sheet.data.fields[0]]) + ",0)"; });

			state.selectAll("rect").data( function(d) { return d.values; } ).enter().append("rect").attr("width", x1.rangeBand())
		      .attr("x", function(d) {
		    	  return x1(d.name); })
		      .attr("y", function(d) { 
		    	  return y(d.value); })
		      .attr("height", function(d) { return height - y(d.value); })
		      .style("fill", function(d) { return color(d.name); });
*/
		  var state = svg.selectAll(".state")
		      .data(data).enter().append("g").attr("class", "state")
		      .attr("transform", function(d) { 
		    	  return "translate(" + x0(d[0][kplot.sheet.data.fields[0]]) + ",0)"; });
			
		  var legend = svg.selectAll(".legend")
		      .data(keys.slice().reverse()).enter().append("g")
		      .attr("class", "legend")
		      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		  legend.append("rect")
		      .attr("x", width - 18)
		      .attr("width", 18)
		      .attr("height", 18)
		      .style("fill", color);

		  legend.append("text")
		      .attr("x", width - 24)
		      .attr("y", 9)
		      .attr("dy", ".35em")
		      .style("text-anchor", "end")
		      .text(function(d) { return d; });
		  
		  if( rotateNeeded ){
			  svg.call(xAxis).selectAll("text").attr("y", 0).attr("x", 9)
		    		.attr("dy", ".35em").attr("transform", "rotate(45)")
		    		.style("text-anchor", "start");
			}
		    
		}
	},
	d:{
		text : function(d){
			return d.data[0][kplot.sheet.data.fields[0]];
		},
		val : function(d,i){
			return d[0][kplot.sheet.data.fields[i+1]];
		}
	},
	query: function( dsid, qid ){
		var msg = new RequestQuery();
		msg.prop.requestObject.dataSourceName=$(dsid).text();
		msg.prop.requestObject.query=$(qid).val();
		if( msg.prop.requestObject.query.length > 0 ){
			msg.request( function(receivedData, setting) {
				//console.log(receivedData.resultContent);
				var data = JSON.parse(receivedData.resultContent);
				kplot.sheet.writeFromJson(data);
			},function(receivedData, setting) {
				
			});
		}
	}
	
};

function change() {
    var value = this.value;
    clearTimeout(timeout);
    pie.value(function(d) { return d[value]; }); // change the value function
    path = path.data(pie); // compute the new angles
    path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
}
function arcTween(a) {
	var i = d3.interpolate(this._current, a);
	this._current = i(0);
	return function(t) {
		return arc(i(t));
	};
}

String.prototype.width = function(font) {
	var f = font || '12px arial',
	o = $('<div>' + this + '</div>')
	   .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
	   .appendTo($('body')),
	   
	w = o.width();
	o.remove();
	return w;
}


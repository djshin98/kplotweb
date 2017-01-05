
function GraphX(type,datasource,target,jsonStrData){
	this.gxid = null;
	this.requestType = type;
	this.dataSource = datasource;
	this.requestTarget = target;
	this.columns = null;
	this.data = {rows:[],fields:[],types:[]};
	this.titlePostfix = "";
	
	this.create = function( cols ){	
			 var options = {editable: true,enableAddRow: false,enableCellNavigation: true,asyncEditorLoading: false};
			 this.data = {rows:[],fields:[],types:[],cols:[]};
			 var rowCount = 100;
			 var colCount = 100;
			 for (var i = 0; i < rowCount; i++) {
				 var d = (this.data.rows[i] = {});
				 d["num"] = i;
			 }
			 this.columns = [{
				 id: "selector",
				 name: "",
				 field: "num",
				 width: 30
			 }];
			 for (var i = 0; i < colCount; i++) {
				 var col = {name : "V"+i,width:60,type:'number'};
				 if( cols && i < cols.length ){
					 col = cols[i];
					 if( cols[i].width != undefined ){
						 col.width = cols[i].width;
					 }else{
						 col.width = 60;
					 }
				 }
				 
				 this.columns.push({
					 id: i,
					 name : col.name,
					 field: i,
					 width: col.width,
					 editor: FormulaEditor,
					 headerCssClass: col.type
				 });
				 
			 }
			 
			 
			 var str = "{";
			 for (var r = 0; r < rowCount; r++) {
				 if( r != 0 )str += ",";
				 str += "\""+r+"\":{";
				 if( cols ){
					 for (var c = 0; c < cols.length; c++) {
						 if( c != 0 ) str += ",";
						 str += "\""+c+"\":\""+cols[c].type+"\"";
					 }
			 	 }
				 str += "}";
				
			 }
			 str += "}"; 
			 var rjo = JSON.parse(str);
			 if( $("#left-pane").length > 0 ){
				
				 kplot.grid = new Slick.Grid("#left-pane", this.data.rows, this.columns, options);
				 
				 kplot.grid.removeCellCssStyles("s");
				 
				 kplot.grid.addCellCssStyles("s",rjo);
				 
				 kplot.grid.setSelectionModel(new Slick.CellSelectionModel());
				    kplot.grid.registerPlugin(new Slick.AutoTooltips());
	
				    // set keyboard focus on the grid
				    kplot.grid.getCanvasNode().focus();
	
				    var copyManager = new Slick.CellCopyManager();
				    kplot.grid.registerPlugin(copyManager);
	
				    copyManager.onPasteCells.subscribe(function (e, args) {
				      if (args.from.length !== 1 || args.to.length !== 1) {
				        throw "This implementation only supports single range copy and paste operations";
				      }
	
				      var from = args.from[0];
				      var to = args.to[0];
				      var val;
				      for (var i = 0; i <= from.toRow - from.fromRow; i++) {
				        for (var j = 0; j <= from.toCell - from.fromCell; j++) {
				          if (i <= to.toRow - to.fromRow && j <= to.toCell - to.fromCell) {
				            val = this.data[from.fromRow + i][columns[from.fromCell + j].field];
				            this.data[to.fromRow + i][columns[to.fromCell + j].field] = val;
				            kplot.grid.invalidateRow(to.fromRow + i);
				          }
				        }
				      }
				      kplot.grid.render();
				    });
				    
				 kplot.grid.onAddNewRow.subscribe(function (e, args) {
				      var item = args.item;
				      var column = args.column;
				      kplot.grid.invalidateRow(data.length);
				      this.data.push(item);
				      kplot.grid.updateRowCount();
				      kplot.grid.render();
				    });
				   
				 
				 kplot.grid.onHeaderClick.subscribe(function(e, args) {
				        var columnID = args.column.id+1;
				        for(var i = 0; i < kplot.grid.getDataLength(); i++){
				        	if( i == 0 ){
				        		kplot.addSelect(args.column.id,!$(kplot.grid.getCellNode(i,columnID)).hasClass('cselected'));
				        	}
				        	$(kplot.grid.getCellNode(i,columnID)).toggleClass('cselected');
				        }
				   });
			 }
			 
	};
		
	this.title = function(){
			var buf = "";
			for(var i = 0 ; i < this.data.fields.length ; i++ ){
				if( i > 0 ) buf += " - ";
				buf += this.data.fields[i].name;
			}
			return buf;
	};
	this.getColumnCount = function(){
		return this.data.fields.length;
	}
	this.getDataArray = function(){
			return this.data.rows;
		}
	this.grid = {
				setValue : function( row , col , val , brefresh ){if( kplot.grid ){kplot.grid.getData()[row][col] = val;if( brefresh ){kplot.grid.updateCell(row,col+1);}}},
				refresh : function(){if( kplot.grid ){kplot.grid.invalidate();}}
		};
		
		
	this.getColors = function(len){
			return kplot.colors;
		};
	this.getMetaData = function( row ){
			
		}
	this.getKeys = function(){
			var keys = []; 
			for(var i=1;i<this.data.fields.length;i++){
				keys.push(this.data.fields[i].name);
			}
			return keys;
		};
	this.createFromJson = function( msgdata ){
			this.create( msgdata.header );
			this.data.rows = [];
			var row_json = "[";
			for( var r = 1 ; r < msgdata.rows.length ; r++ ){
				var row = msgdata.rows[r];
				var cols = [];
				if( r > 1 ){row_json += ",";}
				var ojson = {};
				//row_json = "{";
				for( var c = 0 ; c < row.length ; c++ ){
					if( c > 0 ){
						row_json +=",";
					}
					var value = row[c];
					
					if( msgdata.header[c].type == 'number' ){
						value = value.length == 0 ? 0 : parseFloat( value );
						ojson[msgdata.header[c].name] = value;
						//row_json += '"' + msgdata.header[c].name + '":'+ value ;
					}else{
						ojson[msgdata.header[c].name] = value;
						//row_json += '"' + msgdata.header[c].name + '":"' + value + '"';
					}
					this.grid.setValue( r - 1 , c, value , false );
				}
				//row_json += "}";
				//var row_json_obj = JSON.parse(row_json);
				this.data.rows.push(ojson);
			}
			row_json += "]";
			this.data.fields = msgdata.header;
			this.grid.refresh();
			//console.log( 'end' );
		};
	this.getMinMax = function( data , keys ){
			return {max: parseFloat(d3.max( data, function(d){ var max=d[keys[0]]; for(var i=1;i<keys.length;i++){max=Math.max(max,d[keys[i]]); } return max;})),
					min: parseFloat(d3.min( data, function(d){ var min=d[keys[0]]; for(var i=1;i<keys.length;i++){min=Math.min(min,d[keys[i]]);} return min;}))};
		};
	this.drawLegend = function(svg,keys,colors,width,reverse){
			var legend = svg.selectAll(".legend")
		      .data((reverse == undefined || reverse)?keys.slice().reverse():keys.slice()).enter().append("g")
		      .attr("class", "legend")
		      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		   legend.append("rect")
		      .attr("x", width - 18)
		      .attr("width", 18)
		      .attr("height", 18)
		      .style("fill", function(d,i){ return colors[i];});

		   legend.append("text")
		      .attr("x", width - 24)
		      .attr("y", 9)
		      .attr("dy", ".35em")
		      .style("text-anchor", "end")
		      .style("font-size", "0.8em")
		      .text(function(d) { return d; });
	};
		
	if( jsonStrData != undefined ){
		this.createFromJson( jsonStrData );
	}else{
		this.create();
	}
		
	this.getGraphXId = function(){
		return this.gxid;
	}	
};
	
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
								kplot.graph.bar( kplot.getGraphXOfCurrentSheet(), ids[i] );
							}
						},
						horizontal : function() {
							var ids=kplot.panel.create(1);
							for( var i = 0 ; i < ids.length ; i++ ){
								kplot.graph.multibarHorz( kplot.getGraphXOfCurrentSheet(), ids[i] );
							}
						},
						stack : function() {
							var ids=kplot.panel.create(1);
							for( var i = 0 ; i < ids.length ; i++ ){
								kplot.graph.stack( kplot.getGraphXOfCurrentSheet(), ids[i] , i );
							}
						},
						stackHorz : function() {
							var ids=kplot.panel.create(1);
							for( var i = 0 ; i < ids.length ; i++ ){
								kplot.graph.stackHorz( kplot.getGraphXOfCurrentSheet(), ids[i] , i );
							}
						},
						ratio : function() {
							var ids=kplot.panel.create(1);
							for( var i = 0 ; i < ids.length ; i++ ){
								kplot.graph.ratio( kplot.getGraphXOfCurrentSheet(), ids[i] , i );
							}
						},
						multi : function() {
							var ids=kplot.panel.create(1);
							for( var i = 0 ; i < ids.length ; i++ ){
								kplot.graph.multibar( kplot.getGraphXOfCurrentSheet(), ids[i] );
							}
						}
					},
					pie : {
						pie : function() {
							var ids = kplot.panel.create( kplot.getGraphXOfCurrentSheet().getColumnCount()-1 , "pie" );
							for( var i = 0 ; i < ids.length ; i++ ){
								kplot.graph.pie( kplot.getGraphXOfCurrentSheet(), ids[i] , i );
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
						var ids = kplot.panel.create( kplot.getGraphXOfCurrentSheet().getColumnCount()-1 );
						for( var i = 0 ; i < ids.length ; i++ ){
							kplot.graph.line( kplot.getGraphXOfCurrentSheet(), ids[i] , i );
						}
					},
					complex : function(){
						var ids = kplot.panel.create( kplot.getGraphXOfCurrentSheet().getColumnCount()-1 );
						for( var i = 0 ; i < ids.length ; i++ ){
							kplot.graph.complex( kplot.getGraphXOfCurrentSheet(), ids[i] , i );
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
					+'<div class="media-body svg-container"><svg class="svg-content-responsive" id="'+id+'"></svg></div>'
					+'</div></div></div>');
			panel.css("width","700px");
			$('#graph-content').append(panel);
			panel.lobiPanel();
			
			$(window).on('resize.lobiPanel', function(e,obj){
				var $svg = $($(obj.element[0]).find('svg')[0]);
				var owidth = obj.size.width;
				var oheight = obj.size.height; 
				
				kplot.panel.resize( $svg , owidth , oheight );
			});
			
			panel.on('onFullScreen.lobiPanel', function(ev, lobiPanel){
				var $svg = $(lobiPanel.$el.find('svg'));
				var owidth = $svg.parent().parent().width();
				var oheight = $svg.parent().parent().height();
				kplot.panel.resize( $svg , owidth , oheight );
			});
			
			panel.on('onSmallSize.lobiPanel', function(ev, lobiPanel){
				var $svg = $(lobiPanel.$el.find('svg'));
				var owidth = $svg.parent().parent().width();
				var oheight = $svg.parent().parent().height();
				kplot.panel.resize( $svg , owidth , oheight );
			});
			panel.on('onPin.lobiPanel', function(ev, lobiPanel){
				var $svg = $(lobiPanel.$el.find('svg'));
				var owidth = $svg.parent().parent().width();
				var oheight = $svg.parent().parent().height();
				kplot.panel.resize( $svg , owidth , oheight );
			});
			
			ids.push( id );
			return ids;
		},
		resize : function( svg , owidth , oheight ){
			var margin = {top: 0, right: 30, bottom: 20, left: 40},
			width = owidth; - margin.left - margin.right,
			height = oheight; - margin.top - margin.bottom;
			
			svg.attr('width', width);
			svg.attr('height', height);
		}
	},
	grid : null,
	sheets : [],
	lastSheet : null,
	removeGraphX : function( id ){
		kplot.sheets = kplot.sheets.filter(function (item, index, array) {
			return (graphx.getGraphXId() == id)? false : true;
		});
		if( kplot.lastSheet && kplot.lastSheet.getGraphXId() == id ){
			kplot.lastSheet = ( kplot.sheets && kplot.lastSheet.length > 0 ) ? kplot.sheets[kplot.sheets.length-1] : null; 
		}
	},
	addGraphX : function( graphx ){
		kplot.sheets.push( graphx );
		kplot.lastSheet = graphx;
	},
	getGraphXOfCurrentSheet : function(){
		return kplot.lastSheet;
	},
	selectcolumns : [],
	addSelect : function( index , bselect ){
		var temp=[];
		for(var i=0;i<kplot.selectcolumns.length;i++){
			if(index!=kplot.selectcolumns[i]){
				temp.push(kplot.selectcolumns[i]);}}
		kplot.selectcolumns = temp;
		if( bselect ){
			kplot.selectcolumns.push( index );
		}
		console.log( JSON.stringify(kplot.selectcolumns) );
	},
	graph : {
		clear : function( id ){
			var $graph = $("#"+id);
			$graph.empty();
		},
		bar : function( graphx , id , index ){
			kplot.graph.clear( id );
			var data = graphx.getDataArray();
			var $graph = $("#"+id);
			var owidth = $graph.parent().parent().width();
			var oheight = $graph.parent().parent().height();
			$("#"+id+"-title").text( graphx.title() + " " + graphx.titlePostfix);
			var margin = {top: 20, right: 30, bottom: 30, left: 40},
		    width = owidth - margin.left - margin.right,
		    height = oheight - margin.top - margin.bottom;

			var totalWidth = 0;
			var maxWidth = d3.max( data , function(d) { 
				var w = d[graphx.data.fields[0].name].toString().width(); 
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

			var keys = graphx.getKeys();
			
			var vb = "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom)+"";
			var chart = d3.select("#"+id).attr("width", width + margin.left + margin.right)
		      .attr("height", height + margin.top + margin.bottom)
		      .attr( "viewBox", vb).append("g")
		      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
			x0.domain( data.map(function(d) { return d[graphx.data.fields[0].name]; }) );
			
			var ix = graphx.getMinMax(data,keys);
			if( ix.min > 0 ){ ix.min = 0; }else{ ix.min = ix.min + ix.min*0.2; } ix.max = ix.max + (ix.max-ix.min)*0.2;
			y.domain( [ix.min,ix.max] );
			
			chart.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
			chart.append("g").attr("class", "y axis").call(yAxis);  
			
			chart.selectAll(".bar").data(data).enter().append("rect").attr("class", "bar")
			.attr("x", function(d) { 
				return x0(d[graphx.data.fields[0].name]); 
				}).attr("y", function(d) { 
					return y(d[graphx.data.fields[1].name]); 
					})
			.attr("height", function(d) { 
				return height - y(d[graphx.data.fields[1].name]); }).attr("width", x0.rangeBand());
			
			if( rotateNeeded ){
				chart.call(xAxis).selectAll("text").attr("y", 0).attr("x", 9)
		    		.attr("dy", ".35em").attr("transform", "rotate(45)")
		    		.style("text-anchor", "start");
			}
		},
		multibar:function(graphx,id,index){
			kplot.graph.clear( id );
			var data = graphx.getDataArray();
			var $graph = $("#"+id);
			var owidth = $graph.parent().parent().width();
			var oheight = $graph.parent().parent().height();
			$("#"+id+"-title").text( graphx.title() + " " + graphx.titlePostfix);
			var margin = {top: 20, right: 30, bottom: 30, left: 40},
		    width = owidth - margin.left - margin.right,
		    height = oheight - margin.top - margin.bottom;

			var totalWidth = 0;
			var maxWidth = d3.max( data , function(d) { 
				var w = d[graphx.data.fields[0].name].toString().width(); 
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
			
			var colors = graphx.getColors(graphx.data.fields.length);
			var color = d3.scale.ordinal().range(colors);

			var xAxis = d3.svg.axis().scale(x0).orient("bottom");

			var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

			var vb = "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom)+"";
			var svg = d3.select("#"+id).attr("width", width + margin.left + margin.right)
		    	.attr("height", height + margin.top + margin.bottom)
		    	.attr( "viewBox", vb).append("g")
		    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var keys = graphx.getKeys();
			
			x0.domain( data.map(function(d) { return d[graphx.data.fields[0].name]; }) );
			x1.domain(keys).rangeRoundBands([0, x0.rangeBand()]);
			
			var ix = graphx.getMinMax( data , keys );
			if( ix.min > 0 ){ ix.min = 0; }else{ ix.min = ix.min + ix.min*0.2; } ix.max = ix.max + (ix.max-ix.min)*0.2;
			y.domain( [ix.min,ix.max] );
			
			data.forEach(function(d) {
			    d.values = keys.map(function(name) { return {name: name, value: +d[name]}; });
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
		    	  return "translate(" + x0(d[graphx.data.fields[0].name]) + ",0)"; });

			var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([-70, 0])
			  .html(function(d,i) {
			    return "<strong>"+d.name+":</strong> <span style='color:yellow'>" + (d.value) + "</span>";
			  });
			
			state.selectAll("rect").data( function(d) { return d.values; } ).enter().append("rect").attr("width", x1.rangeBand())
		      .attr("x", function(d) {
		    	  return x1(d.name); })
		      .attr("y", function(d) { 
		    	  return y(d.value); })
		      .attr("height", function(d) { return height - y(d.value); })
		      .style("fill", function(d) { return color(d.name); }).call(tip)
		    	 .on("mouseover",function(o,i){
		    		 var dthis = d3.select(this);
		    		 var color = dthis.style("fill");
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke",color).attr("stroke-width","2");
		    		 tip.show(o,i);
		    	 })
		    	 .on("mouseout",function(o){
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke","").attr("stroke-width","0");
		    		 tip.hide();
		    	 })
		    	 .on("click",function(o){
		    		 var dthis = d3.select(this);
		    		 var color = dthis.style("fill");
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke",color).attr("stroke-width","4").transition().duration(100).attr("stroke-width","0")
		    	 });

		  var average = true;
		  if( average ){
			  var line = d3.svg.line().x(function(d) { 
					return x0.rangeBand()/2 + x0(d.name); }).y(function(d) { 
						return y(d.value); });
			  
			  var atip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([-70, 0])
			  .html(function(d) {
			    return "<strong>"+d.name+" 평균 :</strong> <span style='color:yellow'>" + d3.format(".3f")(d.value) + "</span>";
			  });

			var avgData = data.map(function(d){ 
				var sum = 0;
				for( var i = 0 ; i < d.values.length ; i++ ){
					sum += d.values[i].value;
				}
				var avg = Number(sum/d.values.length);
				//console.log("average : " + avg);
				return { name:d[graphx.data.fields[0].name] , value: avg }; });
			
			var g = svg.append("g");
			g.append("path").attr("class","aline").attr("fill","none")
			.attr("stroke-width",2).attr("stroke",colors[keys.length]).attr("d", line(avgData));
			
			g = svg.append("g");
	    	g.selectAll(".cir").data(avgData).enter().append("circle").attr("class","cir")
	    	 .attr("fill",function(d,i){ return colors[keys.length]; })
	    	 .attr("r",5)
	    	 .attr("cx",function(d,i){
	    		 return x0.rangeBand()/2 + x0(d.name);})
	    	 .attr("cy",function(d,i){
	    		// console.log( y(d.value) );
	    		 return y(d.value); }).call(atip)
	    	 .on("mouseover",function(o){
	    		 d3.select(this).transition().duration(500).ease("elastic").attr("r",9);
	    		 atip.show(o);
	    	 })
	    	 .on("mouseout",function(o){
	    		 d3.select(this).transition().duration(500).ease("elastic").attr("r",5);
	    		 atip.hide();
	    	 })
	    	 .on("click",function(o){
	    		 d3.select(this).transition().duration(500).ease("elastic").attr("r",15).transition().duration(100).attr("r",5);
	    	 });
		  }
		  
		  graphx.drawLegend(svg,keys,colors,width);
		  if( rotateNeeded ){
			  svg.call(xAxis).selectAll(".tick>text").attr("y", 0).attr("x", 9)
		    		.attr("dy", ".35em").attr("transform", "rotate(-45) translate(0,20)")
		    		.style("text-anchor", "end");
			}
		  
		},
		multibarHorz:function(graphx, id,index){
			kplot.graph.clear( id );
			$("#"+id+"-title").text( graphx.title() + " " + graphx.titlePostfix);
			var data = graphx.getDataArray();
			var $graph = $("#"+id);
			var owidth = $graph.parent().parent().width();
			var oheight = $graph.parent().parent().height();
			
			var margin = {top: 20, right: 30, bottom: 20, left: 40},
		    width = owidth - margin.left - margin.right,
		    height = oheight - margin.top - margin.bottom;

			var totalWidth = 0;
			var maxWidth = d3.max( data , function(d) { 
				var w = d[graphx.data.fields[0].name].toString().width(); 
				totalWidth += w; 
				return w; });
			var rotateNeeded=(totalWidth>(width*0.8))?true:false;
			if( rotateNeeded && margin.bottom < Math.sqrt(2)*maxWidth ){
				margin.bottom = Math.sqrt(2)*maxWidth;
				height = oheight - margin.top - margin.bottom;
			}

			var y0 = d3.scale.ordinal().rangeRoundBands([height, 0], .1);
			var y1 = d3.scale.ordinal();

			var x = d3.scale.linear().range([0,width]);
			
			var colors = graphx.getColors(graphx.data.fields.length);
			
			var color = d3.scale.ordinal().range(colors);

			var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format(".2s"));

			var yAxis = d3.svg.axis().scale(y0).orient("left");

			var vb = "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom)+"";
			var svg = d3.select("#"+id).attr("width", width + margin.left + margin.right)
		    	.attr("height", height + margin.top + margin.bottom)
		    	.attr( "viewBox", vb).append("g")
		    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			
			var keys = graphx.getKeys();
			y0.domain( data.map(function(d) { return d[graphx.data.fields[0].name]; }) );
			y1.domain(keys).rangeRoundBands([0, y0.rangeBand()]);
			
			var ix = graphx.getMinMax( data , keys );
			if( ix.min > 0 ){ ix.min = 0; }else{ ix.min = ix.min + ix.min*0.2; } ix.max = ix.max + (ix.max-ix.min)*0.2;
			x.domain( [ix.min,ix.max] );
			
			data.forEach(function(d) {
			    d.values = keys.map(function(name) { return {name: name, value: +d[name]}; });
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
		      .style("text-anchor", "end");
			
			var state = svg.selectAll(".state")
		      .data(data).enter().append("g").attr("class", "state")
		      .attr("transform", function(d) { 
		    	  return "translate(0," + y0(d[graphx.data.fields[0].name]) +")"; });

			var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([-70, 0])
			  .html(function(d,i) {
			    return "<strong>"+d.name+":</strong> <span style='color:yellow'>" + (d.value) + "</span>";
			  });
			
			state.selectAll("rect").data( function(d) { return d.values; } ).enter().append("rect").attr("height", y1.rangeBand()<1?1:y1.rangeBand())
		      .attr("x", function(d) {
		    	  return 1; })
		      .attr("y", function(d) { 
		    	  return y1(d.name); })
		      .attr("width", function(d) { return x(d.value); })
		      .style("fill", function(d) { return color(d.name); }).call(tip)
		    	 .on("mouseover",function(o,i){
		    		 var dthis = d3.select(this);
		    		 var color = dthis.style("fill");
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke",color).attr("stroke-width","2");
		    		 tip.show(o,i);
		    	 })
		    	 .on("mouseout",function(o){
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke","").attr("stroke-width","0");
		    		 tip.hide();
		    	 })
		    	 .on("click",function(o){
		    		 var dthis = d3.select(this);
		    		 var color = dthis.style("fill");
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke",color).attr("stroke-width","4").transition().duration(100).attr("stroke-width","0")
		    	 });

			graphx.drawLegend(svg,keys,colors,width);
			
		  if( rotateNeeded ){
			  svg.call(xAxis).selectAll(".tick>text").attr("y", 0).attr("x", 9)
		    		.attr("dy", ".35em").attr("transform", "rotate(-45) translate(0,20)")
		    		.style("text-anchor", "end");
			}
		  
		},
		stack : function(graphx,id,index){
			kplot.graph.clear( id );
			var data = graphx.getDataArray();
			var $graph = $("#"+id);
			var owidth = $graph.parent().parent().width();
			var oheight = $graph.parent().parent().height();
			$("#"+id+"-title").text( graphx.title() + " " + graphx.titlePostfix);
			var margin = {top: 20, right: 30, bottom: 20, left: 40},
		    width = owidth - margin.left - margin.right,
		    height = oheight - margin.top - margin.bottom;
			var keys = graphx.getKeys();
			var totalWidth = 0;
			var maxWidth = d3.max( data , function(d) { 
				var w = d[graphx.data.fields[0].name].toString().width(); 
				totalWidth += w; 
				return w; });
			
			var rotateNeeded=(totalWidth>(width*0.8))?true:false;
			if( rotateNeeded && margin.bottom < Math.sqrt(2)*maxWidth ){
				margin.bottom = Math.sqrt(2)*maxWidth;
				height = oheight - margin.top - margin.bottom;
			}

			var x = d3.scale.ordinal().rangeRoundBands([0, width]);
			var y = d3.scale.linear().rangeRound([height, 0]);
			var z = graphx.getColors(graphx.data.fields.length);//d3.scale.category10();

			var xAxis = d3.svg.axis().scale(x).orient("bottom");
			var yAxis = d3.svg.axis().scale(y).orient("left");
			var vb = "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom)+"";
			var svg = d3.select("#"+id).attr("width", width + margin.left + margin.right)
		    	.attr("height", height + margin.top + margin.bottom)
		    	.attr( "viewBox", vb).append("g")
		    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
			var layers = d3.layout.stack()(keys.map(function(c) {
			    return data.map(function(d) {
			      return {x: d[graphx.data.fields[0].name], y: d[c]};
			    });
			  }));
			x.domain(layers[0].map(function(d) { return d.x; }));
			y.domain([0, d3.max(layers[layers.length - 1], function(d) { return d.y0 + d.y; })]).nice();
			
			var layer = svg.selectAll(".layer")
		      .data(layers).enter().append("g")
		      .attr("class", "layer")
		      .style("fill", function(d, i) { return z[i]; });

			var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([-70, 0])
			  .html(function(d,i) {
			    return "<strong>"+d.x+":</strong> <span style='color:yellow'>" + (d.y) + "</span>";
			  });
			
		  layer.selectAll("rect")
		      .data(function(d) { return d; })
		    .enter().append("rect")
		      .attr("x", function(d) { return x(d.x); })
		      .attr("y", function(d) { return y(d.y + d.y0); })
		      .attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
		      .attr("width", x.rangeBand() - 1).call(tip)
		    	 .on("mouseover",function(o,i){
		    		 var dthis = d3.select(this);
		    		 var color = dthis.style("fill");
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke",color).attr("stroke-width","2");
		    		 tip.show(o,i);
		    	 })
		    	 .on("mouseout",function(o){
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke","").attr("stroke-width","0");
		    		 tip.hide();
		    	 })
		    	 .on("click",function(o){
		    		 var dthis = d3.select(this);
		    		 var color = dthis.style("fill");
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke",color).attr("stroke-width","4").transition().duration(100).attr("stroke-width","0")
		    	 });

		  svg.append("g")
		      .attr("class", "axis x bbb")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);
		  svg.append("g")
	      	.attr("class", "axis y")
	      	.call(yAxis);
		  
		  graphx.drawLegend(svg,keys,z,width);
		  
		  if( rotateNeeded ){
			  svg.call(xAxis).selectAll(".tick>text").attr("y", 0).attr("x", 9)
		    		.attr("dy", ".35em").attr("transform", "rotate(-45) translate(0,20)")
		    		.style("text-anchor", "end");
		  }
		  
		},
		stackHorz : function(graphx,id,index){
			kplot.graph.clear( id );
			var data = graphx.getDataArray();
			var $graph = $("#"+id);
			var owidth = $graph.parent().parent().width();
			var oheight = $graph.parent().parent().height();
			$("#"+id+"-title").text( graphx.title() + " " + graphx.titlePostfix);
			var margin = {top: 30, right: 20, bottom: 20, left: 40},
		    width = owidth - margin.left - margin.right,
		    height = oheight - margin.top - margin.bottom;
			var keys = graphx.getKeys();
			var totalWidth = 0;
			var maxWidth = d3.max( data , function(d) { 
				var w = d[graphx.data.fields[0].name].toString().width(); 
				totalWidth += w; 
				return w; });
			
			var rotateNeeded=(totalWidth>(width*0.8))?true:false;
			if( rotateNeeded && margin.bottom < Math.sqrt(2)*maxWidth ){
				margin.bottom = Math.sqrt(2)*maxWidth;
				height = oheight - margin.top - margin.bottom;
			}

			//var x = d3.scale.ordinal().rangeRoundBands([0, width]);
			//var y = d3.scale.linear().rangeRound([height, 0]);
			var x = d3.scale.linear().rangeRound([0,width]);
			var y = d3.scale.ordinal().rangeRoundBands([height,0]);
			var z = graphx.getColors(graphx.data.fields.length);

			var xAxis = d3.svg.axis().scale(x).orient("bottom");

			var yAxis = d3.svg.axis().scale(y).orient("left");

			var vb = "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom)+"";
			var svg = d3.select("#"+id).attr("width", width + margin.left + margin.right)
		    	.attr("height", height + margin.top + margin.bottom)
		    	.attr( "viewBox", vb).append("g")
		    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
			var layers = d3.layout.stack()(keys.map(function(c) {
			    return data.map(function(d) {
			      return {x:d[graphx.data.fields[0].name], y:d[c] };
			    });
			  }));
			
			x.domain([0, d3.max(layers[layers.length - 1], function(d) { return d.y0 + d.y; })]).nice();
			y.domain(layers[0].map(function(d) { return d.x; }));
			
			//x.domain([0, d3.max(layers[layers.length - 1], function(d) { 
			//	return d.x0 + d.x; })]);//.nice();
			//y.domain(layers[0].map(function(d) { return d.y; }));
			
			var layer = svg.selectAll(".layer")
		      .data(layers).enter().append("g")
		      .attr("class", "layer")
		      .style("fill", function(d, i) { return z[i]; });

			var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([-70, 0])
			  .html(function(d,i) {
			    return "<strong>"+d.x+":</strong> <span style='color:yellow'>" + (d.y) + "</span>";
			  });
			
		  layer.selectAll("rect")
		      .data(function(d) { return d; })
		    .enter().append("rect")
		      .attr("x", function(d) { 
		    	  return x(d.y0); })
		      .attr("y", function(d) { 
		    	  return y(d.x); })
		      .attr("height", y.rangeBand() - 1)
		      .attr("width", function(d) { 
		    	  return x(d.y + d.y0)-x(d.y0); } ).call(tip)
			    	 .on("mouseover",function(o,i){
			    		 var dthis = d3.select(this);
			    		 var color = dthis.style("fill");
			    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke",color).attr("stroke-width","2");
			    		 tip.show(o,i);
			    	 })
			    	 .on("mouseout",function(o){
			    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke","").attr("stroke-width","0");
			    		 tip.hide();
			    	 })
			    	 .on("click",function(o){
			    		 var dthis = d3.select(this);
			    		 var color = dthis.style("fill");
			    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke",color).attr("stroke-width","4").transition().duration(100).attr("stroke-width","0")
			    	 });

		  svg.append("g")
		      .attr("class", "axis x bbb")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);
		  
		  graphx.drawLegend(svg,keys,z,width);
		  
		  if( rotateNeeded ){
			  svg.call(xAxis).selectAll(".tick>text").attr("y", 0).attr("x", 9)
		    		.attr("dy", ".35em").attr("transform", "rotate(-45) translate(0,20)")
		    		.style("text-anchor", "end");
		  }
		  svg.append("g")
		      .attr("class", "axis y")
		      //.attr("transform", "translate(" + width + ",0)")
		      .call(yAxis);
		  
		  
		},
		ratio : function(graphx,id,index){
			kplot.graph.clear( id );
			var data = graphx.getDataArray();
			var $graph = $("#"+id);
			var owidth = $graph.parent().parent().width();
			var oheight = $graph.parent().parent().height();
			$("#"+id+"-title").text( graphx.title() + " " + graphx.titlePostfix);
			var margin = {top: 20, right: 100, bottom: 20, left: 40},
		    width = owidth - margin.left - margin.right,
		    height = oheight - margin.top - margin.bottom;
			var keys = graphx.getKeys();
			var totalWidth = 0;
			var maxWidth = d3.max( data , function(d) { 
				var w = d[graphx.data.fields[0].name].toString().width(); 
				totalWidth += w; 
				return w; });
			
			var rotateNeeded=(totalWidth>(width*0.8))?true:false;
			if( rotateNeeded && margin.bottom < Math.sqrt(2)*maxWidth ){
				margin.bottom = Math.sqrt(2)*maxWidth;
				height = oheight - margin.top - margin.bottom;
			}

			var x = d3.scale.ordinal().rangeRoundBands([0, width]);
			var y = d3.scale.linear().rangeRound([height, 0]);
			var z = graphx.getColors(graphx.data.fields.length);//d3.scale.category10();

			var xAxis = d3.svg.axis().scale(x).orient("bottom");
			var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s%"));
			
			var vb = "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom)+"";
			var svg = d3.select("#"+id).attr("width", width + margin.left + margin.right)
		    	.attr("height", height + margin.top + margin.bottom)
		    	.attr( "viewBox", vb).append("g")
		    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
			data.forEach(function(d) {
			    d.values = keys.map(function(name) { return {name: name, value: +d[name]}; });
			});
			
			data.forEach(function(d) {
			    var total = d.values.reduce( function(sum,cur){ return sum + cur.value; }, 0);
			    d.values = d.values.map(function(d){ 
			    	return {name: d.name, value: (d.value/total)*100}; });
			});
			
			var layers = d3.layout.stack()(keys.map(function(c,i) {
			    return data.map(function(d) {
			      return {x: d[graphx.data.fields[0].name], y: d.values[i].value};
			    });
			  }));
			x.domain(layers[0].map(function(d) { return d.x; }));
			y.domain([0, 100]).nice();
			
			var layer = svg.selectAll(".layer")
		      .data(layers).enter().append("g")
		      .attr("class", "layer")
		      .style("fill", function(d, i) { return z[i]; });

			var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([-70, 0])
			  .html(function(d,i) {
			    return "<strong>"+d.x+":</strong> <span style='color:yellow'>" + d3.format(".2s")(d.y) + "%</span>";
			  });
			
			layer.selectAll("rect")
		      .data(function(d) { return d; })
		      .enter().append("rect")
		      .attr("x", function(d) { return x(d.x); })
		      .attr("y", function(d) { return y(d.y + d.y0); })
		      .attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
		      .attr("width", x.rangeBand() - 1).call(tip)
		    	 .on("mouseover",function(o,i){
		    		 var dthis = d3.select(this);
		    		 var color = dthis.style("fill");
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke",color).attr("stroke-width","2");
		    		 tip.show(o,i);
		    	 })
		    	 .on("mouseout",function(o){
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke","").attr("stroke-width","0");
		    		 tip.hide();
		    	 })
		    	 .on("click",function(o){
		    		 var dthis = d3.select(this);
		    		 var color = dthis.style("fill");
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke",color).attr("stroke-width","4").transition().duration(100).attr("stroke-width","0")
		    	 });
			
			layer.selectAll(".bartext")
			  .data(function(d) { return d; })
		      .enter().append("text").attr("class","bartext")
		      .attr("x", function(d) { return x(d.x); })
		      .attr("y", function(d) { return y(d.y + d.y0); })
		      .attr("dx", x.rangeBand()/2)
		      .attr("dy", 10).attr("text-anchor","middle").attr("alignment-baseline","text-before-edge")
		      .style("fill","white").style("font-size","12px")
		      .text(function(d){ return d3.format(".2s")(d.y) + "%"; });
			
		  svg.append("g")
		      .attr("class", "axis x")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);
		  svg.append("g")
	      	.attr("class", "axis y")
	      	.call(yAxis);
		  
		  graphx.drawLegend(svg,keys,z,width+100);
		  
		  if( rotateNeeded ){
			  svg.call(xAxis).selectAll(".tick>text").attr("y", 0).attr("x", 9)
		    		.attr("dy", ".35em").attr("transform", "rotate(-45) translate(0,20)")
		    		.style("text-anchor", "end");
		  }
		  
		},
		pie : function(graphx, id,index){
			kplot.graph.clear( id );
			var data = graphx.getDataArray();
			var idstr = "#"+id;
			var $graph = $(idstr);
			var owidth = $graph.parent().parent().width();
			var oheight = $graph.parent().parent().height();
			$(idstr+"-title").text( graphx.data.fields[index+1].name + " Pie Chart");
			var margin = {top: 20, right: 30, bottom: 20, left: 40},
		    width = owidth - margin.left - margin.right,
		    height = oheight - margin.top - margin.bottom;
			radius = Math.min(width, height) / 2;
			var keys = graphx.getKeys();
			var z = graphx.getColors(2);
			
			data.forEach(function(d) {
			    d.values = keys.map(function(name) { return {name: name, value: +d[name]}; });
			});
			
			var arc = d3.svg.arc()
		    .outerRadius(radius - 10)
		    .innerRadius(0);

			var labelArc = d3.svg.arc()
		    .outerRadius(radius - 40)
		    .innerRadius(radius - 40);

			var pie = d3.layout.pie()
		    .sort(null)
		    .value(function(d) { return d.values[0].value; });
		
			var vb = "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom)+"";
			var svg = d3.select("#"+id).attr("width", width + margin.left + margin.right)
		    	.attr("height", height + margin.top + margin.bottom)
		    	.attr( "viewBox", vb).append("g")
		    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([-70, 0])
			  .html(function(d) {
			    return "<strong>"+d.data[graphx.data.fields[0].name]+":</strong> <span style='color:yellow'>" + d.value + "</span>";
			  });
			
			var g = svg.selectAll(".arc")
		      .data(pie(data)).enter().append("g")
		      .attr("class", "arc").attr("transform", "translate(" + radius + "," + radius + ")");

			g.append("path")
		      .attr("d", arc)
		      .style("fill", function(d,i) { 
		    	  return z[i]; }).call(tip)
			    	 .on("mouseover",function(o,i){
		    		 var dthis = d3.select(this);
		    		 var color = dthis.style("fill");
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke",color).attr("stroke-width","2");
		    		 tip.show(o,i);
		    	 })
		    	 .on("mouseout",function(o){
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke","").attr("stroke-width","0");
		    		 tip.hide();
		    	 })
			    	 .on("click",function(o){
			    		 var dthis = d3.select(this);
			    		 var color = dthis.style("fill");
			    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke",color).attr("stroke-width","4").transition().duration(100).attr("stroke-width","0")
			    	 });

			g.append("text")
		      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
		      .attr("dy", ".35em")
		      .text(function(d) { 
		    	  return d.data[graphx.data.fields[0].name]; });
			rows =data.map(function(d){return d[graphx.data.fields[0].name];});
			
			graphx.drawLegend(svg,rows,z,width,false);
		  
		},
		pie2 : function(graphx,id,index){
			kplot.graph.clear( id );
			var data = graphx.getDataArray();
			
//			data = [{"label":"one", "value":20}, 
//		            {"label":"two", "value":50}, 
//		            {"label":"three", "value":30}];
//			
			var idstr = "#"+id;
			var $graph = $(idstr);
			var owidth = $graph.parent().parent().width();
			var oheight = $graph.parent().parent().height();
			$(idstr+"-title").text( graphx.title() + " Pie Chart");
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
		        .value(function(d) { return d[graphx.data.fields[index+1]]; });    //we must tell it out to access the value of each element in our data array

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
		            .text(function(d, i) { return d.data[graphx.data.fields[0].name]; });        //get the label from our original data array
		},
		line : function( graphx, id , index ){
			kplot.graph.clear( id );
			var data = graphx.getDataArray();
			var $graph = $("#"+id);
			var owidth = $graph.parent().parent().width();
			var oheight = $graph.parent().parent().height();
			$("#"+id+"-title").text( graphx.title() + " " + graphx.titlePostfix);
			var margin = {top: 20, right: 30, bottom: 30, left: 40},
		    width = owidth - margin.left - margin.right,
		    height = oheight - margin.top - margin.bottom;

			var totalWidth = 0;
			var maxWidth = d3.max( data , function(d) { 
				var w = d[graphx.data.fields[0].name].toString().width(); 
				totalWidth += w; 
				return w; });
			var rotateNeeded=(totalWidth>(width*0.8))?true:false;
			if( rotateNeeded && margin.bottom < Math.sqrt(2)*maxWidth ){
				margin.bottom = Math.sqrt(2)*maxWidth;
				height = oheight - margin.top - margin.bottom;
			}
			
			var x = d3.scale.ordinal().rangeRoundBands([0, width]);
			var y = d3.scale.linear().range([height, 0]);
			var z = graphx.getColors(graphx.data.fields.length);//d3.scale.category10();

			var xAxis = d3.svg.axis().scale(x).orient("bottom");
			var yAxis = d3.svg.axis().scale(y).orient("left");
			var vb = "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom)+"";
			var svg = d3.select("#"+id).attr("width", width + margin.left + margin.right)
		    	.attr("height", height + margin.top + margin.bottom)
		    	.attr( "viewBox", vb).append("g")
		    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
			
			var keys = graphx.getKeys();
			 
			x.domain(data.map(function(d){
				 return d[graphx.data.fields[0].name];
			})).rangeRoundBands([0, width]);
			
			var ix = graphx.getMinMax(data,keys);
			if( ix.min > 0 ){ ix.min = 0; }else{ ix.min = ix.min + ix.min*0.2; } ix.max = ix.max + (ix.max-ix.min)*0.2;
			y.domain( [ix.min,ix.max] );
			
			data.forEach(function(d) {
			    d.values = keys.map(function(name) { return {name: name, value: +d[name]}; });
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
		      .style("text-anchor", "end");
			
			var line = d3.svg.line().x(function(d) { 
				return x.rangeBand()/2 + x(d.name); }).y(function(d) { 
					return y(d.value); });
			
			var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([-70, 0])
			  .html(function(d) {
			    return "<strong>"+d.name+":</strong> <span style='color:yellow'>" + d.value + "</span>";
			  });

			
		    keys.map(function(c){return data.map(function(d){return { name:d[graphx.data.fields[0].name],value:d[c]};});})
		      .forEach(function(cold,a){
		    	 var g = svg.append("g");
		    	 g.append("path").attr("class","line").attr("fill","none")
		    	  .attr("stroke-width",2).attr("stroke",z[a]).attr("d", line(cold));
		    	 
		    	 var cir = g.selectAll("c"+a).data(cold).enter().append("circle").attr("class","c"+a)
		    	 .attr("fill",function(d,i){ return z[a]})
		    	 .attr("r",5)
		    	 .attr("cx",function(d,i){ return x.rangeBand()/2 + x(d.name);})
		    	 .attr("cy",function(d,i){ return y(d.value); }).call(tip)
		    	 .on("mouseover",function(o){
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("r",9);
		    		 tip.show(o);
		    	 })
		    	 .on("mouseout",function(o){
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("r",5);
		    		 tip.hide();
		    	 })
		    	 .on("click",function(o){
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("r",15).transition().duration(100).attr("r",5);
		    	 });
		    	 
		      });
			
		   graphx.drawLegend(svg,keys,z,width);
		  
		  if( rotateNeeded ){
			  svg.call(xAxis).selectAll(".tick>text").attr("y", 0).attr("x", 9)
		    		.attr("dy", ".35em").attr("transform", "rotate(45)")
		    		.style("text-anchor", "start");
			}
		    
		},
		complex:function(graphx,id,index){
			kplot.graph.clear( id );
			var data = graphx.getDataArray();
			var $graph = $("#"+id);
			var owidth = $graph.parent().parent().width();
			var oheight = $graph.parent().parent().height();
			$("#"+id+"-title").text( graphx.title() + " " + graphx.titlePostfix );
			var margin = {top: 40, right: 30, bottom: 30, left: 40},
		    width = owidth - margin.left - margin.right,
		    height = oheight - margin.top - margin.bottom;

			var totalWidth = 0;
			var maxWidth = d3.max( data , function(d) { 
				var w = d[graphx.data.fields[0].name].toString().width(); 
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
			var y2 = d3.scale.linear().range([height, 0]);
			
			var colors = graphx.getColors(graphx.data.fields.length);
			var color = d3.scale.ordinal().range(colors);

			var xAxis = d3.svg.axis().scale(x0).orient("bottom");

			var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));
			var y2Axis = d3.svg.axis().scale(y2).orient("right").tickFormat(d3.format(".2s"));

			var vb = "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom)+"";
			var svg = d3.select("#"+id).attr("width", width + margin.left + margin.right)
		    	.attr("height", height + margin.top + margin.bottom)
		    	.attr( "viewBox", vb).append("g")
		    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var keys = graphx.getKeys();
			
			x0.domain( data.map(function(d) { return d[graphx.data.fields[0].name]; }) );
			x1.domain(keys).rangeRoundBands([0, x0.rangeBand()]);
			
			var ix = graphx.getMinMax( data , keys );
			if( ix.min > 0 ){ ix.min = 0; }else{ ix.min = ix.min + ix.min*0.2; } ix.max = ix.max + (ix.max-ix.min)*0.2;
			y.domain( [ix.min,ix.max] );
			y2.domain( [0,100] );
			
			data.forEach(function(d) {
			    d.values = keys.map(function(name) { return {name: name, value: +d[name]}; });
			});
			
			svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);
			
			svg.append("g").attr("class", "y axis")
		      .call(yAxis).append("text")
		      .attr("transform", "translate(0,-30)")
		      //.attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("기온");
		      
		    svg.append("g").attr("class", "y axis")
		    	.attr("transform", "translate(" + width + "," + 0 +")")
		      .call(y2Axis).append("text")
		      .attr("transform", "translate(20,-30)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("평균");
		      
			
			var state = svg.selectAll(".state")
		      .data(data).enter().append("g").attr("class", "state")
		      .attr("transform", function(d) { 
		    	  return "translate(" + x0(d[graphx.data.fields[0].name]) + ",0)"; });

			var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([-70, 0])
			  .html(function(d,i) {
			    return "<strong>"+d.name+":</strong> <span style='color:yellow'>" + (d.value) + "</span>";
			  });
			
			state.selectAll("rect").data( function(d) { return d.values; } ).enter().append("rect").attr("width", x1.rangeBand())
		      .attr("x", function(d) { return x1(d.name); })
		      .attr("y", function(d) { return y(d.value); })
		      .attr("height", function(d) { return height - y(d.value); })
		      .style("fill", function(d) { return color(d.name); }).call(tip)
		    	 .on("mouseover",function(o,i){
		    		 var dthis = d3.select(this);
		    		 var color = dthis.style("fill");
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke",color).attr("stroke-width","2");
		    		 tip.show(o,i);
		    	 })
		    	 .on("mouseout",function(o){
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke","").attr("stroke-width","0");
		    		 tip.hide();
		    	 })
		    	 .on("click",function(o){
		    		 var dthis = d3.select(this);
		    		 var color = dthis.style("fill");
		    		 d3.select(this).transition().duration(500).ease("elastic").attr("stroke",color).attr("stroke-width","4").transition().duration(100).attr("stroke-width","0")
		    	 });

		  var average = true;
		  if( average ){
			  var line = d3.svg.line().x(function(d) { 
					return x0.rangeBand()/2 + x0(d.name); }).y(function(d) { 
						return y2(d.value); });
			  
			  var atip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([-70, 0])
			  .html(function(d) {
			    return "<strong>"+d.name+" 평균 :</strong> <span style='color:yellow'>" + d3.format(".3f")(d.value) + "</span>";
			  });

			var avgData = data.map(function(d){ 
				var sum = 0;
				for( var i = 0 ; i < d.values.length ; i++ ){
					sum += d.values[i].value;
				}
				var avg = Number(sum/d.values.length);
				//console.log("average : " + avg);
				return { name:d[graphx.data.fields[0].name] , value: avg }; });
			
			var g = svg.append("g");
			g.append("path").attr("class","aline").attr("fill","none")
			.attr("stroke-width",2).attr("stroke",colors[keys.length]).attr("d", line(avgData));
			
			g = svg.append("g");
	    	g.selectAll(".cir").data(avgData).enter().append("circle").attr("class","cir")
	    	 .attr("fill",function(d,i){ return colors[keys.length]; })
	    	 .attr("r",5)
	    	 .attr("cx",function(d,i){
	    		 return x0.rangeBand()/2 + x0(d.name);})
	    	 .attr("cy",function(d,i){
	    		// console.log( y(d.value) );
	    		 return y2(d.value); }).call(atip)
	    	 .on("mouseover",function(o){
	    		 d3.select(this).transition().duration(500).ease("elastic").attr("r",9);
	    		 atip.show(o);
	    	 })
	    	 .on("mouseout",function(o){
	    		 d3.select(this).transition().duration(500).ease("elastic").attr("r",5);
	    		 atip.hide();
	    	 })
	    	 .on("click",function(o){
	    		 d3.select(this).transition().duration(500).ease("elastic").attr("r",15).transition().duration(100).attr("r",5);
	    	 });
		  }
		  
		  graphx.drawLegend(svg,keys,colors,width-10);
		  if( rotateNeeded ){
			  svg.call(xAxis).selectAll(".tick>text").attr("y", 0).attr("x", 9)
		    		.attr("dy", ".35em").attr("transform", "rotate(-45) translate(0,20)")
		    		.style("text-anchor", "end");
			}
		  
		}
	},
	getTable : function(id,tableName,tableSource,tableDesc,queryType){
		var msg = new RequestTable();
		msg.prop.requestObject.tableName=tableName;
		msg.prop.requestObject.queryType=queryType;
		msg.prop.requestObject.tableQuery=tableDesc;
		msg.prop.requestObject.dataSource=tableSource;
		
		msg.request(function(receivedData, setting){
			var data = JSON.parse(receivedData.tableContent);
			kplot.addGraphX( new GraphX("table",msg.prop.requestObject.dataSource, msg.prop.requestObject.tableName=tableName, data) );
		},
		function(receivedData, setting){
			
		});
	},
	query: function( dsid, qid ){
		var msg = new RequestQuery();
		msg.prop.requestObject.dataSourceName=$(dsid).text();
		msg.prop.requestObject.query=$(qid).val();
		if( msg.prop.requestObject.query.length > 0 ){
			msg.request( function(receivedData, setting) {
				var data = JSON.parse(receivedData.resultContent);
				kplot.addGraphX( new GraphX("query", msg.prop.requestObject.dataSourceName , msg.prop.requestObject.query, data) );
			},function(receivedData, setting) {
				
			});
		}
	},
	onSave: function( datasource , query ){
		$("#save-datasource").text( datasource );
		$("#save-query").text( query );
	},
	saveQuery: function( name , datasource , query ){
		var msg = new RequestSaveQuery();
		msg.prop.requestObject.name=name;
		msg.prop.requestObject.dataSourceName=datasource;
		msg.prop.requestObject.query=query;
		
		if( msg.prop.requestObject.query.length > 0 ){
			msg.request( function(receivedData, setting) {
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


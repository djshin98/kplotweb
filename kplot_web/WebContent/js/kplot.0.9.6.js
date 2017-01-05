function LegendInfo(){
	this.box = {width:18,height:18};
	this.margin = {text:6,vertical:3};
	this.style = "";
	this.widthOfBox=function(w){ this.box.width=w; return this;};
	this.heightOfBox=function(h){ this.box.height=h; return this;};
	this.textMargin=function(h){ this.margin.text=h; return this;};
	this.verticalMargin=function(h){ this.margin.vertical=h; return this;};
	this.align=function(h){ this.style +=(" "+h); return this;};
};

function SheetX(type,datasource,target,jsonStrData){

	this.requestType = type;
	this.dataSource = datasource;
	this.requestTarget = target;
	this.tip = {offsetx:-70,offsety:0};
	this.columns = null;
	this.data = {rows:[],fields:[]};
	this.originIndex = 0;
	this.graphIndexes = [];
	this.complexBarColumnList = [];
	this.complexLineColumnList = [];
	
	this.merge = function( list,pre,middle,post){
		var name = "";
		var length = 0;
		var type = "number";
		for( var i = 0 ; i < list.length ; i++ ){
			if(i>0){name+="-";}name += this.data.fields[list[i]].name;
			length += this.data.fields[list[i]].length;
			if( type == "number" && this.data.fields[list[i]].type == "string"){
				type = "string";
			}
		}
		for( var i = 0 ; i < this.data.rows.length ; i++ ){
			var sum = (type == "number") ? 0:pre;
			for( var c = 0 ; c < list.length ; c++ ){
				if( type == "number" ){
					sum += this.data.rows[i][this.data.fields[list[c]].name];
				}else{
					sum += (c>0)?middle:"";
					sum += this.data.rows[i][this.data.fields[list[c]].name];
				}
			}
			sum += (type == "number") ? 0:post;
			this.data.rows[i][name] = sum;
		}
		var f = [{name:name,length:length,type:type}];
		this.data.fields = f.concat( this.data.fields );
	};
	this.reverse = function(axisIndex){
		var axisFields = this.data.fields[axisIndex];
		var rowFields = this.data.fields.filter(function(d,i){return (i==axisIndex)?false:true;});
		var rowData = this.data.rows;
		var fields = this.data.rows.map(function(d,i){
			return {name:d[axisFields.name],
				type:rowData.reduce(function(prev,curr){if(prev=="number"){ 
					return $.isNumeric(curr[axisFields.name])?"number":"string"} return prev;},"number"),
				length:rowData.reduce(function(prev,curr){ 
					return $.isNumeric(curr[axisFields.name])?10:curr[axisFields.name].length;},0)};
			});
		//fields = [axisFields].concat(fields);
		var rows = rowFields.map(function(d,i){
			return rowData.map(function(r,i){
				return r[d.name];});
		});
		var newRows = [];
		rows.forEach(function(d,i){
			var row = {};
			row[axisFields.name]=rowFields[i].name;
			for(var i=0;i<d.length;i++){
				row[fields[i].name]=d[i];
			}
			newRows.push(row);
		});
		fields = [axisFields].concat(fields);
		///rows = rows.map(function(d,i){ return [rowFields[i].name].concat(d);});
		return {fields:fields,rows:newRows};
	};
	this.createWindow = function(){
		var ids=kplot.panel.create(1);
		var gw = new kplot.GraphWindow( ids[0] , this );
		kplot.graph.clear(ids[0]);
		kplot.graph.registry(ids[0],gw);
		return gw;
	}
	this.create = function( cols ){	
			 this.data = {rows:[],fields:[]};
			 if( $("#left-pane").length > 0 ){
				 var options = {editable: true,enableAddRow: false,enableCellNavigation: true,asyncEditorLoading: false};
				 
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
	
	this.getColumnCount = function(){
		return this.data.fields.length;
	}
	this.getDataArray = function(){
			return this.data.rows;
		}
	this.grid = {
				setValue : function( row , col , val , brefresh ){
					if( kplot.grid ){
						kplot.grid.getData()[row][col] = val;
						if( brefresh ){kplot.grid.updateCell(row,col+1);}}},
				refresh : function(){
					if( kplot.grid ){
						kplot.grid.invalidate();}}
		};
		
		
	this.getColors = function(len){
		return kplot.colors;
	};
	this.color = function(name){
		if( name && this.data.fields ){
			for( var i = 0 ; i < this.data.fields.length ; i++ ){
				if( this.data.fields[i].name == name ){
					return kplot.colors[i%kplot.colors.length];
				}
			}
		}
		return "black";
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
	this.updateData=function(toDataFromSheet){
		if( toDataFromSheet ){
			
		}else{
			var _grid = this.grid;
			for( var r = 0 ; r < this.data.rows.length ; r++ ){
				var row = this.data.rows[r];
				this.data.fields.forEach(function(d,c){
					_grid.setValue( r , c, row[d.name] , false );
				});
			}
			this.graphIndexes = [];
			for(var i = 1 ; i < this.data.fields.length ; i++){
				this.graphIndexes.push( i );
			}
			this.complexBarColumnList = this.data.fields.filter(function(d,i){ if(i>0)return true;});
			this.complexLineColumnList = [];
			if(this.grid)this.grid.refresh();
		}
	}
	this.createFromJson = function( msgdata ){
			this.create( msgdata.header );
			this.data.rows = [];
			for( var r = 1 ; r < msgdata.rows.length ; r++ ){
				var row = msgdata.rows[r];
				var ojson = {};
				for( var c = 0 ; c < row.length ; c++ ){
					var value = row[c];
					
					if( msgdata.header[c].type == 'number' ){
						value = value.length == 0 ? 0 : parseFloat( value );
					}
					ojson[msgdata.header[c].name] = value;
					this.grid.setValue( r - 1 , c, value , false );
				}
				this.data.rows.push(ojson);
			}
			this.data.fields = msgdata.header;
			this.graphIndexes = [];
			for(var i = 1 ; i < this.data.fields.length ; i++){
				this.graphIndexes.push( i );
			}
			this.complexBarColumnList = this.data.fields.filter(function(d,i){ if(i>0)return true;});
			this.complexLineColumnList = [];
			if(this.grid)this.grid.refresh();
		};
	this.getMinMax = function( data , keys ){
			return {max: parseFloat(d3.max( data, function(d){ var max=d[keys[0]]; for(var i=1;i<keys.length;i++){max=Math.max(max,d[keys[i]]); } return max;})),
					min: parseFloat(d3.min( data, function(d){ var min=d[keys[0]]; for(var i=1;i<keys.length;i++){min=Math.min(min,d[keys[i]]);} return min;}))};
		};
	
	
		
	if( jsonStrData != undefined ){
		this.createFromJson( jsonStrData );
	}else{
		this.create();
	}
		
};
	
var kplot = {
	graphBodyId : "#graph-content",
	colors : ["#3CB371","#1E90FF","#FFA500","#9370DB","#FF4500","#808000",
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
				next : function(){
					kplot.graphWindows.forEach( function(d){
						for( var i=0 ; i < d.drawFunctions.length ; i++ ){
							if( d.drawFunctions[i] == d.drawfn ){
								d.drawfn = d.drawFunctions[(i+1)%d.drawFunctions.length];
								d.redraw();
							}
						}
					}); 
				},
				reverse : function(){
					if( kplot.getCurrentSheet() ){
						var data = kplot.getCurrentSheet().reverse(0);
						kplot.getCurrentSheet().create( data.fields );
						kplot.getCurrentSheet().data = data;
						kplot.getCurrentSheet().updateData(false);
					}
				},
				graph : {
					bar : {
						vertical : function(yaxisIndex,barIndexes) {
							kplot.getCurrentSheet().createWindow().origin(yaxisIndex).columns(barIndexes).verticalBar();
						},
						horizontal : function(yaxisIndex,barIndexes) {
							kplot.getCurrentSheet().createWindow().origin(yaxisIndex).columns(barIndexes).horizontalBar();
						},
						stack : function(yaxisIndex,barIndexes) {
							kplot.getCurrentSheet().createWindow().origin(yaxisIndex).columns(barIndexes).verticalStack();
						},
						stackHorz : function(yaxisIndex,barIndexes) {
							kplot.getCurrentSheet().createWindow().origin(yaxisIndex).columns(barIndexes).horizontalStack();
						},
						ratio : function(yaxisIndex,barIndexes) {
							kplot.getCurrentSheet().createWindow().origin(yaxisIndex).columns(barIndexes).ratio();
						}
					},
					pie : {
						pie : function(yaxisIndex,barIndexes) {
							kplot.getCurrentSheet().createWindow().origin(yaxisIndex).columns(barIndexes).pie();
						},
						donut : function(yaxisIndex,barIndexes) {
							kplot.getCurrentSheet().createWindow().origin(yaxisIndex).columns(barIndexes).pie();
						},
						band : function(yaxisIndex,barIndexes) {
							kplot.getCurrentSheet().createWindow().origin(yaxisIndex).columns(barIndexes).pie();
						}
					},
					histo : {
						vertical : function(yaxisIndex,barIndexes) {
							kplot.getCurrentSheet().createWindow().origin(yaxisIndex).columns(barIndexes).pie();
						},
						horizontal : function(yaxisIndex,barIndexes) {
							kplot.getCurrentSheet().createWindow().origin(yaxisIndex).columns(barIndexes).pie();
						}
					},
					line : function(yaxisIndex,barIndexes){
						kplot.getCurrentSheet().createWindow().origin(yaxisIndex).columns(barIndexes).line();
					},
					complex : function(yaxisIndex,barlist,linelist){
						var li = new LegendInfo();
						li.align("out").align("bottom");
						kplot.getCurrentSheet().createWindow().origin(yaxisIndex).bars(barlist).lines(linelist).legend(li).leftAxisText("Bar").rightAxisText("Line").complex();
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
		redraw : function(id){
			var obj = kplot.graph.findGraphWindow( id );
			if( obj ){
				obj.redraw();
			}
		},
		create : function(div){
			var ids = [];
			
			var id = kplot.panel.id();
			var panel = $('<div class="panel panel-default" style="left:20px;top:100px;"><div class="panel-heading"><div class="panel-title">'
					+'<h4 id="'+id+'-title" ></h4></div></div><div class="panel-body">'
					+'<div class="media"><div class="media-left"></div>'
					+'<div class="media-body svg-container"><svg class="svg-content-responsive" id="'+id+'"></svg></div>'
					+'</div></div></div>');
			panel.css("width","700px");
			//panel.css("left","20px");
			//panel.css("top","100px");
			$( kplot.graphBodyId ).append(panel);
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
				
				kplot.panel.redraw( $svg.attr('id') );
			});
			
			panel.on('onSmallSize.lobiPanel', function(ev, lobiPanel){
				var $svg = $(lobiPanel.$el.find('svg'));
				var owidth = $svg.parent().parent().width();
				var oheight = $svg.parent().parent().height();
				kplot.panel.resize( $svg , owidth , oheight );
				kplot.panel.redraw( $svg.attr('id') );
			});
			panel.on('onPin.lobiPanel', function(ev, lobiPanel){
				var $svg = $(lobiPanel.$el.find('svg'));
				var owidth = $svg.parent().parent().width();
				var oheight = $svg.parent().parent().height();
				kplot.panel.resize( $svg , owidth , oheight );
				kplot.panel.redraw( $svg.attr('id') );
			});
			panel.on('onUnpin.lobiPanel', function(ev, lobiPanel){
				var $svg = $(lobiPanel.$el.find('svg'));
				var owidth = $svg.parent().parent().width();
				var oheight = $svg.parent().parent().height();
				kplot.panel.resize( $svg , owidth , oheight );
				kplot.panel.redraw( $svg.attr('id') );
			});
			panel.on('onReload.lobiPanel', function(ev, lobiPanel){
				var $svg = $(lobiPanel.$el.find('svg'));
				var owidth = $svg.parent().parent().width();
				var oheight = $svg.parent().parent().height();
				kplot.panel.resize( $svg , owidth , oheight );
				
				kplot.panel.redraw( $svg.attr('id') );
			});
			
			panel.on('resizeStop.lobiPanel', function(ev, lobiPanel){
				var $svg = $(lobiPanel.$el.find('svg'));
				var owidth = $svg.parent().parent().width();
				var oheight = $svg.parent().parent().height();
				kplot.panel.resize( $svg , owidth , oheight );
				
				kplot.panel.redraw( $svg.attr('id') );
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
	
	addSheetX : function( sheetx ){
		kplot.sheets.push( sheetx );
		kplot.lastSheet = sheetx;
	},
	getCurrentSheet : function(){
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
	GraphWindow : function(id,sheetx){
		this.id = id;
		this.sheetx = sheetx;
		this.drawfn = null;
		this.data = null;
		this.originIndex = sheetx.originIndex;
		this.graphIndexes = sheetx.graphIndexes;
		this.complexBarColumnList = sheetx.complexBarColumnList;
		this.complexLineColumnList = sheetx.complexLineColumnList;
		this.rowList = sheetx.data.rows.map(function(row,i){return i;});
		this.myData = null;
		
		this.titlePostfix = "";
		this.isShowAverage = function(){return false; }
		this.userTitle = null;	
		this._leftAxisText = null;
		this._rightAxisText = null;
		this.legendInfo = new LegendInfo();
		this.title = function(tit){
			if( tit == undefined ){
				if( this.userTitle == null ){
					var buf = "";
					for(var i = 0 ; i < this.sheetx.data.fields.length ; i++ ){
						if( i > 0 ) buf += " - ";
						buf += this.sheetx.data.fields[i].name;
					}
					return buf;
				}
				return this.userTitle;
			}else{
				this.userTitle = tit;
				$("#"+this.id+"-title").text( this.userTitle + " " + this.titlePostfix);
			}
		};
		this.clear = function(){
			var $graph = $("#"+this.id);
			$graph.empty();
		};
		this.redraw = function(){
			if( this.drawfn ){
				this.clear();
				this.drawfn();
			}
		};
		this.drawTitle = function(){
			$("#"+this.id+"-title").text( this.title() );
		}
		
		this.width = function(){
			var $graph = $("#"+this.id);
			return $graph.parent().parent().width();
		}
		this.height = function(){
			var $graph = $("#"+this.id);
			return $graph.parent().parent().height();
		}
		
		this.originName = function(){
			return this.sheetx.data.fields[this.originIndex].name;
		};
		this.origin = function(yaxisIndex){
			if( yaxisIndex )
				this.originIndex = yaxisIndex;
			return this;
		};
		this.bars = function(list){
			if( list && list.length>0){
				var fieldsLen = sheetx.data.fields.length;
				list = list.filter(function(i){ if( i >= 0 && i < fieldsLen){return true;}else{return false;}});
				this.complexBarColumnList = list;
			}
			return this;
		};
		this.lines = function(list){
			if( list && list.length>0){
				var fieldsLen = sheetx.data.fields.length;
				list = list.filter(function(i){ if( i >= 0 && i < fieldsLen){return true;}else{return false;}});
				this.complexLineColumnList = list;
			}
			return this;
		};
		this.columns = function(list){
			if( list && list.length>0){
				var fieldsLen = sheetx.data.fields.length;
				list = list.filter(function(i){ if( i >= 0 && i < fieldsLen){return true;}else{return false;}});
				this.graphIndexes = list;
			}
			return this;
		};
		this.leftAxisText = function(t){
			this._leftAxisText = t;
			return this;
		};
		this.rightAxisText = function(t){
			this._rightAxisText = t;
			return this;
		};
		this.legend = function(li){
			this.legendInfo = li;
			return this;
		}
		this.rows = function(list){
			if( list )
				this.rowList = list.map(function(d){return d;});
			return this;
		};
		this.dataArray = function(){
			if( this.myData == null ){
				return this.rowList.map( function(d){ return sheetx.data.rows[d]; } );
			}else{
				return this.myData;
			}
		};
		this.columnKeys = function(){ 
			var data = this.sheetx.data;
			return this.graphIndexes.map(function(d){ return data.fields[d].name; }); };
		this.barKeys = function(){ 
			var data = this.sheetx.data;
			if( this.complexBarColumnList.length > 0 ){
				return this.complexBarColumnList.map(function(d){ return data.fields[d].name; });
			}else{
				return columnKeys();
			}
		};
		
		this.lineKeys = function(){ 
			var data = this.sheetx.data;
			return this.complexLineColumnList.map(function(d){ return data.fields[d].name; }); };
		this.drawLegend = function(svg,keys,rectInfo,reverse){
			var width = rectInfo.width;
			var legendTopMargin = 0;
			if(this.legendInfo.style.indexOf("out")>=0){
				width = rectInfo.width + rectInfo.margin.right;
			}else{ if(rectInfo.complex){width -= this.legendInfo.box.width;}}
			var lineHeight = this.legendInfo.box.height+this.legendInfo.margin.vertical;
			
			if(this.legendInfo.style.indexOf("bottom")>=0){
				legendTopMargin = rectInfo.height - (lineHeight * keys.length);
			}
			var legend = svg.selectAll(".legend")
		      .data((reverse == undefined || reverse)?keys.slice().reverse():keys.slice()).enter().append("g")
		      .attr("class", "legend")
		      .attr("transform", function(d, i) { 
		    	  return "translate(0," + ((i*lineHeight)+legendTopMargin) + ")"; });
			
			var sheetx = this.sheetx;
		   legend.append("rect")
		      .attr("x", width - this.legendInfo.box.width)
		      .attr("width", this.legendInfo.box.width)
		      .attr("height", this.legendInfo.box.height)
		      .style("fill", function(d,i){ 
		    	  return sheetx.color(d);});
		   legend.append("text")
		      .attr("x", width - (this.legendInfo.box.width+this.legendInfo.margin.text))
		      .attr("y", 9)
		      .attr("dy", ".35em")
		      .style("text-anchor", "end")
		      .style("font-size", "0.8em")
		      .text(function(d) { return d; });
		};
		this.getRectInfo = function(vertical,complex){
			var owidth = this.width(); 
			var oheight = this.height();
			var margin = {top: 20, right: 0, bottom: 20, left: 30};
			
			var originName = this.originName();
			var data = this.dataArray();
			var totalWidth = data.reduce(function(prev,curr){ return prev+curr[originName].toString().width(); },0);
			var maxWidth = data.reduce(function(prev,curr){ return Math.max(prev,curr[originName].toString().width()); },0);
			
			var keys = (complex) ? this.barKeys().concat( this.lineKeys() ) :  this.columnKeys();
			var ix = this.sheetx.getMinMax( data , keys );
			ix.min = (ix.min >= 0) ? 0 : ix.min*1.2;
			ix.max = ix.max + (ix.max-ix.min)*0.2;
			
			if( this.legendInfo.style.indexOf("out")>=0){
				var fields = this.sheetx.data.fields;
				var maxfieldWidth = 0;
				if( complex ){
					maxfieldWidth = Math.max( this.barKeys().reduce(function(prev,curr){return Math.max(prev,curr.width());},maxfieldWidth),
							this.lineKeys().reduce(function(prev,curr){return Math.max(prev,curr.width());},maxfieldWidth) );
					var xix = this.sheetx.getMinMax( data , this.lineKeys() );
					maxfieldWidth += Math.max( (" "+xix.max).width() ,(" "+xix.min).width() ) + 15;
					
				}else{
					maxfieldWidth = this.columnKeys().reduce(function(prev,curr){ 
						return Math.max(prev,curr.width()); },maxfieldWidth);
				}
				margin.right = maxfieldWidth + this.legendInfo.box.width+this.legendInfo.margin.text;
			}else{
				var maxfieldWidth = 0;
				if( complex ){
					var xix = this.sheetx.getMinMax( data , this.lineKeys() );
					maxfieldWidth += Math.max( (" "+xix.max).width() ,(" "+xix.min).width() );
				}
				margin.right = maxfieldWidth + 10;
			}
			
			if( vertical ){
				margin.left = Math.max( d3.format(".1f")(" "+ix.max).width() ,d3.format(".1f")(" "+ix.min).width() );
			}else{
				margin.left = maxWidth + 10;
			}
		    var width = owidth - margin.left - margin.right;
			var height = oheight - margin.top - margin.bottom;
			
			var rotateNeeded=(totalWidth>(width*0.8))?true:false;
			if( rotateNeeded && margin.bottom < Math.sqrt(2)*maxWidth ){
				margin.bottom = Math.sqrt(2)*maxWidth;
				height = oheight - margin.top - margin.bottom;
			}
			var vb = "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom)+"";
			return {width:width , height:height , margin:margin , rotateNeeded:rotateNeeded , rotate:45,
				viewBox:vb,ix:{min:ix.min,max:ix.max},vertical:vertical,complex:complex};
			
		};
		this.svg = function(id,rectInfo){
			return d3.select("#"+id).attr("width", rectInfo.width + rectInfo.margin.left + rectInfo.margin.right)
	    	.attr("rectInfo.height", rectInfo.height + rectInfo.margin.top + rectInfo.margin.bottom)
	    	.attr( "viewBox", rectInfo.viewBox).append("g")
	    	.attr("transform", "translate(" + rectInfo.margin.left + "," + rectInfo.margin.top + ")");
		};
		this.axisRotateText = function(gObj,rectInfo){
			if( rectInfo.rotateNeeded ){
				gObj.selectAll("text").attr("y", 0).attr("x", 9)
			    	.attr("dy", ".35em").attr("transform", "rotate(-45) translate(0,20)")
			    	.style("text-anchor", "end");
			}
		};
		this.drawXAxis = function(svg,xAxis,rectInfo){
			var xaxis = svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + rectInfo.height + ")")
		      .call(xAxis);
			
			//axisRotateText(xaxis,rectInfo);
			return xaxis;
		}
		this.drawYAxis = function(svg,data,keys,rectInfo,lr){
			var yaxis = {y:null,ix:null,axis:null,text:null}
			yaxis.y = d3.scale.linear().range([rectInfo.height, 0]);
			yaxis.axis = d3.svg.axis().scale(yaxis.y).orient(lr).tickFormat(d3.format(".2s"));

			yaxis.ix = this.sheetx.getMinMax( data , keys );
			yaxis.ix.min = (yaxis.ix.min >= 0) ? 0 : yaxis.ix.min*1.2;
			yaxis.ix.max = yaxis.ix.max + (yaxis.ix.max-yaxis.ix.min)*0.2;
			yaxis.y.domain( [yaxis.ix.min,yaxis.ix.max] );
		  
			if(lr == "right"){
				yaxis.text = svg.append("g").attr("class", "y axis")
		    	.attr("transform", "translate(" + rectInfo.width + "," + 0 +")")
		    	.call(yaxis.axis).append("text")
		    	.attr("transform", "rotate(-90) translate(0,-20)")
		    	.attr("y", 6)
		    	.attr("dy", ".71em")
		    	.style("text-anchor", "end")
		    	.text((this._rightAxisText)?this._rightAxisText:keys.toString());
			}else{
				yaxis.text = svg.append("g").attr("class", "y axis")
				.call(yaxis.axis).append("text")
				.attr("transform", "rotate(-90) translate(0,0)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text((this._leftAxisText)?this._leftAxisText:keys.toString());
			}
			return yaxis;
		}
		
		this.verticalBar = function(){
			this.drawfn = this.verticalBar;
			var sheetx = this.sheetx;
			var data = this.dataArray();
			this.drawTitle();
			var rectInfo = this.getRectInfo(true,false);
			var originName = this.originName();
			var x0 = d3.scale.ordinal().rangeRoundBands([0, rectInfo.width], .1);
			var x1 = d3.scale.ordinal();

			var y = d3.scale.linear().range([rectInfo.height, 0]);

			var xAxis = d3.svg.axis().scale(x0).orient("bottom");
			var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

			var svg = this.svg(this.id,rectInfo);

			var keys = this.columnKeys();
			
			x0.domain( data.map(function(d) { return d[originName]; }) );
			x1.domain(keys).rangeRoundBands([0, x0.rangeBand()]);
			
			var ix = this.sheetx.getMinMax( data , keys );
			ix.min = (ix.min >= 0) ? 0 : ix.min*1.2;
			ix.max = ix.max + (ix.max-ix.min)*0.2;
			y.domain( [ix.min,ix.max] );
			
			data.forEach(function(d) {
			    d.values = keys.map(function(name) { return {name: name, value: +d[name]}; });
			});
			
			var xaxis = this.drawXAxis(svg,xAxis,rectInfo);
			
			svg.append("g").attr("class", "y axis")
		      .call(yAxis).append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end");
		    //  .text("Population");
			
			var state = svg.selectAll(".state")
		      .data(data).enter().append("g").attr("class", "state")
		      .attr("transform", function(d) { 
		    	  return "translate(" + x0(d[originName]) + ",0)"; });

			var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([this.sheetx.tip.offsetx,this.sheetx.tip.offsety])
			  .html(function(d,i) {
			    return "<strong>"+d.name+":</strong> <span style='color:yellow'>" + d3.format(".3f")(d.value) + "</span>";
			  });
			
			state.selectAll("rect").data( function(d) { return d.values; } ).enter().append("rect").attr("width", x1.rangeBand())
		      .attr("x", function(d) {
		    	  return x1(d.name); })
		      .attr("y", function(d) { 
		    	  return y(d.value); })
		      .attr("height", function(d) { return rectInfo.height - y(d.value); })
		      .style("fill", function(d) { return sheetx.color(d.name); }).call(tip)
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

		  if( this.isShowAverage() ){
			  var line = d3.svg.line().x(function(d) { 
					return x0.rangeBand()/2 + x0(d.name); }).y(function(d) { 
						return y(d.value); });
			  
			  var atip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([this.sheetx.tip.offsetx,this.sheetx.tip.offsety])
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
				return { name:d[originName] , value: avg }; });
			
			var g = svg.append("g");
			g.append("path").attr("class","aline").attr("fill","none")
			.attr("stroke-width",2).attr("stroke",kplot.colors[kplot.colors.length-1]).attr("d", line(avgData));
			
			g = svg.append("g");
	    	g.selectAll(".cir").data(avgData).enter().append("circle").attr("class","cir")
	    	 .attr("fill",function(d,i){ return kplot.colors[kplot.colors.length-1]; })
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
		  
		  this.drawLegend(svg,keys,rectInfo);
		  this.axisRotateText( xaxis , rectInfo );
		};
		
		this.horizontalBar = function(){
			this.drawfn = this.horizontalBar;
			var sheetx = this.sheetx;
			var data = this.dataArray();
			this.drawTitle();
			var rectInfo = this.getRectInfo(false,false);
			var originName = this.originName();
			var y0 = d3.scale.ordinal().rangeRoundBands([rectInfo.height, 0], .1);
			var y1 = d3.scale.ordinal();

			var x = d3.scale.linear().range([0,rectInfo.width]);
			
			var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format(".2s"));

			var yAxis = d3.svg.axis().scale(y0).orient("left");

			var svg = this.svg(this.id, rectInfo);
			
			var keys = this.columnKeys();
			y0.domain( data.map(function(d) { return d[originName]; }) );
			y1.domain(keys).rangeRoundBands([0, y0.rangeBand()]);
			
			var ix = this.sheetx.getMinMax( data , keys );
			ix.min = (ix.min >= 0) ? 0 : ix.min*1.2;
			ix.max = ix.max + (ix.max-ix.min)*0.2;
			x.domain( [ix.min,ix.max] );
			
			data.forEach(function(d) {
			    d.values = keys.map(function(name) { return {name: name, value: +d[name]}; });
			});
			
			var xaxis = this.drawXAxis(svg,xAxis,rectInfo);
			
			svg.append("g").attr("class", "y axis")
		      .call(yAxis).append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end");
			
			var state = svg.selectAll(".state")
		      .data(data).enter().append("g").attr("class", "state")
		      .attr("transform", function(d) { 
		    	  return "translate(0," + y0(d[originName]) +")"; });

			var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([this.sheetx.tip.offsetx,this.sheetx.tip.offsety])
			  .html(function(d,i) {
			    return "<strong>"+d.name+":</strong> <span style='color:yellow'>" + d3.format(".3f")(d.value) + "</span>";
			  });
			
			state.selectAll("rect").data( function(d) { return d.values; } ).enter().append("rect").attr("height", y1.rangeBand()<1?1:y1.rangeBand())
		      .attr("x", function(d) {
		    	  return 1; })
		      .attr("y", function(d) { 
		    	  return y1(d.name); })
		      .attr("width", function(d) { return x(d.value); })
		      .style("fill", function(d) { return sheetx.color(d.name); }).call(tip)
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

			this.drawLegend(svg,keys,rectInfo);
			this.axisRotateText( xaxis , rectInfo );
		};
		
		this.verticalStack = function(){
			this.drawfn = this.verticalStack;
			var sheetx = this.sheetx;
			var data = this.dataArray();
			this.drawTitle();
			var rectInfo = this.getRectInfo(true,false);
			var originName = this.originName();
			var x = d3.scale.ordinal().rangeRoundBands([0, rectInfo.width]);
			var y = d3.scale.linear().rangeRound([rectInfo.height, 0]);
			//var z = sheetx.getColors(sheetx.data.fields.length);//d3.scale.category10();
			var keys = this.columnKeys();
			
			var xAxis = d3.svg.axis().scale(x).orient("bottom");
			var yAxis = d3.svg.axis().scale(y).orient("left");
			var svg = this.svg(this.id, rectInfo);
			
			var layers = d3.layout.stack()(keys.map(function(c) {
			    return data.map(function(d) {
			      return {cname:c,x: d[originName], y: d[c]};
			    });
			  }));
			x.domain(layers[0].map(function(d) { return d.x; }));
			y.domain([0, d3.max(layers[layers.length - 1], function(d) { return d.y0 + d.y; })]).nice();
			
			var layer = svg.selectAll(".layer")
		      .data(layers).enter().append("g")
		      .attr("class", "layer")
		      .style("fill", function(d, i) { 
		    	  return sheetx.color(d[i].cname); });

			var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([this.sheetx.tip.offsetx,this.sheetx.tip.offsety])
			  .html(function(d,i) {
			    return "<strong>"+d.x+":</strong> <span style='color:yellow'>" + d3.format(".3f")(d.y) + "</span>";
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

		  var xaxis = this.drawXAxis(svg,xAxis,rectInfo);
		  svg.append("g")
	      	.attr("class", "axis y")
	      	.call(yAxis);
		  
		  this.drawLegend(svg,keys,rectInfo);
		  this.axisRotateText( xaxis , rectInfo );
		};
		
		this.horizontalStack = function(){
			this.drawfn = this.horizontalStack;
			var sheetx = this.sheetx;
			var data = this.dataArray();
			this.drawTitle();
			var rectInfo = this.getRectInfo(false,false);
			var originName = this.originName();
			//var x = d3.scale.ordinal().rangeRoundBands([0, rectInfo.width]);
			//var y = d3.scale.linear().rangeRound([rectInfo.height, 0]);
			var x = d3.scale.linear().rangeRound([0,rectInfo.width]);
			var y = d3.scale.ordinal().rangeRoundBands([rectInfo.height,0]);
			var z = sheetx.getColors(sheetx.data.fields.length);
			var keys = this.columnKeys();
			
			var xAxis = d3.svg.axis().scale(x).orient("bottom");
			var yAxis = d3.svg.axis().scale(y).orient("left");

			var svg = this.svg(this.id, rectInfo);
			
			var layers = d3.layout.stack()(keys.map(function(c) {
			    return data.map(function(d) {
			      return {cname:c,x:d[originName], y:d[c] };
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
		      .style("fill", function(d, i) { return sheetx.color(d[i].cname); });

			var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([this.sheetx.tip.offsetx,this.sheetx.tip.offsety])
			  .html(function(d,i) {
			    return "<strong>"+d.x+":</strong> <span style='color:yellow'>" + d3.format(".3f")(d.y) + "</span>";
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

		  var xaxis = this.drawXAxis(svg,xAxis,rectInfo);
		  
		  this.drawLegend(svg,keys,rectInfo);
		  this.axisRotateText( xaxis , rectInfo );
		  
		  svg.append("g")
		      .attr("class", "axis y")
		      //.attr("transform", "translate(" + rectInfo.width + ",0)")
		      .call(yAxis);
		  
		  
		};
		this.ratio = function(sheetx,id,index){
			this.drawfn = this.ratio;
			
			var sheetx = this.sheetx;
			var data = this.dataArray();
			this.drawTitle();
			var rectInfo = this.getRectInfo(true,false);
			var originName = this.originName();
			var x = d3.scale.ordinal().rangeRoundBands([0, rectInfo.width]);
			var y = d3.scale.linear().rangeRound([rectInfo.height, 0]);
			var keys = this.columnKeys();
			
			var xAxis = d3.svg.axis().scale(x).orient("bottom");
			var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s%"));
			
			var svg = this.svg(this.id, rectInfo);
			
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
			      return {cname:c,x: d[originName], y: d.values[i].value};
			    });
			  }));
			x.domain(layers[0].map(function(d) { return d.x; }));
			y.domain([0, 100]).nice();
			
			var layer = svg.selectAll(".layer")
		      .data(layers).enter().append("g")
		      .attr("class", "layer")
		      .style("fill", function(d, i) {return sheetx.color(d[i].cname); });

			var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([this.sheetx.tip.offsetx,this.sheetx.tip.offsety])
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
			
		  var xaxis = svg.append("g")
		      .attr("class", "axis x")
		      .attr("transform", "translate(0," + rectInfo.height + ")")
		      .call(xAxis);
		  svg.append("g")
	      	.attr("class", "axis y")
	      	.call(yAxis);
		  
		  this.drawLegend(svg,keys,rectInfo);
		  this.axisRotateText( xaxis , rectInfo );
		};
		
		this.pie = function(){
			this.drawfn = this.pie;
			var sheetx = this.sheetx;
			var data = this.dataArray();
			this.drawTitle();
			var rectInfo = this.getRectInfo(true,false);
			var owidth = this.width(); 
			var oheight = this.height();
			
			var originName = this.originName();
			
			var margin = {top: 20, right: 30, bottom: 20, left: 40},
		    width = owidth - margin.left - margin.right,
		    height = oheight - margin.top - margin.bottom;
			radius = Math.min(width, height) / 2;
			var keys = this.columnKeys();
			var z = sheetx.getColors(2);
			
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
		
			var svg = this.svg(this.id, rectInfo);

			var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([this.sheetx.tip.offsetx,this.sheetx.tip.offsety])
			  .html(function(d) {
			    return "<strong>"+d.data[originName]+":</strong> <span style='color:yellow'>" + d3.format(".3f")(d.value) + "</span>";
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
		    	  return d.data[originName]; });
			rows =data.map(function(d){return d[originName];});
			
			this.drawLegend(svg,rows,rectInfo,false);
		  
		};
		this.pie2 = function(){
			this.drawfn = this.pie2;
			var sheetx = this.sheetx;
			var data = this.dataArray();
			var owidth = this.width(); 
			var oheight = this.height();
			this.drawTitle();
			var rectInfo = this.getRectInfo(true,false);
			var originName = this.originName();
			
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
		        .value(function(d) { return d[sheetx.data.fields[index+1]]; });    //we must tell it out to access the value of each element in our data array

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
		            .text(function(d, i) { return d.data[originName]; });        //get the label from our original data array
		};
		
		this.line = function(){
			this.drawfn = this.line;
			var sheetx = this.sheetx;
			var data = this.dataArray();
			this.drawTitle();
			var rectInfo = this.getRectInfo(true,false);
			var originName = this.originName();
			var x = d3.scale.ordinal().rangeRoundBands([0, rectInfo.width]);
			var y = d3.scale.linear().range([rectInfo.height, 0]);
			//var z = sheetx.getColors(sheetx.data.fields.length);//d3.scale.category10();

			var xAxis = d3.svg.axis().scale(x).orient("bottom");
			var yAxis = d3.svg.axis().scale(y).orient("left");

			var svg = this.svg(this.id, rectInfo);
			
			var keys = this.columnKeys();
			 
			x.domain(data.map(function(d){ return d[originName];})).rangeRoundBands([0, rectInfo.width]);
			
			var ix = this.sheetx.getMinMax(data,keys);
			ix.min = (ix.min >= 0) ? 0 : ix.min*1.2;
			ix.max = ix.max + (ix.max-ix.min)*0.2;
			y.domain( [ix.min,ix.max] );
			
			data.forEach(function(d) {
			    d.values = keys.map(function(name) { return {name: name, value: +d[name]}; });
			});
			var xaxis = this.drawXAxis(svg,xAxis,rectInfo);
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
			  .offset([this.sheetx.tip.offsetx,this.sheetx.tip.offsety])
			  .html(function(d) {
			    return "<strong>"+d.name+":</strong> <span style='color:yellow'>" + d3.format(".3f")(d.value) + "</span>";
			  });

			
		    keys.map(function(c){return data.map(function(d){return { cname:c,name:d[originName],value:d[c]};});})
		      .forEach(function(cold,a){
		    	 var g = svg.append("g");
		    	 var color = sheetx.color(cold[a].cname);
		    	 g.append("path").attr("class","line").attr("fill","none")
		    	  .attr("stroke-width",2).attr("stroke",color).attr("d", line(cold));
		    	 
		    	 var cir = g.selectAll("c"+a).data(cold).enter().append("circle").attr("class","c"+a)
		    	 .attr("fill",color)
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
			
		   this.drawLegend(svg,keys,rectInfo);
		   this.axisRotateText( xaxis , rectInfo );
		   
		   console.log("margin top,bottom : " + rectInfo.margin.top + "," + rectInfo.margin.bottom );
		};
		
		this.complex = function(){
			this.drawfn = this.complex;
			var sheetx = this.sheetx;
			var data = this.dataArray();
			this.drawTitle();
			var rectInfo = this.getRectInfo(true,true);
			var originName = this.originName();

			var x0 = d3.scale.ordinal().rangeRoundBands([0, rectInfo.width], .1);
			var x1 = d3.scale.ordinal();
			
			var colors = sheetx.getColors(sheetx.data.fields.length);
			var color = d3.scale.ordinal().range(colors);

			var xAxis = d3.svg.axis().scale(x0).orient("bottom");

			var svg = this.svg(this.id, rectInfo);

			var keys = sheetx.getKeys();
			var barKeys = this.barKeys();
			
			x0.domain( data.map(function(d) { return d[originName]; }) );
			x1.domain(barKeys).rangeRoundBands([0, x0.rangeBand()]);
			
			
			
			data.forEach(function(d) {
			    d.values = barKeys.map(function(name) { 
			    	return {name: name, value: +d[name]}; });
			});
			
			var xaxis = this.drawXAxis(svg,xAxis,rectInfo);
			var yaxis = this.drawYAxis(svg,data,barKeys,rectInfo,"left");
			
			var state = svg.selectAll(".state")
		      .data(data).enter().append("g").attr("class", "state")
		      .attr("transform", function(d) { 
		    	  return "translate(" + x0(d[originName]) + ",0)"; });

			var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([this.sheetx.tip.offsetx,this.sheetx.tip.offsety])
			  .html(function(d,i) {
			    return "<strong>"+d.name+":</strong> <span style='color:yellow'>" + d3.format(".3f")(d.value) + "</span>";
			  });
			
			state.selectAll("rect").data( function(d) { return d.values; } ).enter().append("rect").attr("width", x1.rangeBand())
		      .attr("x", function(d) { 
		    	  return x1(d.name); })
		      .attr("y", function(d) { 
		    	  return yaxis.y(d.value); })
		      .attr("height", function(d) { return rectInfo.height - yaxis.y(d.value); })
		      .style("fill", function(d) { return sheetx.color(d.name); }).call(tip)
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
	      var lineKeys = this.lineKeys();
		  if( lineKeys.length > 0 ){
			  var yaxis2 = this.drawYAxis(svg,data,lineKeys,rectInfo,"right");
			  var line = d3.svg.line().x(function(d) { 
					return x0.rangeBand()/2 + x0(d.xname); }).y(function(d) { 
						var color = sheetx.color(d.name); 
						svg.append("circle").attr("fill",color).attr("name",d.xname +" "+d.name).attr("value",d.value).attr("r",5).attr("cx",x0.rangeBand()/2 + x0(d.xname))
				    	 .attr("cy",yaxis2.y(d.value)).call(atip)
				    	 .on("mouseover",function(o){
				    		 d3.select(this).transition().duration(500).ease("elastic").attr("r",9);
				    		 var data={name:d3.select(this).attr("name"),value:d3.select(this).attr("value")};
				    		 atip.show(data);
				    	 })
				    	 .on("mouseout",function(o){
				    		 d3.select(this).transition().duration(500).ease("elastic").attr("r",5);
				    		 atip.hide();
				    	 })
				    	 .on("click",function(o){
				    		 d3.select(this).transition().duration(500).ease("elastic").attr("r",15).transition().duration(100).attr("r",5);
				    	 });
				    	 
						return yaxis2.y(d.value); });
			  
			  var atip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([this.sheetx.tip.offsetx,this.sheetx.tip.offsety])
			  .html(function(d) {
			    return "<strong>"+d.name+" :</strong> <span style='color:yellow'>" + d3.format(".3f")(d.value) + "</span>";
			  });
			  
			  var ll = lineKeys.map(function(c,i){ 
				  var f = c;
				  return data.map(function(d,i){ 
					  return {xname:d[originName], name:c, value: +d[c]}; }); });
			 
			var g = svg.append("g");
			g.selectAll(".xl").data(ll).enter().append("path").attr("class","xl").attr("fill","none")
			.attr("stroke-width",2).attr("stroke",function(d,i){return sheetx.color(lineKeys[i])}).attr("d", function(d){ return line(d);});
			
			svg.append("g").attr("id","xg");
			
		  }
		  
		  this.drawLegend(svg, barKeys.concat(lineKeys) ,rectInfo);
		  this.axisRotateText( xaxis , rectInfo );
		};
		this.bar = function(){
			this.drawfn = this.bar;
			var sheetx = this.sheetx;
			var data = this.dataArray();
			this.drawTitle();
			var rectInfo = this.getRectInfo(true,false);
			var originName = this.originName();
			// Scale	
			var x0 = d3.scale.ordinal().rangeRoundBands([0, rectInfo.width], 0.1);
			var y = d3.scale.linear().range([rectInfo.height, 0]);

			// Axis
			var xAxis = d3.svg.axis().scale(x0).orient("bottom");
			var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10, "");

			var keys = this.columnKeys();
			
			var svg = this.svg(this.id, rectInfo);
			
			x0.domain( data.map(function(d) { return d[originName]; }) );
			
			var ix = this.sheetx.getMinMax(data,keys);
			ix.min = (ix.min >= 0) ? 0 : ix.min*1.2;
			ix.max = ix.max + (ix.max-ix.min)*0.2;
			y.domain( [ix.min,ix.max] );
			
			var xaxis = this.drawXAxis(svg,xAxis,rectInfo);
			svg.append("g").attr("class", "y axis").call(yAxis);  
			
			svg.selectAll(".bar").data(data).enter().append("rect").attr("class", "bar")
			.attr("x", function(d) { 
				return x0(d[originName]); 
				}).attr("y", function(d) { 
					return y(d[sheetx.data.fields[1].name]); 
					})
			.attr("height", function(d) { 
				return rectInfo.height - y(d[sheetx.data.fields[1].name]); }).attr("width", x0.rangeBand());
			
			this.axisRotateText( xaxis , rectInfo );
		};
		this.drawFunctions = [
			this.verticalBar,this.horizontalBar,this.verticalStack,this.horizontalStack,
			this.ratio,this.pie,this.line,this.complex
		];
	},
	graphWindows : [],
	graph : {
		clear : function( id ){
			var $graph = $("#"+id);
			$graph.empty();
		},
		registry : function( id , graphWindow ){
			kplot.graphWindows = kplot.graphWindows.filter( function(d){ return ( d.id == id ) ? false : true;});
			kplot.graphWindows.push(graphWindow);
			console.log( "registry : " + kplot.graphWindows.every(function(d){ console.log(d.id); return true;}) );
		},
		findGraphWindow : function( id ){
			var x = kplot.graphWindows.filter( function(d){return (d.id==id)? true : false; } );
			if( x.length > 0 ){
				console.log( "---->" + x[0].id );
				return x[0];
			}
			return null;
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
			if( data.message ){
				alert( data.message );
			}else{
				kplot.addSheetX( new SheetX("table",msg.prop.requestObject.dataSource, msg.prop.requestObject.tableName=tableName, data) );
			}
		},
		function(receivedData, setting){
			
		});
	},
	query: function( ds, q, fn ){
		var msg = new RequestQuery();
		msg.prop.requestObject.dataSourceName=ds;
		msg.prop.requestObject.query=q;
		if( msg.prop.requestObject.query.length > 0 ){
			msg.request( function(receivedData, setting) {
				var data = JSON.parse(receivedData.resultContent);
				kplot.addSheetX( new SheetX("query", msg.prop.requestObject.dataSourceName , msg.prop.requestObject.query, data) );
				if(fn)fn(kplot.getCurrentSheet(),kplot.getCurrentSheet().data);
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


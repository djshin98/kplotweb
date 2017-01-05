var page = {
		prev : function(){
			M.data.global("back-action",true);
			$.mobile.back();
		},
		isPrevAction : function(){
			a = M.data.global("back-action");
			if( a != null && a != undefined ){return a;}
			return false;
		},
		releasePrevAction : function(){
			M.data.global("back-action",false);
		},
		panellink : function( url ){
			$.mobile.changePage( url , {transition:"slide", reverse:true,changeHash:true});
		}
};

function NoResult( target ){
	var result = "";
	result = "<div style='align-content: center;color: #CCC6C6;text-indent: 35%;'>"+localeString( locale.resultZero );
	result += "</div>";
	target.html( result );
}
function IVNF_H( source ){
	this.value = source.html();
	if( this.value == null || this.value.length == 0 ){
		source.click();
		return null;
	}
	return this.value;
}

function IVNF_V( source ){
	this.value = source.val();
	if( this.value == null || this.value.length == 0 ){
		source.focus();
		source.click();
		return null;
	}
	return this.value;
}
function IVNF_C( source ){
	this.value = source.data('code');
	if( this.value == null || this.value.length == 0 ){
		source.focus();
		source.click();
		return null;
	}
	return this.value;
}
function IVNF_VT( source ){
	this.value = source.val();
	if( this.value == null || this.value.length == 0 ){
		source.click();
		return null;
	}else{
		date = new Date();
		 this.value += " " + date.timeNow();
	}
	return this.value;
}

Date.prototype.timeNow = function(){
	return ( (this.getHours() < 10 )?"0":"") + this.getHours() + ":" + ((this.getMinutes() < 10 )?"0":"") + this.getMinutes() + ":" + ((this.getSeconds() < 10 )?"0":"") + this.getSeconds(); 
}
Date.prototype.today = function(){
	return this.getFullYear() + "-" + (((this.getMonth()+1) < 10 )?"0":"") + (this.getMonth()+1) + "-" + ((this.getDate() < 10 )?"0":"") + this.getDate(); 
}
function getCurrentTime(){
	var yymmddhhmmss = new Date();
	return yymmddhhmmss.today() + " " + yymmddhhmmss.timeNow();
}

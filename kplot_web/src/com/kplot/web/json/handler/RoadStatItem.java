package com.kplot.web.json.handler;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

public class RoadStatItem {
	public String 		reg;
	public String 		road;
	
	HashMap<String,RoadStatDateItem> dateDstMap = new HashMap<String,RoadStatDateItem>();
	int count = 0;
	public RoadStatItem(String reg, String road) {
		this.reg = reg;
		this.road = road;
	}

	public void append(String date , double dst) {
		RoadStatDateItem item = dateDstMap.get(date);
		if( item == null ){
			item = new RoadStatDateItem( date );
			dateDstMap.put( date, item);
		}
		item.append( dst );
	}
	public void clear(){
		count = 0;
		dateDstMap = new HashMap<String,RoadStatDateItem>();
	}
	public void end(){
		Set<String> set = dateDstMap.keySet();
		Iterator<String> iter = set.iterator();
		
		while( iter.hasNext() ){
			dateDstMap.get( iter.next() ).end();
		}
	}

	public double getDST(String date) {
		if( dateDstMap.get(date) != null ){
			return dateDstMap.get(date).getValue();
		}
		return 0;
	}

}

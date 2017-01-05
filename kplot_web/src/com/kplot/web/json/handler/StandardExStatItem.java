package com.kplot.web.json.handler;

import java.util.HashMap;

public class StandardExStatItem {
	public String 		sido;
	public String 		sgg;
	public double totalRoadCount;
	public double standardExRoadCount;
	public double standardExRatio;
	
	private HashMap<String,String> troad = new HashMap<String,String>(); 
	
	public StandardExStatItem(String sido, String sgg) {
		this.sido = sido;
		this.sgg = sgg;
	}

	public void append(double dst, String road) {
		if( dst > 200 ){
			standardExRoadCount++;
		}
		totalRoadCount++;
		
		troad.put(road, road);
	}
	public void clear(){
		totalRoadCount = 0;
		standardExRoadCount = 0;
		standardExRatio = 0;
		troad = new HashMap<String,String>(); 
	}
	public void end(){
		this.standardExRatio = (standardExRoadCount / totalRoadCount) * 100 ;
	}

}

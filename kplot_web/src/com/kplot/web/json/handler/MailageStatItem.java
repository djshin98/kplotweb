package com.kplot.web.json.handler;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

public class MailageStatItem {
	public String 		sido;
	public String 		sgg;
	
	private HashMap<String,MailageInfo> carMap = new HashMap<String,MailageInfo>(); 
	
	public MailageStatItem(String sido, String sgg, ArrayList<String> cars) {
		this.sido = sido;
		this.sgg = sgg;
		for( String str : cars){
			carMap.put(str, new MailageInfo());
		}
	}

	public void append(String car , int cnt, double km) {
		MailageInfo minfo = carMap.get( car );
		if( minfo != null ){
			minfo.count = cnt;
			minfo.km = km;
		}
	}
	public void clear(){
	}
	public void end(){
	}
	
	public class MailageInfo{
		public int count=0;
		public double km=0;
	}

	public int getCount(String car) {
		MailageInfo minfo = carMap.get( car );
		if( minfo != null ){
			return minfo.count;
		}
		return 0;
	}

	public double getDistance(String car) {
		MailageInfo minfo = carMap.get( car );
		if( minfo != null ){
			return minfo.km;
		}
		return 0;
	}

	public int getCountSummary() {
		Set<String> set = carMap.keySet();
		Iterator<String> iter = set.iterator();
		int sum = 0;
		while( iter.hasNext() ){
			sum += carMap.get( iter.next() ).count;
		}
		return sum;
	}

	public double getDistanceSummary() {
		Set<String> set = carMap.keySet();
		Iterator<String> iter = set.iterator();
		double sum = 0;
		while( iter.hasNext() ){
			sum += carMap.get( iter.next() ).km;
		}
		return sum;
	}

}

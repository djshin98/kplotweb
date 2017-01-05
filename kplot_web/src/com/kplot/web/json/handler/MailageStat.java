package com.kplot.web.json.handler;

import java.util.ArrayList;
import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class MailageStat extends Stat{
	ArrayList<MailageStatItem> list = new ArrayList<MailageStatItem>(); 
	HashMap<String,MailageStatItem> map = new HashMap<String,MailageStatItem>();
	
	ArrayList<String> cars;
	public MailageStat(ArrayList<String> cars) {
		this.cars = cars;
	}
	public void append(String sido, String sgg , String car, int cnt, double km) {
		String key = sido + "-" + sgg;
		MailageStatItem item = map.get(key);
		if( item == null ){
			item = new MailageStatItem(sido,sgg,cars);
			map.put( key , item);
			list.add( item );
		}
		
		item.append( car , cnt , km );
		
	}
	public JSONArray getHeader() throws JSONException{
		JSONArray header = new JSONArray();
		header.put( COLUMN("시도",10,"string") );
		header.put( COLUMN("시군구",10,"string") );
		for( String car : cars ){
			header.put( COLUMN(car+" 도로",10,"number") );
			header.put( COLUMN(car+" 거리",10,"number") );
		}
		
		header.put( COLUMN("계 도로",10,"number") );
		header.put( COLUMN("계 거리",10,"number") );
		
		return header;
	}
	public JSONArray getRows() throws JSONException{
		JSONArray rows = new JSONArray();
		JSONArray row = new JSONArray();
		row.put("SIDO");
		row.put("SGG");
		for( String car : cars ){
			row.put(car + " CNT");
			row.put(car + " DIST");
		}
		row.put("SUM CNT");
		row.put("SUM DIST");
		rows.put( row );
		for( int i =0 ; i < list.size() ; i++){
			MailageStatItem item = list.get(i);
			row = new JSONArray();
			row.put(item.sido);
			row.put(item.sgg);
			for( String car : cars ){
				row.put(item.getCount(car));
				row.put(item.getDistance(car));
			}
			row.put(item.getCountSummary());
			row.put(item.getDistanceSummary());
			rows.put( row );
		}
		return rows;
	}
	
	public String toString(){
		for( int i =0 ; i < list.size() ; i++){
			MailageStatItem item = list.get(i);
			item.end();
		}
		JSONObject obj = new JSONObject();
		try {
			JSONArray header = getHeader();
			JSONArray rows = getRows();
			obj.put( "header", header );
			obj.put( "rows", rows );
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return obj.toString();
	}

}

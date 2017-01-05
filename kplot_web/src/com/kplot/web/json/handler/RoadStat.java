package com.kplot.web.json.handler;

import java.util.ArrayList;
import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class RoadStat extends Stat{
	ArrayList<RoadStatItem> list = new ArrayList<RoadStatItem>(); 
	HashMap<String,RoadStatItem> map = new HashMap<String,RoadStatItem>(); 
	
	ArrayList<String> columns = new ArrayList<String>(); 
	HashMap<String,String> columnMap = new HashMap<String,String>(); 
	
	public void append(String reg, String date , double dst, double dsb, double km, String road) {
		String key = reg + " " + road;
		RoadStatItem item = map.get(key);
		if( item == null ){
			item = new RoadStatItem(reg,road);
			map.put( key , item);
			list.add( item );
		}
		String fd = columnMap.get( date );
		if( fd == null ){
			columns.add( date );
			columnMap.put( date, date);
		}
		item.append( date, dst );
		
	}
	public JSONArray getHeader() throws JSONException{
		JSONArray header = new JSONArray();
		header.put( COLUMN("지역명",10,"string") );
		header.put( COLUMN("도로명(방향)",10,"string") );
		
		for( int i = 0 ; i < columns.size() ; i++ ){
			header.put( COLUMN(columns.get(i),10,"number") );
		}
		return header;
	}
	public JSONArray getRows() throws JSONException{
		JSONArray rows = new JSONArray();
		JSONArray row = new JSONArray();
		row.put("REG");
		row.put("ROAD");
		for( int i = 0 ; i < columns.size() ; i++ ){
			row.put( columns.get(i) );
		}
		rows.put( row );
		for( int i =0 ; i < list.size() ; i++){
			RoadStatItem item = list.get(i);
			row = new JSONArray();
			row.put(item.reg);
			row.put(item.road);
			for( int c = 0 ; c < columns.size() ; c++ ){
				row.put(item.getDST(columns.get(c)));
			}
			rows.put( row );
		}
		return rows;
	}
	
	public String toString(){
		for( int i =0 ; i < list.size() ; i++){
			RoadStatItem item = list.get(i);
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

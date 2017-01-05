package com.kplot.web.json.handler;

import java.util.ArrayList;
import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class StandardExStat extends Stat{
	ArrayList<StandardExStatItem> list = new ArrayList<StandardExStatItem>(); 
	HashMap<String,StandardExStatItem> map = new HashMap<String,StandardExStatItem>(); 
	public void append(String sido, String sgg , double dst, String road) {
		String key = sido + "-" + sgg;
		StandardExStatItem item = map.get(key);
		if( item == null ){
			item = new StandardExStatItem(sido,sgg);
			map.put( key , item);
			list.add( item );
		}
		
		item.append( dst ,road );
		
	}
	public JSONArray getHeader() throws JSONException{
		JSONArray header = new JSONArray();
		header.put( COLUMN("시도",10,"string") );
		header.put( COLUMN("시군구",10,"string") );
		header.put( COLUMN("측정도로수",10,"number") );
		header.put( COLUMN("초과도로수",10,"number") );
		header.put( COLUMN("초과율(%)",10,"number") );
		return header;
	}
	public JSONArray getRows() throws JSONException{
		JSONArray rows = new JSONArray();
		JSONArray row = new JSONArray();
		row.put("SIDO");
		row.put("SGG");
		row.put("ROADS");
		row.put("EXROADS");
		row.put("EXRATIO");
		rows.put( row );
		for( int i =0 ; i < list.size() ; i++){
			StandardExStatItem item = list.get(i);
			row = new JSONArray();
			row.put(item.sido);
			row.put(item.sgg);
			row.put(item.totalRoadCount);
			row.put(item.standardExRoadCount);
			row.put(item.standardExRatio);
			rows.put( row );
		}
		return rows;
	}
	
	public String toString(){
		for( int i =0 ; i < list.size() ; i++){
			StandardExStatItem item = list.get(i);
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

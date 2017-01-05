package com.kplot.web.json.handler;

import java.util.ArrayList;
import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class AreaStat extends Stat{
	ArrayList<AreaStatItem> list = new ArrayList<AreaStatItem>(); 
	HashMap<String,AreaStatItem> map = new HashMap<String,AreaStatItem>(); 
	public void append(String sido, String sgg , double dst, double dsb, double km, String road) {
		String key = sido + "-" + sgg;
		AreaStatItem item = map.get(key);
		if( item == null ){
			item = new AreaStatItem(sido,sgg);
			map.put( key , item);
			list.add( item );
		}
		
		item.append( dst , dsb , km, road );
		
	}
	public JSONArray getHeader() throws JSONException{
		JSONArray header = new JSONArray();
		header.put( COLUMN("시도",10,"string") );
		header.put( COLUMN("시군구",10,"string") );
		header.put( COLUMN("재비산먼지",10,"number") );
		header.put( COLUMN("배경먼지",10,"number") );
		header.put( COLUMN("측정거리",10,"number") );
		header.put( COLUMN("측정도로수",10,"number") );
		return header;
	}
	public JSONArray getRows() throws JSONException{
		JSONArray rows = new JSONArray();
		JSONArray row = new JSONArray();
		row.put("SIDO");
		row.put("SGG");
		row.put("DST");
		row.put("DSB");
		row.put("KM");
		row.put("ROAD");
		rows.put( row );
		for( int i =0 ; i < list.size() ; i++){
			AreaStatItem item = list.get(i);
			row = new JSONArray();
			row.put(item.sido);
			row.put(item.sgg);
			row.put(item.dst);
			row.put(item.dsb);
			row.put(item.km);
			row.put(item.road);
			rows.put( row );
		}
		return rows;
	}
	
	public String toString(){
		for( int i =0 ; i < list.size() ; i++){
			AreaStatItem item = list.get(i);
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

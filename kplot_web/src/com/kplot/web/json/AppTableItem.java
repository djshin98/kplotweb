package com.kplot.web.json;

import java.util.ArrayList;

import org.apache.commons.codec.binary.Base64;
import java.sql.Timestamp;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import com.itf.framework.util.DATE;
import com.itf.framework.db.JSONWrapper;

public class AppTableItem extends JSONWrapper{
	public static final int ID = 7;
	public static final String NAME = "AppTableItem";
	public String		tableName;	//테이블 명 or 쿼리 명
	public String		tableSource;	//data source
	public String		tableDesc;	//쿼리 설명
	public String		query;	//쿼리
	public String		queryType;	//
	public String		style;	//
	public String		language;	//모바일 사용자가 선택한 언어(한국어="ko",영어="en")

	public void copy( AppTableItem d ){
		this.tableName = d.tableName;
		this.tableSource = d.tableSource;
		this.tableDesc = d.tableDesc;
		this.query = d.query;
		this.queryType = d.queryType;
		this.style = d.style;
		this.language = d.language;

	}
	public JSONObject encoding(){
		
		JSONObject obj = new JSONObject();
		try {
			if( tableName != null ){ obj.put("tableName",tableName); }
			else{ obj.put("tableName",""); }
			if( tableSource != null ){ obj.put("tableSource",tableSource); }
			else{ obj.put("tableSource",""); }
			if( tableDesc != null ){ obj.put("tableDesc",tableDesc); }
			else{ obj.put("tableDesc",""); }
			if( query != null ){ obj.put("query",query); }
			else{ obj.put("query",""); }
			if( queryType != null ){ obj.put("queryType",queryType); }
			else{ obj.put("queryType",""); }
			if( style != null ){ obj.put("style",style); }
			else{ obj.put("style",""); }
			if( language != null ){ obj.put("language",language); }
			else{ obj.put("language",""); }

		} catch (JSONException e) {
			e.printStackTrace();
		}
		return obj;
	}

	@SuppressWarnings("unchecked")
	public static AppTableItem decoding(JSONObject obj) {
		AppTableItem wrapper = new AppTableItem();
		try {
			if( obj.has("tableName") ){ wrapper.tableName = obj.getString("tableName"); }
			if( obj.has("tableSource") ){ wrapper.tableSource = obj.getString("tableSource"); }
			if( obj.has("tableDesc") ){ wrapper.tableDesc = obj.getString("tableDesc"); }
			if( obj.has("query") ){ wrapper.query = obj.getString("query"); }
			if( obj.has("queryType") ){ wrapper.queryType = obj.getString("queryType"); }
			if( obj.has("style") ){ wrapper.style = obj.getString("style"); }
			if( obj.has("language") ){ wrapper.language = obj.getString("language"); }

		} catch (JSONException e) {
			e.printStackTrace();
		}
		return wrapper;
	}
	public void print(String prefix){
		System.out.println(prefix+NAME+"{");
		if( tableName != null ){
			System.out.println(prefix+"tableName : " + tableName);
		}else{
			System.out.println(prefix+"tableName : null" );
		}
		if( tableSource != null ){
			System.out.println(prefix+"tableSource : " + tableSource);
		}else{
			System.out.println(prefix+"tableSource : null" );
		}
		if( tableDesc != null ){
			System.out.println(prefix+"tableDesc : " + tableDesc);
		}else{
			System.out.println(prefix+"tableDesc : null" );
		}
		if( query != null ){
			System.out.println(prefix+"query : " + query);
		}else{
			System.out.println(prefix+"query : null" );
		}
		if( queryType != null ){
			System.out.println(prefix+"queryType : " + queryType);
		}else{
			System.out.println(prefix+"queryType : null" );
		}
		if( style != null ){
			System.out.println(prefix+"style : " + style);
		}else{
			System.out.println(prefix+"style : null" );
		}
		if( language != null ){
			System.out.println(prefix+"language : " + language);
		}else{
			System.out.println(prefix+"language : null" );
		}

		System.out.println(prefix+"}");
	}
	public JSONObject toMessage(){
		JSONObject obj = new JSONObject();
		try {
			obj.put("requestObjectName", AppTableItem.NAME);
			obj.put("requestObject", encoding() );
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return obj;
	}
}

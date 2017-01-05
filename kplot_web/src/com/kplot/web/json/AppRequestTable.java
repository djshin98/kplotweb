package com.kplot.web.json;

import java.util.ArrayList;

import org.apache.commons.codec.binary.Base64;
import java.sql.Timestamp;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import com.itf.framework.util.DATE;
import com.itf.framework.db.JSONWrapper;

public class AppRequestTable extends JSONWrapper{
	public static final int ID = 12;
	public static final String NAME = "AppRequestTable";
	public String		requestKey;	//요청 키
	public String		tableName;	//테이블 명 or Query 명
	public String		queryType;	//table or query or view
	public String		tableQuery;	//Query
	public String		dataSource;	//데이터 소스
	public String		language;	//모바일 사용자가 선택한 언어(한국어="ko",영어="en")

	public void copy( AppRequestTable d ){
		this.requestKey = d.requestKey;
		this.tableName = d.tableName;
		this.queryType = d.queryType;
		this.tableQuery = d.tableQuery;
		this.dataSource = d.dataSource;
		this.language = d.language;

	}
	public JSONObject encoding(){
		
		JSONObject obj = new JSONObject();
		try {
			if( requestKey != null ){ obj.put("requestKey",requestKey); }
			else{ obj.put("requestKey",""); }
			if( tableName != null ){ obj.put("tableName",tableName); }
			else{ obj.put("tableName",""); }
			if( queryType != null ){ obj.put("queryType",queryType); }
			else{ obj.put("queryType",""); }
			if( tableQuery != null ){ obj.put("tableQuery",tableQuery); }
			else{ obj.put("tableQuery",""); }
			if( dataSource != null ){ obj.put("dataSource",dataSource); }
			else{ obj.put("dataSource",""); }
			if( language != null ){ obj.put("language",language); }
			else{ obj.put("language",""); }

		} catch (JSONException e) {
			e.printStackTrace();
		}
		return obj;
	}

	@SuppressWarnings("unchecked")
	public static AppRequestTable decoding(JSONObject obj) {
		AppRequestTable wrapper = new AppRequestTable();
		try {
			if( obj.has("requestKey") ){ wrapper.requestKey = obj.getString("requestKey"); }
			if( obj.has("tableName") ){ wrapper.tableName = obj.getString("tableName"); }
			if( obj.has("queryType") ){ wrapper.queryType = obj.getString("queryType"); }
			if( obj.has("tableQuery") ){ wrapper.tableQuery = obj.getString("tableQuery"); }
			if( obj.has("dataSource") ){ wrapper.dataSource = obj.getString("dataSource"); }
			if( obj.has("language") ){ wrapper.language = obj.getString("language"); }

		} catch (JSONException e) {
			e.printStackTrace();
		}
		return wrapper;
	}
	public void print(String prefix){
		System.out.println(prefix+NAME+"{");
		if( requestKey != null ){
			System.out.println(prefix+"requestKey : " + requestKey);
		}else{
			System.out.println(prefix+"requestKey : null" );
		}
		if( tableName != null ){
			System.out.println(prefix+"tableName : " + tableName);
		}else{
			System.out.println(prefix+"tableName : null" );
		}
		if( queryType != null ){
			System.out.println(prefix+"queryType : " + queryType);
		}else{
			System.out.println(prefix+"queryType : null" );
		}
		if( tableQuery != null ){
			System.out.println(prefix+"tableQuery : " + tableQuery);
		}else{
			System.out.println(prefix+"tableQuery : null" );
		}
		if( dataSource != null ){
			System.out.println(prefix+"dataSource : " + dataSource);
		}else{
			System.out.println(prefix+"dataSource : null" );
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
			obj.put("requestObjectName", AppRequestTable.NAME);
			obj.put("requestObject", encoding() );
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return obj;
	}
}

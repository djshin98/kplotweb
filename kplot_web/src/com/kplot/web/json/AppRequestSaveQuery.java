package com.kplot.web.json;

import java.util.ArrayList;

import org.apache.commons.codec.binary.Base64;
import java.sql.Timestamp;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import com.itf.framework.util.DATE;
import com.itf.framework.db.JSONWrapper;

public class AppRequestSaveQuery extends JSONWrapper{
	public static final int ID = 18;
	public static final String NAME = "AppRequestSaveQuery";
	public String		requestKey;	//요청 키
	public String		name;	//저장명
	public String		dataSourceName;	//데이터 소스 명
	public String		query;	//쿼리
	public String		language;	//모바일 사용자가 선택한 언어(한국어="ko",영어="en")

	public void copy( AppRequestSaveQuery d ){
		this.requestKey = d.requestKey;
		this.name = d.name;
		this.dataSourceName = d.dataSourceName;
		this.query = d.query;
		this.language = d.language;

	}
	public JSONObject encoding(){
		
		JSONObject obj = new JSONObject();
		try {
			if( requestKey != null ){ obj.put("requestKey",requestKey); }
			else{ obj.put("requestKey",""); }
			if( name != null ){ obj.put("name",name); }
			else{ obj.put("name",""); }
			if( dataSourceName != null ){ obj.put("dataSourceName",dataSourceName); }
			else{ obj.put("dataSourceName",""); }
			if( query != null ){ obj.put("query",query); }
			else{ obj.put("query",""); }
			if( language != null ){ obj.put("language",language); }
			else{ obj.put("language",""); }

		} catch (JSONException e) {
			e.printStackTrace();
		}
		return obj;
	}

	@SuppressWarnings("unchecked")
	public static AppRequestSaveQuery decoding(JSONObject obj) {
		AppRequestSaveQuery wrapper = new AppRequestSaveQuery();
		try {
			if( obj.has("requestKey") ){ wrapper.requestKey = obj.getString("requestKey"); }
			if( obj.has("name") ){ wrapper.name = obj.getString("name"); }
			if( obj.has("dataSourceName") ){ wrapper.dataSourceName = obj.getString("dataSourceName"); }
			if( obj.has("query") ){ wrapper.query = obj.getString("query"); }
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
		if( name != null ){
			System.out.println(prefix+"name : " + name);
		}else{
			System.out.println(prefix+"name : null" );
		}
		if( dataSourceName != null ){
			System.out.println(prefix+"dataSourceName : " + dataSourceName);
		}else{
			System.out.println(prefix+"dataSourceName : null" );
		}
		if( query != null ){
			System.out.println(prefix+"query : " + query);
		}else{
			System.out.println(prefix+"query : null" );
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
			obj.put("requestObjectName", AppRequestSaveQuery.NAME);
			obj.put("requestObject", encoding() );
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return obj;
	}
}

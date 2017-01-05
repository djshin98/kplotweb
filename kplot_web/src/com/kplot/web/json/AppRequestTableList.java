package com.kplot.web.json;

import java.util.ArrayList;

import org.apache.commons.codec.binary.Base64;
import java.sql.Timestamp;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import com.itf.framework.util.DATE;
import com.itf.framework.db.JSONWrapper;

public class AppRequestTableList extends JSONWrapper{
	public static final int ID = 8;
	public static final String NAME = "AppRequestTableList";
	public String		requestKey;	//요청 키
	public String		userId;	//아이디
	public String		searchText;	//검색어
	public String		searchTarget;	//table/view (테이블 or 뷰)
	public String		language;	//모바일 사용자가 선택한 언어(한국어="ko",영어="en")

	public void copy( AppRequestTableList d ){
		this.requestKey = d.requestKey;
		this.userId = d.userId;
		this.searchText = d.searchText;
		this.searchTarget = d.searchTarget;
		this.language = d.language;

	}
	public JSONObject encoding(){
		
		JSONObject obj = new JSONObject();
		try {
			if( requestKey != null ){ obj.put("requestKey",requestKey); }
			else{ obj.put("requestKey",""); }
			if( userId != null ){ obj.put("userId",userId); }
			else{ obj.put("userId",""); }
			if( searchText != null ){ obj.put("searchText",searchText); }
			else{ obj.put("searchText",""); }
			if( searchTarget != null ){ obj.put("searchTarget",searchTarget); }
			else{ obj.put("searchTarget",""); }
			if( language != null ){ obj.put("language",language); }
			else{ obj.put("language",""); }

		} catch (JSONException e) {
			e.printStackTrace();
		}
		return obj;
	}

	@SuppressWarnings("unchecked")
	public static AppRequestTableList decoding(JSONObject obj) {
		AppRequestTableList wrapper = new AppRequestTableList();
		try {
			if( obj.has("requestKey") ){ wrapper.requestKey = obj.getString("requestKey"); }
			if( obj.has("userId") ){ wrapper.userId = obj.getString("userId"); }
			if( obj.has("searchText") ){ wrapper.searchText = obj.getString("searchText"); }
			if( obj.has("searchTarget") ){ wrapper.searchTarget = obj.getString("searchTarget"); }
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
		if( userId != null ){
			System.out.println(prefix+"userId : " + userId);
		}else{
			System.out.println(prefix+"userId : null" );
		}
		if( searchText != null ){
			System.out.println(prefix+"searchText : " + searchText);
		}else{
			System.out.println(prefix+"searchText : null" );
		}
		if( searchTarget != null ){
			System.out.println(prefix+"searchTarget : " + searchTarget);
		}else{
			System.out.println(prefix+"searchTarget : null" );
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
			obj.put("requestObjectName", AppRequestTableList.NAME);
			obj.put("requestObject", encoding() );
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return obj;
	}
}

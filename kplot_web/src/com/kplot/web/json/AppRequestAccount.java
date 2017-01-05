package com.kplot.web.json;

import java.util.ArrayList;

import org.apache.commons.codec.binary.Base64;
import java.sql.Timestamp;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import com.itf.framework.util.DATE;
import com.itf.framework.db.JSONWrapper;

public class AppRequestAccount extends JSONWrapper{
	public static final int ID = 3;
	public static final String NAME = "AppRequestAccount";
	public String		requestKey;	//요청 키
	public String		userId;	//아이디
	public String		userName;	//성명
	public String		userEmail;	//이메일
	public String		userPassword;	//PP
	public String		language;	//모바일 사용자가 선택한 언어(한국어="ko",영어="en")

	public void copy( AppRequestAccount d ){
		this.requestKey = d.requestKey;
		this.userId = d.userId;
		this.userName = d.userName;
		this.userEmail = d.userEmail;
		this.userPassword = d.userPassword;
		this.language = d.language;

	}
	public JSONObject encoding(){
		
		JSONObject obj = new JSONObject();
		try {
			if( requestKey != null ){ obj.put("requestKey",requestKey); }
			else{ obj.put("requestKey",""); }
			if( userId != null ){ obj.put("userId",userId); }
			else{ obj.put("userId",""); }
			if( userName != null ){ obj.put("userName",userName); }
			else{ obj.put("userName",""); }
			if( userEmail != null ){ obj.put("userEmail",userEmail); }
			else{ obj.put("userEmail",""); }
			if( userPassword != null ){ obj.put("userPassword",userPassword); }
			else{ obj.put("userPassword",""); }
			if( language != null ){ obj.put("language",language); }
			else{ obj.put("language",""); }

		} catch (JSONException e) {
			e.printStackTrace();
		}
		return obj;
	}

	@SuppressWarnings("unchecked")
	public static AppRequestAccount decoding(JSONObject obj) {
		AppRequestAccount wrapper = new AppRequestAccount();
		try {
			if( obj.has("requestKey") ){ wrapper.requestKey = obj.getString("requestKey"); }
			if( obj.has("userId") ){ wrapper.userId = obj.getString("userId"); }
			if( obj.has("userName") ){ wrapper.userName = obj.getString("userName"); }
			if( obj.has("userEmail") ){ wrapper.userEmail = obj.getString("userEmail"); }
			if( obj.has("userPassword") ){ wrapper.userPassword = obj.getString("userPassword"); }
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
		if( userName != null ){
			System.out.println(prefix+"userName : " + userName);
		}else{
			System.out.println(prefix+"userName : null" );
		}
		if( userEmail != null ){
			System.out.println(prefix+"userEmail : " + userEmail);
		}else{
			System.out.println(prefix+"userEmail : null" );
		}
		if( userPassword != null ){
			System.out.println(prefix+"userPassword : " + userPassword);
		}else{
			System.out.println(prefix+"userPassword : null" );
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
			obj.put("requestObjectName", AppRequestAccount.NAME);
			obj.put("requestObject", encoding() );
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return obj;
	}
}

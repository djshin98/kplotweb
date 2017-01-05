package com.kplot.web.json;

import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//import com.itf.framework.util.AES256Cipher;

import com.itf.framework.servlet.Widget;
import com.kplot.web.json.handler.LoginHandler;
import com.kplot.web.json.handler.TableHandler;
;

public class JSONGateway {
	private HashMap<String, Integer> jsonMapper = new HashMap<String, Integer>();
	private ArrayList<JSONAgent> jsonAgents = new ArrayList<JSONAgent>();

	public void appendAgent(JSONAgent agent) {
		jsonAgents.add(agent);
	}

	public void init() {
		jsonMapper.put(AppRequestLogin.NAME, AppRequestLogin.ID );
		jsonMapper.put(AppResponseLogin.NAME, AppResponseLogin.ID );
		jsonMapper.put(AppRequestAccount.NAME, AppRequestAccount.ID );
		jsonMapper.put(AppResponseAccount.NAME, AppResponseAccount.ID );
		jsonMapper.put(AppRequestLogout.NAME, AppRequestLogout.ID );
		jsonMapper.put(AppResponseLogout.NAME, AppResponseLogout.ID );
		jsonMapper.put(AppTableItem.NAME, AppTableItem.ID );
		jsonMapper.put(AppRequestTableList.NAME, AppRequestTableList.ID );
		jsonMapper.put(AppResponseTableList.NAME, AppResponseTableList.ID );
		jsonMapper.put(AppRequestUploadTables.NAME, AppRequestUploadTables.ID );
		jsonMapper.put(AppResponseUploadTables.NAME, AppResponseUploadTables.ID );
		jsonMapper.put(AppRequestTable.NAME, AppRequestTable.ID );
		jsonMapper.put(AppResponseTable.NAME, AppResponseTable.ID );
		jsonMapper.put(AppRequestDataSource.NAME, AppRequestDataSource.ID );
		jsonMapper.put(AppResponseDataSource.NAME, AppResponseDataSource.ID );
		jsonMapper.put(AppRequestQuery.NAME, AppRequestQuery.ID );
		jsonMapper.put(AppResponseQuery.NAME, AppResponseQuery.ID );
		jsonMapper.put(AppRequestSaveQuery.NAME, AppRequestSaveQuery.ID );
		jsonMapper.put(AppResponseSaveQuery.NAME, AppResponseSaveQuery.ID );

	}

	public String proc(Widget widget, String decodeData, HttpServletRequest request, HttpServletResponse response) {
		
		//String decodeData = decode( jsonEncodeData );
		
		if( decodeData == null ){
			return null;
		}
		JSONObject jsonObject = null;
		String messageName;
		try {
			jsonObject = new JSONObject(decodeData);
			messageName = jsonObject.getString("requestObjectName");
		} catch (JSONException e) {
			e.printStackTrace();
			return null;
		}

		Integer messageId = jsonMapper.get(messageName);
		if( messageId == null ){
			for( JSONAgent agent : jsonAgents ){
				if( agent.hasMessage( messageName ) ){
					return agent.proc( jsonObject );
				}
			}
		}else{
			JSONObject messageBody;
			try {
				messageBody = jsonObject.getJSONObject("requestObject");
			} catch (JSONException e) {
				e.printStackTrace();
				return null;
			}
			switch (messageId) {
				case AppRequestLogin.ID: {//로그인
					AppRequestLogin req = AppRequestLogin.decoding(messageBody);
					AppResponseLogin res = new AppResponseLogin();
					req.setHttpRequest(request);
					res.setHttpResponse(response);
					LoginHandler.getInstance().handle( widget, req , res );
					return encode( res.encoding() );
				}
				case AppRequestAccount.ID: {//등록
					AppRequestAccount req = AppRequestAccount.decoding(messageBody);
					AppResponseAccount res = new AppResponseAccount();
					req.setHttpRequest(request);
					res.setHttpResponse(response);
					LoginHandler.getInstance().handle( widget, req , res );
					return encode( res.encoding() );
				}
				case AppRequestLogout.ID: {//로그아웃
					AppRequestLogout req = AppRequestLogout.decoding(messageBody);
					AppResponseLogout res = new AppResponseLogout();
					req.setHttpRequest(request);
					res.setHttpResponse(response);
					LoginHandler.getInstance().handle( widget, req , res );
					return encode( res.encoding() );
				}
				case AppRequestTableList.ID: {//테이블 목록 가져오기
					AppRequestTableList req = AppRequestTableList.decoding(messageBody);
					AppResponseTableList res = new AppResponseTableList();
					req.setHttpRequest(request);
					res.setHttpResponse(response);
					TableHandler.getInstance().handle( widget, req , res );
					return encode( res.encoding() );
				}
				case AppRequestUploadTables.ID: {//테이블 업로드 가져오기
					AppRequestUploadTables req = AppRequestUploadTables.decoding(messageBody);
					AppResponseUploadTables res = new AppResponseUploadTables();
					req.setHttpRequest(request);
					res.setHttpResponse(response);
					TableHandler.getInstance().handle( widget, req , res );
					return encode( res.encoding() );
				}
				case AppRequestTable.ID: {//테이블을 JSON으로 가져오기
					AppRequestTable req = AppRequestTable.decoding(messageBody);
					AppResponseTable res = new AppResponseTable();
					req.setHttpRequest(request);
					res.setHttpResponse(response);
					TableHandler.getInstance().handle( widget, req , res );
					return encode( res.encoding() );
				}
				case AppRequestDataSource.ID: {//데이터 소스 JSON으로 가져오기
					AppRequestDataSource req = AppRequestDataSource.decoding(messageBody);
					AppResponseDataSource res = new AppResponseDataSource();
					req.setHttpRequest(request);
					res.setHttpResponse(response);
					TableHandler.getInstance().handle( widget, req , res );
					return encode( res.encoding() );
				}
				case AppRequestQuery.ID: {//쿼리 결과를 JSON으로 가져오기
					AppRequestQuery req = AppRequestQuery.decoding(messageBody);
					AppResponseQuery res = new AppResponseQuery();
					req.setHttpRequest(request);
					res.setHttpResponse(response);
					TableHandler.getInstance().handle( widget, req , res );
					return encode( res.encoding() );
				}
				case AppRequestSaveQuery.ID: {//쿼리 저장하기
					AppRequestSaveQuery req = AppRequestSaveQuery.decoding(messageBody);
					AppResponseSaveQuery res = new AppResponseSaveQuery();
					req.setHttpRequest(request);
					res.setHttpResponse(response);
					TableHandler.getInstance().handle( widget, req , res );
					return encode( res.encoding() );
				}

			}
		}
		return null;
	}

	public String encode( JSONObject obj ) {
		return obj.toString();
	}
	/*
	public String decode(String jsonEncodeData) {
		AES256Cipher a256 = AES256Cipher.getInstance();
		String decodeData = null;
		try {
			decodeData = a256.AES_Decode(jsonEncodeData);
		} catch (InvalidKeyException e) {
			e.printStackTrace();
			return null;
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			return null;
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return null;
		} catch (NoSuchPaddingException e) {
			e.printStackTrace();
			return null;
		} catch (InvalidAlgorithmParameterException e) {
			e.printStackTrace();
			return null;
		} catch (IllegalBlockSizeException e) {
			e.printStackTrace();
			return null;
		} catch (BadPaddingException e) {
			e.printStackTrace();
			return null;
		}
		return decodeData;
	}
	
	public String encode( JSONObject obj ) {
		String jsonEncodeData = obj.toString();
		AES256Cipher a256 = AES256Cipher.getInstance();
		String encodeData = null;
		try {
			encodeData = a256.AES_Encode(jsonEncodeData);
		} catch (InvalidKeyException e) {
			e.printStackTrace();
			return null;
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			return null;
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return null;
		} catch (NoSuchPaddingException e) {
			e.printStackTrace();
			return null;
		} catch (InvalidAlgorithmParameterException e) {
			e.printStackTrace();
			return null;
		} catch (IllegalBlockSizeException e) {
			e.printStackTrace();
			return null;
		} catch (BadPaddingException e) {
			e.printStackTrace();
			return null;
		}
		return encodeData;
	}*/
}

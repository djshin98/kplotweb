package com.kplot.web.json.handler;

import java.util.ArrayList;

import com.itf.framework.util.DATE;
import com.itf.framework.db.record.DataTable;
import com.itf.framework.servlet.Widget;

import com.kplot.web.json.AppRequestLogin;
import com.kplot.web.json.AppResponseLogin;
import com.kplot.web.json.AppRequestAccount;
import com.kplot.web.json.AppResponseAccount;
import com.kplot.web.json.AppRequestLogout;
import com.kplot.web.json.AppResponseLogout;


public class LoginHandler implements com.kplot.web.json.intf.ILoginHandler{
	private static LoginHandler singletonLoginHandler;
	public static LoginHandler getInstance(){
		if( singletonLoginHandler == null ){
			singletonLoginHandler = new LoginHandler();
		}
		return singletonLoginHandler;
	}
	
	//로그인
	public void handle(Widget widget, AppRequestLogin req, AppResponseLogin res) {
		res.requestKey = req.requestKey;
		res.language = req.language;
		res.result = "OK";
	}
	//등록
	public void handle(Widget widget, AppRequestAccount req, AppResponseAccount res) {
		res.requestKey = req.requestKey;
		res.language = req.language;
		res.result = "OK";
	}
	//로그아웃
	public void handle(Widget widget, AppRequestLogout req, AppResponseLogout res) {
		res.requestKey = req.requestKey;
		res.language = req.language;
		res.result = "OK";
	}

	
}

package com.kplot.web.json.intf;

import java.util.ArrayList;
import com.itf.framework.servlet.Widget;

import com.kplot.web.json.AppRequestLogin;
import com.kplot.web.json.AppResponseLogin;
import com.kplot.web.json.AppRequestAccount;
import com.kplot.web.json.AppResponseAccount;
import com.kplot.web.json.AppRequestLogout;
import com.kplot.web.json.AppResponseLogout;


public interface ILoginHandler{

	//로그인
	public void handle( Widget widget, AppRequestLogin req, AppResponseLogin res);
	//등록
	public void handle( Widget widget, AppRequestAccount req, AppResponseAccount res);
	//로그아웃
	public void handle( Widget widget, AppRequestLogout req, AppResponseLogout res);

	
}

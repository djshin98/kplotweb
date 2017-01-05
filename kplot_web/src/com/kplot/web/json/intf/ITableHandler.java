package com.kplot.web.json.intf;

import java.util.ArrayList;
import com.itf.framework.servlet.Widget;

import com.kplot.web.json.AppRequestTableList;
import com.kplot.web.json.AppResponseTableList;
import com.kplot.web.json.AppRequestUploadTables;
import com.kplot.web.json.AppResponseUploadTables;
import com.kplot.web.json.AppRequestTable;
import com.kplot.web.json.AppResponseTable;
import com.kplot.web.json.AppRequestDataSource;
import com.kplot.web.json.AppResponseDataSource;
import com.kplot.web.json.AppRequestQuery;
import com.kplot.web.json.AppResponseQuery;
import com.kplot.web.json.AppRequestSaveQuery;
import com.kplot.web.json.AppResponseSaveQuery;


public interface ITableHandler{

	//테이블 목록 가져오기
	public void handle( Widget widget, AppRequestTableList req, AppResponseTableList res);
	//테이블 업로드 가져오기
	public void handle( Widget widget, AppRequestUploadTables req, AppResponseUploadTables res);
	//테이블을 JSON으로 가져오기
	public void handle( Widget widget, AppRequestTable req, AppResponseTable res);
	//데이터 소스 JSON으로 가져오기
	public void handle( Widget widget, AppRequestDataSource req, AppResponseDataSource res);
	//쿼리 결과를 JSON으로 가져오기
	public void handle( Widget widget, AppRequestQuery req, AppResponseQuery res);
	//쿼리 저장하기
	public void handle( Widget widget, AppRequestSaveQuery req, AppResponseSaveQuery res);

	
}

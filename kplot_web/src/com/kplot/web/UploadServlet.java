package com.kplot.web;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.file.Paths;
import java.util.Collection;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.json.JSONObject;

import com.itf.framework.util.FileBuffer;
import com.itf.framework.util.PathUtil;
import com.kplot.web.data.DataParser;
import com.kplot.web.json.AppResponseUploadTables;

//@WebServlet("upload")	
@MultipartConfig
public class UploadServlet extends HttpServlet {
	
	private final static String insertSync = "insertSync";
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		request.setCharacterEncoding("utf-8");
		response.setCharacterEncoding("utf-8");
		String path = request.getRealPath("");
		
		System.out.println("upload...");
		Collection<Part> ps;
		try {
			ps = request.getParts();
			
			Part[] p = new Part[ps.size()];
			p = ps.toArray(p);
		    Part filePart = p[0];
		    
		    String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString(); // MSIE fix.
		    InputStream fileContent = filePart.getInputStream();
		    path = path + fileName;
			FileBuffer.copyInputStreamToFile( fileContent , new File(path) );
			
			String onlyName = PathUtil.onlyName(fileName);
			String ext = PathUtil.onlyExtention(fileName);
			DataParser dp = new DataParser();
			if( dp.parse(path) ){
				
			}else{
				
			}
			AppResponseUploadTables rep = new AppResponseUploadTables();
			rep.requestKey = "";	//요청 키
			rep.result = "OK";	//요청 처리 결과값
			rep.resultMessage = "";	//처리 오류 상세 메시지
			rep.fileName = fileName;	//모바일 사용자가 선택한 언어(한국어="ko",영어="en")
			rep.extra = request.getParameter("extra");	//모바일 사용자가 선택한 언어(한국어="ko",영어="en")
			rep.language = "";	//모바일 사용자가 선택한 언어(한국어="ko",영어="en")
			JSONObject jobj = rep.encoding();
			
			response.setContentType("text/json");
			PrintWriter pw = response.getWriter();
			pw.write(jobj.toString());
			
		} catch (IOException | ServletException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("end...");
	}
	
}

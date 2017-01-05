package com.kplot.web;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.kplot.web.json.JSONGateway;


public class AjaxServlet extends HttpServlet {
	private static JSONGateway gateway = null;
	
	@Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		
		req.setCharacterEncoding( "UTF-8" );
		res.setCharacterEncoding( "UTF-8" );
		if( gateway == null ){
			gateway = new JSONGateway();
			gateway.init();
		}
		BufferedReader br = new BufferedReader(new InputStreamReader(
				req.getInputStream() , "utf-8"));
		StringBuffer buffer = new StringBuffer();
		String json = "";
		if (br != null) {
			if ((json = br.readLine()) != null) {
				buffer.append(json);
			}
		}
		
		boolean bencoding= false;
		JSONObject jsonObject;
		try {
			jsonObject = new JSONObject( buffer.toString() );
			String jsonEncodeData = bencoding ? gateway.encode( jsonObject ) : jsonObject.toString();
			System.out.println( jsonEncodeData );
			String jsonEncodeResponse = gateway.proc(StartupServlet.getWidget(), jsonEncodeData , req , res );
			if( jsonEncodeResponse != null ){
				//jsonObject = new JSONObject( bencoding ? gateway.decode(jsonEncodeResponse) : jsonEncodeResponse.toString() );
				
				res.setContentType("text/json");
				PrintWriter pw = res.getWriter();
				pw.write(jsonEncodeResponse);
			}else{
				System.err.println("invalid message : " + buffer.toString());
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
    }
	
	public void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		req.setCharacterEncoding( "UTF-8" );
		res.setCharacterEncoding( "UTF-8" );
		
	}
}

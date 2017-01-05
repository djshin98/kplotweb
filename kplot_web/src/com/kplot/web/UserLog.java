package com.kplot.web;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import com.kplot.web.table.XTable_access_log;


public class UserLog {
	public static void writeLog( String host , String user_id , String request , String param ){
		DataSource dataSource;
		Connection conn = null;
		Context context;
		PreparedStatement preparedStatement = null;
		try {
			context = new InitialContext();
			dataSource = (DataSource) context.lookup(StartupServlet.DataSourceName);
			conn = dataSource.getConnection();
			
			if( param.length() >= 256 ){
				param = param.substring(0,254);
			}
			XTable_access_log log = new XTable_access_log();
			
			log.logtime = new Timestamp( Calendar.getInstance().getTimeInMillis() );
			log.host = host;		
			log.content = request + " " + param;
			if( log.content.length() > 255 ){
				log.content = log.content.substring(0, 255);
			}
			ArrayList<String> list = new ArrayList<String>();
			list.add("logtime");
			list.add("host");
			list.add("content");
			log.insert(conn,list);			
		}catch (NamingException | SQLException e) {
			e.printStackTrace();
				
		} catch (Exception e) {
			e.printStackTrace();
		} finally{
				
			if (preparedStatement != null) {
				try {
					preparedStatement.close();
				} catch (SQLException e) {
					//out.append("\nerror:"+e.getMessage()+"\n");
					e.printStackTrace();
				}
			}
			if( conn != null ){
				try {
					conn.close();
				} catch (SQLException e) {
					//out.append("\nerror:"+e.getMessage()+"\n");
					e.printStackTrace();
				}
			}
			
		}
	}
}

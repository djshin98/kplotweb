package com.kplot.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import com.itf.framework.servlet.Site;
import com.itf.framework.servlet.Widget;

public class StartupServlet extends HttpServlet {
	public static String DataSourceName = "java:comp/env/jdbc/mysql-kplot";
	public static String DataSourceName_CR = "java:comp/env/jdbc/oracle-cr";
	public static String DataSourceName_TIBERO = "java:comp/env/jdbc/tibero-cr";
	
	private static Widget widget;
	private int count;
	public static Widget getWidget(){
		return widget;
	}
	public static ArrayList<String> getDataSourceNames(){
		ArrayList<String> names = new ArrayList<String>();
		names.add( DataSourceName );
		names.add( DataSourceName_CR );
		names.add( DataSourceName_TIBERO );
		return names;
	}
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		String initial = config.getInitParameter("debug");
		try {
			count = Integer.parseInt(initial);
			System.out.println(count);
		} catch (NumberFormatException e) {
			e.printStackTrace();
			count = 0;
		}
		
		Widget widget = new Widget(new Site(""), "kplot", "", 20223);
	}

	public void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		
		req.getRequestDispatcher("test_list.jsp").forward(req, res);
		Context context;
		DataSource dataSource;
		Connection conn = null;
		try {
			context = new InitialContext();
			dataSource = (DataSource) context.lookup(StartupServlet.DataSourceName);
			conn = dataSource.getConnection();
			
			
			
		} catch (NamingException | SQLException e) {
			e.printStackTrace();
		} finally{
			if( conn != null ){
				try {
					conn.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}

		res.setContentType("text/plain");
		PrintWriter out = res.getWriter();
		count++;
		out.println("Since loading (and with a possible initialization");
		out.println("parameter figured in), this servlet has been accessed");
		out.println(count + " times.");
	}
}

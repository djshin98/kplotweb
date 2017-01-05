package com.kplot.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;

public class LoginServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		String path = req.getPathInfo();
		String cpath = req.getContextPath();
		String uri = req.getRequestURI();
		System.out.println(uri);
		req.getRequestDispatcher("page_login.html").forward(req, res);
	}

	public void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {

		String host = req.getServerName();
		int port = req.getServerPort();
		String uri = req.getRequestURI();
		System.out.println(uri);
		String request = req.getParameter("request");
		String id = req.getParameter("username");
		String password = req.getParameter("password");
		String clientHost = req.getRemoteAddr();
		if (request != null) {
			if (request.compareToIgnoreCase("LOGIN") == 0) {
				try {
					if (login(clientHost, host, port, id, password)) {
						req.setAttribute("username", id);
						req.setAttribute("password", password);
						req.getSession().setAttribute("username", id);
						req.getSession().setAttribute("password", password);
						String str = req.getContextPath();
						System.out.println(str);
						//req.getRequestDispatcher("start.html").forward(req, res);
						res.sendRedirect("start.html");
						return;
					}
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				req.getRequestDispatcher("page_login.html").forward(req, res);
			} else if (request.compareToIgnoreCase("GET") == 0) {
				UserLog.writeLog(clientHost, id, request, req.getRequestURI());

				res.setContentType("application/json");
				res.setCharacterEncoding("utf-8");
				PrintWriter out = res.getWriter();
				try {
					// create Json Object
					JSONObject json = new JSONObject();

					String user = (String) req.getSession().getAttribute("username");
					String pass = (String) req.getSession().getAttribute("password");
					if (user != null && user.length() > 0 && pass != null && pass.length() > 0) {
						// put some value pairs into the JSON object .

						json.put("value", "OK");

						json.put("user", user);
						json.put("password", pass);
					} else {
						json.put("value", "FAIL");
					}
					// finally output the json string
					out.print(json.toString());
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			} else if (request.compareToIgnoreCase("LOGOUT") == 0) {
				UserLog.writeLog(clientHost, id, request, req.getRequestURI());

				req.getSession().setAttribute("username", "");
				req.getSession().setAttribute("password", "");

				req.getRequestDispatcher("page_login.html").forward(req, res);
			} else {
				String param = req.getParameter("param");
				UserLog.writeLog(clientHost, id, request, param);
				return;
			}
		}
	}

	public boolean login(String clientHost, String host, int port, String userid, String password) throws Exception {

		// String url = "https://selfsolve.apple.com/wcResults.do";
		String url = "http://" + userid + ":" + password + "@" + host + ":" + port + "/mapxserver/wms";

		HttpClient client = new DefaultHttpClient();
		HttpPost post = new HttpPost(url);

		// add header
		post.setHeader("User-Agent", "Mozilla/5.0");

		List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
		urlParameters.add(new BasicNameValuePair("request", "GetCapabilities"));

		post.setEntity(new UrlEncodedFormEntity(urlParameters));

		HttpResponse response = client.execute(post);
		System.out.println("\nSending 'POST' request to URL : " + url);
		System.out.println("Post parameters : " + post.getEntity());
		System.out.println("Response Code : " + response.getStatusLine().getStatusCode());

		if (response.getStatusLine().getStatusCode() == 200) {
			UserLog.writeLog(clientHost, userid, "LOGIN", url);
			return true;
		} else {
			UserLog.writeLog(clientHost, userid, "LOGIN_ERROR", url);
		}

		return false;

		// System.out.println(result.toString());

	}
}
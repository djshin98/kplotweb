package com.kplot.web.json.handler;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;
import javax.sql.DataSource;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.itf.framework.db.DatabaseMultiPoolManager;
import com.itf.framework.db.record.DataRow;
import com.itf.framework.db.record.DataTable;
import com.itf.framework.servlet.Widget;
import com.itf.framework.util.FileBuffer;
import com.itf.framework.util.PathUtil;
import com.kplot.web.StartupServlet;
import com.kplot.web.data.DataParser;
import com.kplot.web.data.Field;
import com.kplot.web.data.FieldType;
import com.kplot.web.data.MySQLProvider;
import com.kplot.web.data.Provider;
import com.kplot.web.data.TableInfo;
import com.kplot.web.data.UnknownTableException;
import com.kplot.web.json.AppRequestDataSource;
import com.kplot.web.json.AppRequestQuery;
import com.kplot.web.json.AppRequestSaveQuery;
import com.kplot.web.json.AppRequestTable;
import com.kplot.web.json.AppRequestTableList;
import com.kplot.web.json.AppRequestUploadTables;
import com.kplot.web.json.AppResponseDataSource;
import com.kplot.web.json.AppResponseQuery;
import com.kplot.web.json.AppResponseSaveQuery;
import com.kplot.web.json.AppResponseTable;
import com.kplot.web.json.AppResponseTableList;
import com.kplot.web.json.AppResponseUploadTables;
import com.kplot.web.json.AppTableItem;

public class TableHandler implements com.kplot.web.json.intf.ITableHandler {
	private static TableHandler singletonTableHandler;

	public static TableHandler getInstance() {
		if (singletonTableHandler == null) {
			singletonTableHandler = new TableHandler();
		}
		return singletonTableHandler;
	}

	// 테이블 목록 가져오기
	public void handle(Widget widget, AppRequestTableList req, AppResponseTableList res) {
		res.requestKey = req.requestKey;
		res.language = req.language;
		res.result = "OK";

		Provider provider = new MySQLProvider("");
		ArrayList<TableInfo> list = provider.getTableList( req.searchText );
		res.tableList = new ArrayList<AppTableItem>();
		for (int i = 0; i < list.size(); i++) {
			AppTableItem t = new AppTableItem();
			t.tableName = list.get(i).tableName;
			t.tableDesc = list.get(i).name;
			t.queryType = "table";
			res.tableList.add(t);
		}
		
		list = provider.getQueryList( req.searchText );
		for (int i = 0; i < list.size(); i++) {
			AppTableItem t = new AppTableItem();
			t.tableName = list.get(i).name;
			t.tableSource = list.get(i).source;
			t.tableDesc = list.get(i).query;
			t.queryType = "query";
			res.tableList.add(t);
		}
	}

	// 테이블 업로드 가져오기
	public void handle(Widget widget, AppRequestUploadTables req, AppResponseUploadTables res) {
		res.requestKey = req.requestKey;
		res.language = req.language;
		res.result = "OK";

		HttpServletRequest request = req.getHttpRequest();

		// String description = req.request.getParameter("description"); //
		// Retrieves <input type="text" name="description">
		Collection<Part> ps;
		try {
			ps = request.getParts();

			Part[] p = new Part[ps.size()];
			p = ps.toArray(p);
			Part filePart = p[0]; // Retrieves <input type="file" name="file">

			String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString(); // MSIE
																									// fix.
			InputStream fileContent = filePart.getInputStream();
			String path = request.getContextPath() + "/" + fileName;
			FileBuffer.copyInputStreamToFile(fileContent, new File(path));

			String onlyName = PathUtil.onlyName(fileName);
			String ext = PathUtil.onlyExtention(fileName);
			DataParser dp = new DataParser();
			dp.parse(path);

		} catch (IOException | ServletException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	// 테이블가져오기
	public void handle(Widget widget, AppRequestTable req, AppResponseTable res) {
		res.requestKey = req.requestKey;
		res.language = req.language;
		res.result = "OK";

		Provider provider = new MySQLProvider(req.tableName , req.queryType , req.dataSource , req.tableQuery );
		
		JSONObject jobj = null;
		try {
			ArrayList<Field> columns = new ArrayList<Field>(); 
			if( req.queryType.compareTo("table") == 0 ){
				columns = provider.getColumns();
			}
			ArrayList<ArrayList<String>> data = provider.read(columns);
			
			jobj = new JSONObject();
			if( data != null ){
				JSONArray header = new JSONArray();
				for (int i = 0; i < columns.size(); i++) {
					JSONObject column = new JSONObject();
					column.put("name", columns.get(i).name);
					column.put("type", columns.get(i).type.javaType.compareToIgnoreCase("String") == 0 ? "string" : "number" );
					column.put("length", columns.get(i).length);
					header.put(column);
				}
				jobj.put("header", header);
				JSONArray jrows = new JSONArray();
				for (int r = 0; r < data.size(); r++) {
					ArrayList<String> row = data.get(r);
					JSONArray jrow = new JSONArray();
					for (int c = 0; c < columns.size(); c++) {
						String col = row.get(c);
						jrow.put( col );
					}
					jrows.put( jrow );
				}
				jobj.put("rows", jrows);
			}else{
				
			}
		} catch (JSONException e) {
			jobj = new JSONObject();
			e.printStackTrace();
			try {
				jobj.put("message", e.getMessage() );
			} catch (JSONException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		} catch (UnknownTableException e) {
			jobj = new JSONObject();
			try {
				jobj.put("message", e.getMessage() );
			} catch (JSONException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		} catch (Exception e) {
			jobj = new JSONObject();
			e.printStackTrace();
			try {
				jobj.put("message", e.getMessage() );
			} catch (JSONException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
		res.tableName = req.tableName;
		res.tableContent = jobj.toString();
	}

	
	@Override
	public void handle(Widget widget, AppRequestDataSource req, AppResponseDataSource res) {
		res.requestKey = req.requestKey;
		res.language = req.language;
		res.result = "OK";
		res.names = StartupServlet.getDataSourceNames();
	}

	@Override
	public void handle(Widget widget, AppRequestQuery req, AppResponseQuery res) {
		res.requestKey = req.requestKey;
		res.language = req.language;
		res.result = "OK";
		DataSource dataSource;
		Connection conn = null;
		Context context;
		PreparedStatement preparedStatement = null;
		try {
			context = new InitialContext();
			dataSource = (DataSource) context.lookup(req.dataSourceName);
			conn = dataSource.getConnection();
			if( req.query.compareTo("term") == 0 ){
				String sql = "select reg.REGION_NAME , m.MSRMT_DATE , m.DST_VALUE, m.DSB_VALUE, m.MSRMT_KM AS KM, m.ROAD_ID from CRMS_MSRMT_LIST m , CRMS_ROAD_INFO road , CRMS_REGION reg , T_EQPMNT q "
						+" where reg.PARENT_REGION_ID = 'rg_0001' and road.REGION_ID=reg.REGION_ID "
						+" and m.ROAD_ID = road.ROAD_ID and m.PURPS_SE='1' and (m.EQPMNT_ID IN ( SELECT EQPMNT_NAME FROM T_EQPMNT WHERE STAT_INCLD_YN = 'Y' )) and "
						+" (m.MSRMT_DATE BETWEEN TO_TIMESTAMP('2014-04-01 00:00:00.000') AND TO_TIMESTAMP('2016-07-01 00:00:00.000')) and (m.DST_VALUE is not null and m.DSB_VALUE is not null) "
						+" order by  reg.REGION_NAME";
				preparedStatement = conn.prepareStatement(sql);
				ResultSet set = preparedStatement.executeQuery();
				TermStat ts = new TermStat();
				while (set.next()) {
					Timestamp t = set.getTimestamp(2);
					Calendar c = Calendar.getInstance();
					c.setTimeInMillis(t.getTime());
					int year = c.get(Calendar.YEAR);
					int month = c.get(Calendar.MONTH)+1;
					double dst = set.getDouble(3);
					double dsb = set.getDouble(4);
					double km = set.getDouble(5);
					String road = set.getString(6);
					ts.append( year , month , dst , dsb , km , road );
				}
				res.resultContent = ts.toString();
			}else if( req.query.compareTo("area") == 0 ){
				String sql = "select preg.REGION_NAME , reg.REGION_NAME , m.MSRMT_DATE, m.DST_VALUE, m.DSB_VALUE, m.MSRMT_KM AS KM, m.ROAD_ID from CRMS_MSRMT_LIST m , CRMS_ROAD_INFO road , CRMS_REGION reg , CRMS_REGION preg , T_EQPMNT q "
						+" where preg.REGION_ID='rg_0001' and reg.PARENT_REGION_ID = preg.REGION_ID and road.REGION_ID=reg.REGION_ID  "
						+" and m.ROAD_ID = road.ROAD_ID and m.PURPS_SE='1' and (m.EQPMNT_ID IN ( SELECT EQPMNT_NAME FROM T_EQPMNT WHERE STAT_INCLD_YN = 'Y' )) and "
						+" (m.MSRMT_DATE BETWEEN TO_TIMESTAMP('2016-06-01 00:00:00.000') AND TO_TIMESTAMP('2016-07-01 00:00:00.000'))  and (m.DST_VALUE is not null and m.DSB_VALUE is not null) "
						+" order by  reg.REGION_NAME";
				
				preparedStatement = conn.prepareStatement(sql);
				ResultSet set = preparedStatement.executeQuery();
				AreaStat ts = new AreaStat();
				while (set.next()) {
					String preg = set.getString(1);
					String reg = set.getString(2);
					double dst = set.getDouble(4);
					double dsb = set.getDouble(5);
					double km = set.getDouble(6);
					String road = set.getString(7);
					ts.append( preg , reg , dst , dsb , km , road );
				}
				res.resultContent = ts.toString();
				
			}else if( req.query.compareTo("road") == 0 ){
				String sql = "select preg.REGION_NAME, reg.REGION_NAME , road.ROAD_NAME, road.MSRMT_DIRECTION, m.MSRMT_DATE, m.DST_VALUE, m.DSB_VALUE, m.MSRMT_KM AS KM, m.ROAD_ID from CRMS_MSRMT_LIST m , CRMS_ROAD_INFO road , CRMS_REGION reg , CRMS_REGION preg , T_EQPMNT q "
						+" where preg.REGION_ID='rg_0001' and reg.PARENT_REGION_ID = preg.REGION_ID and road.REGION_ID=reg.REGION_ID "
				+" and m.ROAD_ID = road.ROAD_ID and m.PURPS_SE='1' and (m.EQPMNT_ID IN ( SELECT EQPMNT_NAME FROM T_EQPMNT WHERE STAT_INCLD_YN = 'Y' )) and "
				+" (m.MSRMT_DATE BETWEEN TO_TIMESTAMP('2016-06-01 00:00:00.000') AND TO_TIMESTAMP('2016-06-04 00:00:00.000'))  and (m.DST_VALUE is not null and m.DSB_VALUE is not null) "
				+" order by  m.MSRMT_DATE asc";
				preparedStatement = conn.prepareStatement(sql);
				ResultSet set = preparedStatement.executeQuery();
				RoadStat ts = new RoadStat();
				while (set.next()) {
					String preg = set.getString(1);
					String reg = set.getString(2);
					String roadName = set.getString(3) + "(" + set.getString(4) + ")";
					
					Timestamp t = set.getTimestamp(5);
					Calendar c = Calendar.getInstance();
					c.setTimeInMillis(t.getTime());
					int year = c.get(Calendar.YEAR);
					int month = c.get(Calendar.MONTH)+1;
					int day = c.get(Calendar.DAY_OF_MONTH);
					String date = year + "/" + month + "/" + day;
					double dst = set.getDouble(6);
					double dsb = set.getDouble(7);
					double km = set.getDouble(8);
					ts.append( preg + " " + reg , date , dst , dsb , km , roadName );
				}
				res.resultContent = ts.toString();
			}else if( req.query.compareTo("overroad") == 0 ){
				String sql = "select preg.REGION_NAME, reg.REGION_NAME, m.DST_VALUE,m.ROAD_ID from CRMS_MSRMT_LIST m , CRMS_ROAD_INFO road , CRMS_REGION reg , CRMS_REGION preg , T_EQPMNT q "
						+" where preg.REGION_ID='rg_0001' and reg.PARENT_REGION_ID = preg.REGION_ID and road.REGION_ID=reg.REGION_ID "
						+" and m.ROAD_ID = road.ROAD_ID and m.PURPS_SE='1' and (m.EQPMNT_ID IN ( SELECT EQPMNT_NAME FROM T_EQPMNT WHERE STAT_INCLD_YN = 'Y' )) and "
						+" (m.MSRMT_DATE BETWEEN TO_TIMESTAMP('2016-01-01 00:00:00.000') AND TO_TIMESTAMP('2016-07-01 00:00:00.000')) and (m.DST_VALUE is not null and m.DSB_VALUE is not null) "  
						+" order by  m.MSRMT_DATE asc;";
				preparedStatement = conn.prepareStatement(sql);
				ResultSet set = preparedStatement.executeQuery();
				StandardExStat ts = new StandardExStat();
				while (set.next()) {
					String preg = set.getString(1);
					String reg = set.getString(2);
					double dst = set.getDouble(3);
					String road = set.getString(4);
					ts.append( preg , reg , dst , road );
				}
				res.resultContent = ts.toString();
			}else if( req.query.compareTo("mailage-cnt") == 0 ){
				String sql = "SELECT EQPMNT_NAME FROM T_EQPMNT WHERE STAT_INCLD_YN = 'Y' ORDER BY EQPMNT_NAME";
				preparedStatement = conn.prepareStatement(sql);
				ResultSet set = preparedStatement.executeQuery();
				ArrayList<String> cars = new ArrayList<String>();
				while (set.next()) {
					cars.add( set.getString(1));
				}
				preparedStatement.close();
				
				sql = "select preg.REGION_NAME, reg.REGION_NAME , m.eqpmnt_id ,COUNT(*) AS CNT, SUM(ROAD_KM) AS KM "
						+" from CRMS_MSRMT_LIST m , CRMS_ROAD_INFO road ,  CRMS_REGION reg , CRMS_REGION preg "
						+" where reg.PARENT_REGION_ID = 'rg_0001' and reg.PARENT_REGION_ID = preg.REGION_ID and road.REGION_ID=reg.REGION_ID " 
						+" and m.ROAD_ID = road.ROAD_ID and m.PURPS_SE='1' and (m.EQPMNT_ID IN ( SELECT EQPMNT_NAME FROM T_EQPMNT WHERE STAT_INCLD_YN = 'Y' )) and "
						+" (m.MSRMT_DATE BETWEEN TO_TIMESTAMP('2012-06-30 00:00:00.000') AND TO_TIMESTAMP('2016-12-31 00:00:00.000')) group by preg.REGION_NAME , reg.REGION_NAME , m.eqpmnt_id "
						+" order by  reg.REGION_NAME";
				preparedStatement = conn.prepareStatement(sql);
				set = preparedStatement.executeQuery();
				MailageStat ts = new MailageStat(cars);
				while (set.next()) {
					String preg = set.getString(1);
					String reg = set.getString(2);
					String equip = set.getString(3);
					int cnt = set.getInt(4);
					double km = set.getDouble(5);
					ts.append( preg , reg , equip, cnt , km );
				}
				res.resultContent = ts.toString();
			}else if( req.query.compareTo("mailage-dist") == 0 ){
				
			}else{
				res.resultContent = executeSelect( conn , req.query );
			}
		}catch (NamingException | SQLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		} finally{
				
			if (preparedStatement != null) {
				try {
					preparedStatement.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			if( conn != null ){
				try {
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	public String executeSelect(Connection conn, String query) {
		boolean bSelectQuery = query.toLowerCase().trim().indexOf("select") == 0 ? true : false;
		
		StringBuffer buffer = new StringBuffer();
		//String testMsg = "";
		PreparedStatement pstmt = null;
		ResultSetMetaData metaData = null;
		try {
			pstmt = conn.prepareStatement(query);
			
			if( !bSelectQuery ){
				int count = pstmt.executeUpdate();
				return "{\"header\":[],\"rows\":[],\"message\":\""+count+" record(s) updated\"}";
			}
			ResultSet set = pstmt.executeQuery();

			metaData = set.getMetaData();
			int rowCount = 0;
			int iColumn = metaData.getColumnCount();
			buffer.append("{\"header\":[");
			
			//buffer.append("{\"name\":\"index\",\"length\":\"11\",\"type\":\"number\"}");
			
			for( int i = 0 ; i < iColumn ; i++ ){
				if( i > 0 ) buffer.append(",");
				buffer.append("{").append("\"name\":").append("\"").append(metaData.getColumnLabel(i+1)).append("\",")
				.append("\"length\":").append("\"").append(metaData.getColumnDisplaySize(i+1)).append("\",")
				.append("\"type\":").append("\"").append( FieldType.selectDataType( metaData.getColumnType(i+1)) ).append("\"")
				.append("}");
			}
			buffer.append("],");
			buffer.append("\"rows\":[[");
			
			//buffer.append("[\"index\"");
			for (int i = 0; i < iColumn; i++) {
				if( i > 0 )buffer.append(",");
				buffer.append("\"").append(metaData.getColumnLabel(i+1)).append("\"");
			}
			buffer.append("]");
			int rowIndex = 0;
			while (set.next()) {
				buffer.append(",");
				rowCount++;
				buffer.append("[");//\"").append( rowIndex++ ).append("\"");
				String row = "";
				for (int i = 1; i <= iColumn; i++) {
					if( i > 1 ) buffer.append(",");
					int columnType = metaData.getColumnType(i);
					switch( columnType ){
					case 4 : 
						row = ""+set.getInt(i);
						break;
					case -1:
						try{
							row = set.getString(i);
						}catch(SQLException q){
							q.printStackTrace();
							//testMsg = query + "\r\n" + rowCount + "->" + i + " / " + iColumn + " type : " + metaData.getColumnTypeName(i) + " ("+columnType + "), name : " + metaData.getColumnName(i);
							//System.err.println(testMsg);
							//row.append("");
						}
						break;
					default:
						row = set.getString(i);
					}
					if( row == null ){
						row = "";
					}
					buffer.append("\"").append(row).append("\"");
				}
				buffer.append("]\r\n");
			}
			buffer.append("]");
			buffer.append("}");
		} catch (Exception e1) {
			//System.out.println( query );
			return "{\"header\":[],\"rows\":[],\"message\":\""+e1.getMessage()+"\"}";
		} finally {
			if( pstmt != null ){
				try {
					pstmt.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		return buffer.toString();
	}

	

	@Override
	public void handle(Widget widget, AppRequestSaveQuery req, AppResponseSaveQuery res) {
		res.requestKey = req.requestKey;
		res.language = req.language;
		res.result = "OK";
		
		Provider provider = new MySQLProvider("");
		provider.saveQuery( req.name , req.dataSourceName , req.query );
	}
	
}

/** build by djshin
*** version 3.3
**/
	
package com.kplot.web.table;

import java.sql.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.io.IOException;
import java.io.OutputStream;

import com.itf.framework.db.XTable;
import com.itf.framework.db.DataPipe;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

//import com.sun.org.apache.xml.internal.security.exceptions.Base64DecodingException;
//import com.sun.org.apache.xml.internal.security.utils.Base64;

public class XTable_access_log extends XTable {

	public int			id = 0;		// Primary Key
	public Timestamp	logtime;		
	public String		host = "";		
	public String		content = "";		

	public XTable_access_log() { 
		super();
	}

	public XTable_access_log newInstance()
	{
		return new XTable_access_log();
	}
	
	public String page( String orderBy, int page , int pageSize ){
		
		if( orderBy != null && orderBy.length() > 0 ){
			orderBy =  "ORDER BY " + orderBy;
		}else{
			orderBy = "ORDER BY AppIdx ASC";
		}
		String sql = getKeyWhereString();
		
		if( sql.length() == 0 )
			sql =  "select ROW_NUMBER() OVER ( "+orderBy+" ) as ROW_NUM, * from access_log";
		else
			sql ="select ROW_NUMBER() OVER ( "+orderBy+" ) as ROW_NUM,* from access_log where " + getKeyWhereString();
		
		return "SELECT * from ( "+sql+" ) A WHERE ROW_NUM > ( "+page+"*"+pageSize+" ) AND ROW_NUM <= ( "+(page+1)+"*"+pageSize+" )";
	}
	
	public String getQuery( int iq ,  XTable tbl )
	{
		String sql = "";
		switch( iq )
		{
			case IQ_INSERT:
				sql = "insert INTO access_log(id, logtime, host, content) values (?,?,?,?)";
				break;
				
			case IQ_SELECT:
				sql = tbl.getKeyWhereString();
				if( sql.length() == 0 )
					sql =  "select * from access_log";
				else
					sql ="select * from access_log where " + tbl.getKeyWhereString();
				break;
				
			case IQ_UPDATE:
				sql =  "update access_log set id=? , logtime=? , host=? , content=? where " + tbl.getKeyWhereString();
				break;
				
			case IQ_DELETE:
				sql =  "delete from access_log where " + tbl.getKeyWhereString(); 
				break;
			case IQ_WHEREPREPAREDSTATEMENT:
				sql = "id=?";
					
			default:
				sql = "error!!!";				
		}
		return sql;
	}

	public boolean validatePrint( String strQuery )
	{

		if( logtime == null )
			System.out.println("logtime is null");

		if( host != null ) {
			if( host.length() <= 0 || host.length() > 50 )
				System.out.println("host[size=50] : (" + host.length() + ")"); }
		else
			System.out.println(" error field : host is null");

		if( content != null ) {
			if( content.length() <= 0 || content.length() > 256 )
				System.out.println("content[size=256] : (" + content.length() + ")"); }
		else
			System.out.println(" error field : content is null");

	

		if( strQuery != null )
		{
			System.out.println("access_log Query : ");
			System.out.println("insert INTO access_log(id, logtime, host, content) values ('"+id+"','"+logtime+"','"+host+"','"+content+"')");		
		}
		return true;
	}
	
	public int insert( Connection conn , ArrayList fieldList ) throws SQLException
	{
		int result = -1;
		StringBuffer sql = new StringBuffer();
		sql.append( "insert INTO access_log(" );
		Statement stmt = null;
		
		int size = fieldList.size();
		
		
		for( int i = 0 ; i < size ; i++ )
		{
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("id")) sql.append( "id ");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("logtime")) sql.append(  "logtime ");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("host")) sql.append(  "host ");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("content")) sql.append(  "content ");
 	
			
			if( ( size - 1 ) != i )
				 sql.append(",");
				 
		}
		sql.append(" ) values (");
		for (int i = 0 ; i < size ; i++) 
		{
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("id")) sql.append( " "+id+" ");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("logtime")) sql.append( "logtime = '"+logtime+"'");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("host")) sql.append( "host = '"+host+"'");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("content")) sql.append( "content = '"+content+"'");

			if( ( size - 1 ) != i )
				 sql.append(",");
				 
			
		}
		sql.append(")");
		
		try {
			stmt = conn.createStatement();
			result = stmt.executeUpdate( new String ( sql )  );
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			if(stmt != null)
			{
				try {
					stmt.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}	
		}
		return result;
	}
	
	public int update( Connection conn , ArrayList fieldList , String whereStr ) throws SQLException
	{
		int result = -1;
		StringBuffer sql = new StringBuffer();
		sql.append( "update access_log set   ");;
		Statement stmt = null;
		int size = fieldList.size();
		
		for( int i = 0 ; i < size ; i++ )
		{
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("id")) sql.append( "id = "+id+"");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("logtime")) sql.append( "logtime = '"+logtime+"'");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("host")) sql.append( "host = '"+host+"'");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("content")) sql.append( "content = '"+content+"'");
	
			if( ( size - 1 ) != i )
				 sql.append(",");
		}
		if( whereStr.length() < 1 )
		{
			sql.append( " where " ) ;
			sql.append( getKeyWhereString());
		}
		else
		{
			sql.append( " where " );
			sql.append( whereStr);
		}
		
		try {
			stmt = conn.createStatement();
			result = stmt.executeUpdate( new String ( sql )  );
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			if(stmt != null)
			{
				try {
					stmt.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}	
		}
		
		return result;
	}
	
	public  String[] getColumnNames()
	{
		String[] columns = {"id","logtime","host","content" };
		return columns;	
		
	}
	

	
	
	public int insert( Connection conn )
	{
		int result = -1;
		PreparedStatement pstmt = null;
		try {
			pstmt = conn.prepareStatement(this.getQuery(
					XTable.IQ_INSERT, this));	
			pstmt.setInt(1,  id);
			pstmt.setTimestamp(2, logtime);
			pstmt.setString(3, host);
			pstmt.setString(4, content);


			result = pstmt.executeUpdate();
		
		} catch (SQLException e) {
		    e.printStackTrace();
		    validatePrint( this.getQuery(  XTable.IQ_INSERT , this ) );
		} catch (Exception e) {
			e.printStackTrace();
		} finally{
			if(pstmt != null)
			{
				try {
					pstmt.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			
		}
		
		return result;
	}
	public int insert( Connection conn , String sql )
	{
		int result = -1;
		Statement stmt = null;
		try {
			if( sql.length() < 1 || sql == null || sql.equalsIgnoreCase("null") )
			{
				insert( conn );
			}else
			{
				stmt = conn.createStatement();	
				result = stmt.executeUpdate( sql );
			}
			
		} catch (SQLException e) {
		    e.printStackTrace();
		    validatePrint( sql );
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if(stmt != null){
				try {
					stmt.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		return result;
	}
	
	/*
	public int insert( PreparedStatement pstmt )
	{
		int result = -1;
		try {
			pstmt.setInt(1,  id);
			pstmt.setTimestamp(2, logtime);
			pstmt.setString(3, host);
			pstmt.setString(4, content);

			result = pstmt.executeUpdate();
		
		} catch (SQLException e) {
			e.printStackTrace();
			validatePrint( this.getQuery(  XTable.IQ_INSERT , this ) );
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	*/
	public int update( Connection conn )
	{
		int result = -1;
		try {
			PreparedStatement pstmt = conn.prepareStatement(this.getQuery(
					XTable.IQ_UPDATE, this));	
			pstmt.setInt(1,  id);
			pstmt.setTimestamp(2, logtime);
			pstmt.setString(3, host);
			pstmt.setString(4, content);


			result = pstmt.executeUpdate();
		
		} catch (SQLException e) {
		    e.printStackTrace();
		    validatePrint( this.getQuery(  XTable.IQ_UPDATE , this ) );
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	
	public int update( Connection conn , String sql )
	{
		int result = -1;
		Statement stmt = null;
		try {
			if(sql.length() < 1 || sql == null || sql.equalsIgnoreCase("null") )
			{
				update( conn );
			}else{
				stmt = conn.createStatement();	
				result = stmt.executeUpdate(sql);
			}
		} catch (SQLException e) {
		    e.printStackTrace();
		    validatePrint( sql );
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if(stmt != null){
				try {
					stmt.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		return result;
	}

	public int updateField( Connection conn , String field , String value , String whereString )
	{
		if( field == null )
			return 0;
		
		int result = -1;
		try {
			if (whereString != null)
				setWhereString(whereString);
			
			PreparedStatement pstmt = conn.prepareStatement("update access_log set "+field+"=? where " + 				getKeyWhereString() );	

			pstmt.setString( 1 , value );
			
			result = pstmt.executeUpdate();
		
		} catch (SQLException e) {
			e.printStackTrace();
			validatePrint( this.getQuery(  XTable.IQ_DELETE , this ) );
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	
	public int updateFieldTimestamp( Connection conn , String field , Timestamp value , String whereString )
	{
		if( field == null )
			return 0;
		
		int result = -1;
		try {
			if (whereString != null)
				setWhereString(whereString);
			
			PreparedStatement pstmt = conn.prepareStatement("update access_log set "+field+"=? where " + getKeyWhereString() );	

			pstmt.setTimestamp( 1 , value );
			
			result = pstmt.executeUpdate();
		
		} catch (SQLException e) {
			e.printStackTrace();
			validatePrint( this.getQuery(  XTable.IQ_DELETE , this ) );
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	
	
	/*
	public int update( PreparedStatement pstmt )
	{
		int result = -1;
		try {
			pstmt.setInt(1,  id);
			pstmt.setTimestamp(2, logtime);
			pstmt.setString(3, host);
			pstmt.setString(4, content);

			result = pstmt.executeUpdate();
		
		} catch (SQLException e) {
		    e.printStackTrace();
		    validatePrint( this.getQuery(  XTable.IQ_UPDATE , this ) );
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	*/
	public int updatePrep( PreparedStatement pstmt )
	{
		int result = -1;
		try {
			pstmt.setInt(1,  id);

			result = pstmt.executeUpdate();
		
		} catch (SQLException e) {
		   e.printStackTrace();
		   validatePrint( this.getQuery(  XTable.IQ_UPDATE , this ) );
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	
	public int delete( Connection conn )
	{
		int result = -1;
		try {
			PreparedStatement pstmt = conn.prepareStatement(this.getQuery(
					XTable.IQ_DELETE, this));	

			result = pstmt.executeUpdate();
		
		} catch (SQLException e) {
			e.printStackTrace();
			validatePrint( this.getQuery(  XTable.IQ_DELETE , this ) );
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	
	public int delete( Connection conn , String sql )
	{
		int result = -1;
		Statement stmt = null;
		try {
			if(sql.length() < 1 || sql == null || sql.equalsIgnoreCase("null") )
			{
				delete( conn );
			}else{
				stmt = conn.createStatement();	
				result = stmt.executeUpdate(sql);
			}
		} catch (SQLException e) {
		    e.printStackTrace();
		    validatePrint( sql );
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if(stmt != null){
				try {
					stmt.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		return result;
	}
	
	
	public ArrayList<XTable_access_log> pageList(Connection conn,
			String whereString, String orderBy , int page , int pageSize) throws SQLException {
		ArrayList<XTable_access_log> aList = new ArrayList<XTable_access_log>();

		if (whereString != null)
			setWhereString(whereString);

		PreparedStatement pstmt = conn.prepareStatement(page( orderBy, page , pageSize ));
		ResultSet set = pstmt.executeQuery();

		while (set.next()) {
			XTable_access_log tableInfo = (XTable_access_log) new XTable_access_log();
			ROW_NUM = set.getInt("ROW_NUM");
			tableInfo.select( set );

			aList.add(tableInfo);
		}

		return aList;
	}
	
	public ArrayList<XTable_access_log> selectList( ResultSet set ) throws SQLException
	{
		ArrayList<XTable_access_log> aList = new ArrayList<XTable_access_log>();
	
		while(set.next()){
				XTable_access_log tableInfo = (XTable_access_log)XTable.createInstance("com.kplot.web.table.XTable_access_log");
			
			 tableInfo.id = set.getInt("id");
			 tableInfo.logtime = set.getTimestamp("logtime");
			 tableInfo.host = set.getString("host");
			 tableInfo.content = set.getString("content");


			aList.add(tableInfo);
		}
		
		return aList;
	}
	
	public ArrayList<XTable_access_log> selectList(Connection conn,
			String whereString) throws SQLException {
		ArrayList<XTable_access_log> aList = new ArrayList<XTable_access_log>();

		if (whereString != null)
			setWhereString(whereString);

		PreparedStatement pstmt = conn.prepareStatement(getQuery(
				XTable.IQ_SELECT, this));
		ResultSet set = pstmt.executeQuery();

		while (set.next()) {
			XTable_access_log tableInfo = (XTable_access_log) new XTable_access_log();
			tableInfo.select( set );

			aList.add(tableInfo);
		}

		return aList;
	}

	public int select( ResultSet set )  throws SQLException
	{
		
			id = set.getInt("id");
			logtime = set.getTimestamp("logtime");
			host = set.getString("host");
			content = set.getString("content");

		
		return 0;
	}
	
	public static XTable_access_log select( Connection conn , String whereString ) throws SQLException{
		XTable_access_log table = new XTable_access_log();
		if( whereString != null )
			table.setWhereString( whereString );
		PreparedStatement pstmt = conn.prepareStatement(table.getQuery(
				XTable.IQ_SELECT, table));
		ResultSet set = pstmt.executeQuery();
		
		if( set.next() )
			table.select(set);
		else
			return null;
		
		return table;
	}
	
	public String getKeyString()
	{
		return m_prefix +id;
	}
	
	public String getKeyWhereString()
	{
		if( m_userWhere != null && m_userWhere.length() > 0 )
			return m_userWhere;
		return m_prefix +"id='"+id+"'";
	}
	
	public boolean exist( Connection conn ) throws SQLException
	{
		boolean bexist = false;
		Statement stmt = conn.createStatement();	
		ResultSet set = stmt.executeQuery( "select id from access_log where " + getKeyWhereString() );
			
		if( set.next() )
			bexist = true;
			
		stmt.close();
		
		return bexist;
	}
	
	public void read( DataPipe pipe ) throws IOException
	{
			id		 = pipe.readInt(false);
			logtime		 = pipe.readTimestamp(false);
			host		 = pipe.readString(false);
			content		 = pipe.readString(false);

	}
	
	public void write( DataPipe pipe ) throws IOException{
			pipe.writeInt(false,  id);
			pipe.writeTimestamp(false, logtime);
			pipe.writeString(false,   host);
			pipe.writeString(false,   content);
	
	}
		
	public boolean writeCSV(ArrayList list , OutputStream out ){

		int size = list.size();
		StringBuffer sb = new StringBuffer(); 
		sb.append(id).append(",");
		sb.append(logtime).append(",");
		sb.append(host).append(",");
		sb.append(content);


		for( int i = 0 ; i < size ; i++ )
		{
			XTable_access_log table = (XTable_access_log) list.get(i);
			
			sb.append(table.id).append(",");
			sb.append(table.logtime).append(",");
			sb.append(table.host).append(",");
			sb.append(table.content);

			if(i != size-1)
				sb.append(",");
		}
			try {
				out.write(sb.toString().getBytes());
				out.write("\n".getBytes());
				return true;
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return false;
			}
		
	}
	public JSONObject encoding(){
		JSONObject obj = new JSONObject();
		try {
			obj.put("id",id);
			if( logtime != null ){ obj.put("logtime", logtime.toString() ); }
			if( host != null ){ obj.put("host",host); }else{ obj.put("host",""); }
			if( content != null ){ obj.put("content",content); }else{ obj.put("content",""); }

		} catch (JSONException e) {
			e.printStackTrace();
		}
		return obj;
	}

	@SuppressWarnings("unchecked")
	public static XTable_access_log decoding(JSONObject obj) {
		XTable_access_log wrapper = new XTable_access_log();
		try {
			if( obj.has("id") ){ wrapper.id = obj.getInt("id"); }
			if( obj.has("logtime") ){ wrapper.logtime = Timestamp.valueOf( (String) obj.get("logtime") ); }
			if( obj.has("host") ){ wrapper.host = obj.getString("host"); }
			if( obj.has("content") ){ wrapper.content = obj.getString("content"); }

		} catch (Exception e) {
			e.printStackTrace();
		}
		return wrapper;
	}
}
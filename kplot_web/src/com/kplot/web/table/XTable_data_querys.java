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

public class XTable_data_querys extends XTable {

	public int			id = 0;		// Primary Key
	public String		name = "";		
	public String		source = "";		
	public String		query = "";		
	public String		keywords = "";		

	public XTable_data_querys() { 
		super();
	}

	public XTable_data_querys newInstance()
	{
		return new XTable_data_querys();
	}
	
	public String page( String orderBy, int page , int pageSize ){
		
		if( orderBy != null && orderBy.length() > 0 ){
			orderBy =  "ORDER BY " + orderBy;
		}else{
			orderBy = "ORDER BY AppIdx ASC";
		}
		String sql = getKeyWhereString();
		
		if( sql.length() == 0 )
			sql =  "select ROW_NUMBER() OVER ( "+orderBy+" ) as ROW_NUM, * from data_querys";
		else
			sql ="select ROW_NUMBER() OVER ( "+orderBy+" ) as ROW_NUM,* from data_querys where " + getKeyWhereString();
		
		return "SELECT * from ( "+sql+" ) A WHERE ROW_NUM > ( "+page+"*"+pageSize+" ) AND ROW_NUM <= ( "+(page+1)+"*"+pageSize+" )";
	}
	
	public String getQuery( int iq ,  XTable tbl )
	{
		String sql = "";
		switch( iq )
		{
			case IQ_INSERT:
				sql = "insert INTO data_querys(id, name, source, query, keywords) values (?,?,?,?,?)";
				break;
				
			case IQ_SELECT:
				sql = tbl.getKeyWhereString();
				if( sql.length() == 0 )
					sql =  "select * from data_querys";
				else
					sql ="select * from data_querys where " + tbl.getKeyWhereString();
				break;
				
			case IQ_UPDATE:
				sql =  "update data_querys set id=? , name=? , source=? , query=? , keywords=? where " + tbl.getKeyWhereString();
				break;
				
			case IQ_DELETE:
				sql =  "delete from data_querys where " + tbl.getKeyWhereString(); 
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

		if( name != null ) {
			if( name.length() <= 0 || name.length() > 256 )
				System.out.println("name[size=256] : (" + name.length() + ")"); }
		else
			System.out.println(" error field : name is null");

		if( source != null ) {
			if( source.length() <= 0 || source.length() > 256 )
				System.out.println("source[size=256] : (" + source.length() + ")"); }
		else
			System.out.println(" error field : source is null");

		if( query != null ) {
			if( query.length() <= 0 || query.length() > 2048 )
				System.out.println("query[size=2048] : (" + query.length() + ")"); }
		else
			System.out.println(" error field : query is null");

		if( keywords != null ) {
			if( keywords.length() <= 0 || keywords.length() > 1024 )
				System.out.println("keywords[size=1024] : (" + keywords.length() + ")"); }
		else
			System.out.println(" error field : keywords is null");

	

		if( strQuery != null )
		{
			System.out.println("data_querys Query : ");
			System.out.println("insert INTO data_querys(id, name, source, query, keywords) values ('"+id+"','"+name+"','"+source+"','"+query+"','"+keywords+"')");		
		}
		return true;
	}
	
	public int insert( Connection conn , ArrayList fieldList ) throws SQLException
	{
		int result = -1;
		StringBuffer sql = new StringBuffer();
		sql.append( "insert INTO data_querys(" );
		Statement stmt = null;
		
		int size = fieldList.size();
		
		
		for( int i = 0 ; i < size ; i++ )
		{
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("id")) sql.append( "id ");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("name")) sql.append(  "name ");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("source")) sql.append(  "source ");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("query")) sql.append(  "query ");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("keywords")) sql.append(  "keywords ");
 	
			
			if( ( size - 1 ) != i )
				 sql.append(",");
				 
		}
		sql.append(" ) values (");
		for (int i = 0 ; i < size ; i++) 
		{
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("id")) sql.append( " "+id+" ");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("name")) sql.append( "name = '"+name+"'");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("source")) sql.append( "source = '"+source+"'");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("query")) sql.append( "query = '"+query+"'");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("keywords")) sql.append( "keywords = '"+keywords+"'");

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
		sql.append( "update data_querys set   ");;
		Statement stmt = null;
		int size = fieldList.size();
		
		for( int i = 0 ; i < size ; i++ )
		{
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("id")) sql.append( "id = "+id+"");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("name")) sql.append( "name = '"+name+"'");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("source")) sql.append( "source = '"+source+"'");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("query")) sql.append( "query = '"+query+"'");
			 if(( (String)fieldList.get(i)).equalsIgnoreCase("keywords")) sql.append( "keywords = '"+keywords+"'");
	
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
		String[] columns = {"id","name","source","query","keywords" };
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
			pstmt.setString(2, name);
			pstmt.setString(3, source);
			pstmt.setString(4, query);
			pstmt.setString(5, keywords);


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
			pstmt.setString(2, name);
			pstmt.setString(3, source);
			pstmt.setString(4, query);
			pstmt.setString(5, keywords);

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
			pstmt.setString(2, name);
			pstmt.setString(3, source);
			pstmt.setString(4, query);
			pstmt.setString(5, keywords);


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
			
			PreparedStatement pstmt = conn.prepareStatement("update data_querys set "+field+"=? where " + 				getKeyWhereString() );	

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
			
			PreparedStatement pstmt = conn.prepareStatement("update data_querys set "+field+"=? where " + getKeyWhereString() );	

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
			pstmt.setString(2, name);
			pstmt.setString(3, source);
			pstmt.setString(4, query);
			pstmt.setString(5, keywords);

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
	
	
	public ArrayList<XTable_data_querys> pageList(Connection conn,
			String whereString, String orderBy , int page , int pageSize) throws SQLException {
		ArrayList<XTable_data_querys> aList = new ArrayList<XTable_data_querys>();

		if (whereString != null)
			setWhereString(whereString);

		PreparedStatement pstmt = conn.prepareStatement(page( orderBy, page , pageSize ));
		ResultSet set = pstmt.executeQuery();

		while (set.next()) {
			XTable_data_querys tableInfo = (XTable_data_querys) new XTable_data_querys();
			ROW_NUM = set.getInt("ROW_NUM");
			tableInfo.select( set );

			aList.add(tableInfo);
		}

		return aList;
	}
	
	public ArrayList<XTable_data_querys> selectList( ResultSet set ) throws SQLException
	{
		ArrayList<XTable_data_querys> aList = new ArrayList<XTable_data_querys>();
	
		while(set.next()){
				XTable_data_querys tableInfo = (XTable_data_querys)XTable.createInstance("com.kplot.web.table.XTable_data_querys");
			
			 tableInfo.id = set.getInt("id");
			 tableInfo.name = set.getString("name");
			 tableInfo.source = set.getString("source");
			 tableInfo.query = set.getString("query");
			 tableInfo.keywords = set.getString("keywords");


			aList.add(tableInfo);
		}
		
		return aList;
	}
	
	public ArrayList<XTable_data_querys> selectList(Connection conn,
			String whereString) throws SQLException {
		ArrayList<XTable_data_querys> aList = new ArrayList<XTable_data_querys>();

		if (whereString != null)
			setWhereString(whereString);

		PreparedStatement pstmt = conn.prepareStatement(getQuery(
				XTable.IQ_SELECT, this));
		ResultSet set = pstmt.executeQuery();

		while (set.next()) {
			XTable_data_querys tableInfo = (XTable_data_querys) new XTable_data_querys();
			tableInfo.select( set );

			aList.add(tableInfo);
		}

		return aList;
	}

	public int select( ResultSet set )  throws SQLException
	{
		
			id = set.getInt("id");
			name = set.getString("name");
			source = set.getString("source");
			query = set.getString("query");
			keywords = set.getString("keywords");

		
		return 0;
	}
	
	public static XTable_data_querys select( Connection conn , String whereString ) throws SQLException{
		XTable_data_querys table = new XTable_data_querys();
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
		ResultSet set = stmt.executeQuery( "select id from data_querys where " + getKeyWhereString() );
			
		if( set.next() )
			bexist = true;
			
		stmt.close();
		
		return bexist;
	}
	
	public void read( DataPipe pipe ) throws IOException
	{
			id		 = pipe.readInt(false);
			name		 = pipe.readString(false);
			source		 = pipe.readString(false);
			query		 = pipe.readString(false);
			keywords		 = pipe.readString(false);

	}
	
	public void write( DataPipe pipe ) throws IOException{
			pipe.writeInt(false,  id);
			pipe.writeString(false,   name);
			pipe.writeString(false,   source);
			pipe.writeString(false,   query);
			pipe.writeString(false,   keywords);
	
	}
		
	public boolean writeCSV(ArrayList list , OutputStream out ){

		int size = list.size();
		StringBuffer sb = new StringBuffer(); 
		sb.append(id).append(",");
		sb.append(name).append(",");
		sb.append(source).append(",");
		sb.append(query).append(",");
		sb.append(keywords);


		for( int i = 0 ; i < size ; i++ )
		{
			XTable_data_querys table = (XTable_data_querys) list.get(i);
			
			sb.append(table.id).append(",");
			sb.append(table.name).append(",");
			sb.append(table.source).append(",");
			sb.append(table.query).append(",");
			sb.append(table.keywords);

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
			if( name != null ){ obj.put("name",name); }else{ obj.put("name",""); }
			if( source != null ){ obj.put("source",source); }else{ obj.put("source",""); }
			if( query != null ){ obj.put("query",query); }else{ obj.put("query",""); }
			if( keywords != null ){ obj.put("keywords",keywords); }else{ obj.put("keywords",""); }

		} catch (JSONException e) {
			e.printStackTrace();
		}
		return obj;
	}

	@SuppressWarnings("unchecked")
	public static XTable_data_querys decoding(JSONObject obj) {
		XTable_data_querys wrapper = new XTable_data_querys();
		try {
			if( obj.has("id") ){ wrapper.id = obj.getInt("id"); }
			if( obj.has("name") ){ wrapper.name = obj.getString("name"); }
			if( obj.has("source") ){ wrapper.source = obj.getString("source"); }
			if( obj.has("query") ){ wrapper.query = obj.getString("query"); }
			if( obj.has("keywords") ){ wrapper.keywords = obj.getString("keywords"); }

		} catch (Exception e) {
			e.printStackTrace();
		}
		return wrapper;
	}
}
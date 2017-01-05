package com.kplot.web.data;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import com.kplot.web.StartupServlet;
import com.kplot.web.data.Field;

public class MySQLProvider implements Provider {
	private String tableName;
	private String queryType;
	private String dataSource;
	private String tableQuery;
	private ArrayList<Field> fields;
	public MySQLProvider( String name ){
		tableName = name;
		queryType = "table";
	}
	public MySQLProvider(String name, String queryType, String dataSource, String tableQuery) {
		tableName = name;
		if( queryType != null && queryType.compareTo("query") == 0 ){
			this.queryType = queryType;
			this.dataSource = dataSource;
			this.tableQuery = tableQuery;
		}else{
			this.queryType = "table";	
		}
	}
	@Override
	public void setName(String name) {
		tableName = name;
	}

	@Override
	public String getName() {
		return tableName;
	}

	@Override
	public boolean remove(){
		DataSource dataSource;
		Connection conn = null;
		Context context;
		PreparedStatement preparedStatement = null;
		try {
			context = new InitialContext();
			dataSource = (DataSource) context.lookup(StartupServlet.DataSourceName);
			conn = dataSource.getConnection();
		
			String sql = "delete from data_tables where table_name='"+getName()+"'";
			preparedStatement = conn.prepareStatement(sql);
			if( preparedStatement.executeUpdate() > 0 ){
				preparedStatement.close();
				sql = "DROP TABLE " + getName();
				preparedStatement = conn.prepareStatement(sql);
				if( preparedStatement.executeUpdate() > 0 ){
					return true;
				}
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
		return false;
	}
	
	@Override
	public boolean write(ArrayList<ArrayList<String>> matrix) throws UnknownTableException, AlreadyExistedTableException {
		if( matrix.size() == 0 )
			return false;
		
		DataSource dataSource;
		Connection conn = null;
		Context context;
		PreparedStatement preparedStatement = null;
		try {
			context = new InitialContext();
			dataSource = (DataSource) context.lookup(StartupServlet.DataSourceName);
			conn = dataSource.getConnection();
			
			if( find( conn , getName() ) ){
				throw new AlreadyExistedTableException( getName() );
			}
			
			int firstRowIndex = createFields(matrix);
			if( create( conn , getName(), getColumns() ) ){
				System.out.println( "Created Table called by " + getName() );
				String columns = "";
				String valueParam = "";
				String comma = "";
				ArrayList<Field> columnList = getColumns();
				for( int i = 1 ; i < columnList.size() ; i++ ){
					comma = (i > 1)?",":"";
					columns +=  comma + "`" + columnList.get(i).name +"`";
					valueParam += comma+"?";
				}
				String sql = "INSERT INTO "+getName()+" ("+columns+") VALUES ("+valueParam+")";
				System.out.println( "데이터입력  ");
				preparedStatement = conn.prepareStatement(sql);
				for( int i = firstRowIndex ; i < matrix.size() ; i++ ){
					ArrayList<String> rows = matrix.get(i);
					
					for( int r = 0 ; r < rows.size() ; r++ ){
						//Field f = columnList.get(r);
						preparedStatement.setString( r+1 , rows.get(r));
					}
					if( preparedStatement.executeUpdate() > 0 ){
						
					}
				}
				System.out.println( "데이터입력  완료");
				return true;
			}else{
				System.err.println( "Fail Creating Table called by " + getName() );
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (NamingException e) {
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
		return false;
	}

	public ArrayList<Field> getColumns() throws UnknownTableException {
		if( fields == null ){
			String cmd = "explain " + getName();
			DataSource dataSource;
			Connection conn = null;
			Context context;
			PreparedStatement preparedStatement = null;
			try {
				context = new InitialContext();
				dataSource = (DataSource) context.lookup(StartupServlet.DataSourceName);
				conn = dataSource.getConnection();
				
				if( !find( conn , getName() ) ){
					remove();
					fields = null;
					throw new UnknownTableException( getName() );
				}
				preparedStatement = conn.prepareStatement(cmd);
				ResultSet result = preparedStatement.executeQuery();
				fields = new ArrayList<Field>();
				result.next();
				while (result.next()) {
					String name = result.getString(1);
					StringTokenizer stk = new StringTokenizer(result.getString(2), "() ");
					String stype = stk.nextToken();
					String slen = "0";
					if (stk.hasMoreTokens())
						slen = stk.nextToken();
					else
						slen = "0";
					
					FieldType type = MySQL.getFieldType(stype);
					if( type == null ){
						type = MySQL.getFieldType("varchar"); 
					}
					
					Field field = new Field(name,type,Integer.parseInt(slen));
					fields.add( field );	
				}
				
				if( fields.size() == 0 ){
					fields = null;
				}
				
			} catch (SQLException e) {
				e.printStackTrace();
			} catch (NamingException e) {
				// TODO Auto-generated catch block
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
		return fields;
	}
	
	private boolean create(Connection conn, String name, ArrayList<Field> fs ) {
		
		DataSource dataSource;
		Context context;
		Statement stmt = null;
		try {
			context = new InitialContext();
			dataSource = (DataSource) context.lookup(StartupServlet.DataSourceName);
			conn = dataSource.getConnection();
			
			stmt = conn.createStatement();
			
			String pre = "CREATE TABLE IF NOT EXISTS `"+name+"` ( " +
				  "`id` int(11) NOT NULL AUTO_INCREMENT,";
			StringBuffer buffer = new StringBuffer();
			for( int i = 1 ; i < fs.size() ; i++ ){
				buffer.append( fs.get(i).toString() );
			}
			String tail = "PRIMARY KEY (`id`)\r\n" +
				") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
			String sql = pre + buffer.toString() + tail;
			//System.out.println( sql );
			stmt.executeUpdate(sql);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		} finally{
			if (stmt != null) {
				try {
					stmt.close();
				} catch (SQLException e) {
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
		return false;
	}
	
	private boolean find(Connection conn, String name) {
		Statement stmt = null;
		try {
			stmt = conn.createStatement();
			String cmd = "show tables";
			ResultSet result = stmt.executeQuery(cmd);
			while (result.next()) {
				if( name.compareToIgnoreCase( result.getString(1) ) == 0 ){
					return true;
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally{
			if (stmt != null) {
				try {
					stmt.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return false;
	}
	private int createFields(ArrayList<ArrayList<String>> matrix) {
		int dataIndex = 1;
		
		if( matrix.size() > 0 ){
			fields = new ArrayList<Field>();
			ArrayList<String> header = matrix.get(0);
			
			for( int i = 0 ; i < header.size() ; i++ ){
				String h = header.get(i);
				if( Type.getType(h) != Type.STRING ){
					dataIndex = 0;
					break;
				}
			}
			if( dataIndex == 0 ){
				fields.add( new Field("id", MySQL.getFieldType("int"), 11) );
				for( int i = 0 ; i < header.size() ; i++ ){
					Field f = new Field("V"+i,MySQL.getFieldType("varchar"), 0);
					fields.add( f );
				}
			}else{
				fields.add( new Field("id", MySQL.getFieldType("int"), 11) );
				for( int i = 0 ; i < header.size() ; i++ ){
					String fname = header.get(i);
					if( fname.compareToIgnoreCase("id") == 0 ){
						fname = "id_org";
					}
					Field f = new Field( fname ,MySQL.getFieldType("varchar"), 0);
					fields.add( f );
				}
			}
			int oldType = Type.DOUBLE;
			for( int c = 0 ; c < header.size() ; c++ ){
				Field field = fields.get(c+1);
				oldType = Type.DOUBLE;
				double len = 0.0;
				for( int i = dataIndex ; i < matrix.size() ; i++ ){
					String value = matrix.get(i).get(c);
					len = Math.max( len, value.length() );
					int testType = Type.newType(oldType, Type.getType(value) );
					if( testType == Type.STRING || testType == Type.UNKNOWN ){
						oldType = Type.STRING;
						
					}
				}
				System.out.println( field.name + " is " + Type.toString( oldType ) + " type");
				field.setType( oldType , (int)(len * 2.2) );
			}
		}
		return dataIndex;
	}
	@Override
	public ArrayList<ArrayList<String>> read(ArrayList<Field> columns) throws Exception {
		ArrayList<ArrayList<String>> data = new ArrayList<ArrayList<String>>();
		DataSource dataSource;
		Connection conn = null;
		Context context;
		PreparedStatement preparedStatement = null;
		try {
			if( queryType.compareTo("table") == 0 ){
				context = new InitialContext();
				dataSource = (DataSource) context.lookup(StartupServlet.DataSourceName);
				conn = dataSource.getConnection();
				String sql = "select * from " + getName() + " order by id";
				preparedStatement = conn.prepareStatement(sql);
			}else if( queryType.compareTo("query") == 0 ){
				context = new InitialContext();
				dataSource = (DataSource) context.lookup(this.dataSource);
				conn = dataSource.getConnection();
				preparedStatement = conn.prepareStatement(this.tableQuery);
			}
			
			ResultSet result = preparedStatement.executeQuery();
			if( columns.size() == 0 ){
				ResultSetMetaData metaData = result.getMetaData();
				int rowCount = 0;
				int iColumn = metaData.getColumnCount();
				for( int i = 0 ; i < iColumn ; i++ ){
					String type = FieldType.selectDataType( metaData.getColumnType(i+1));
					Field field = new WField( metaData.getColumnLabel(i+1) ,type, metaData.getColumnDisplaySize(i+1) );
					columns.add( field );
				}
			}
			//ArrayList<Field> fields = getColumns();
			ArrayList<String> header = new ArrayList<String>();
			for( int i = 0 ; i < columns.size() ; i++ ){
				header.add( columns.get(i).name );
			}
			data.add( header );
			while( result.next() ){
				ArrayList<String> row = new ArrayList<String>();
				for( int c = 0 ; c < columns.size() ; c++ ){
					if( queryType.compareTo("table") == 0 ){ 
						row.add( result.getString(c+2) ); 
					}else{
						row.add( result.getString(c+1) );
					}
				}
				data.add( row );
			}
			return data;
		}finally{
				
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
	public ArrayList<Integer> getLengths() throws UnknownTableException{
		ArrayList<Integer> lengths = new ArrayList<Integer>();
		ArrayList<Field> fields = getColumns();
		for( int i = 0 ; i < fields.size() ; i++ ){
			lengths.add( fields.get(i).length );
		}
		return lengths;
	}
	public ArrayList<String> getTypes() throws UnknownTableException{
		ArrayList<String> types = new ArrayList<String>();
		ArrayList<Field> fields = getColumns();
		for( int i = 0 ; i < fields.size() ; i++ ){
			types.add( fields.get(i).type.javaType );
		}
		return types;
	}
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

	public boolean registry(String name, String table_name, String comment, String keywords ) {
		DataSource dataSource;
		Connection conn = null;
		Context context;
		PreparedStatement preparedStatement = null;
		try {
			context = new InitialContext();
			dataSource = (DataSource) context.lookup(StartupServlet.DataSourceName);
			conn = dataSource.getConnection();
		
			String sql = "insert INTO data_tables(name, table_name, comment, keywords) values (?,?,?,?)";
			preparedStatement = conn.prepareStatement(sql);
			preparedStatement.setString(1, name);
			preparedStatement.setString(2, table_name);
			preparedStatement.setString(3, comment);
			preparedStatement.setString(4, keywords);
			if( preparedStatement.executeUpdate() > 0 ){
				return true;
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
		return false;
	}
	private static HashMap<String,String> predefinedTables = new HashMap<String,String>();
	static {
		predefinedTables.put("access_log","access_log");
		predefinedTables.put("data_tables","data_tables");
		predefinedTables.put("data_views","data_views");
	}
	@Override
	public ArrayList<TableInfo> getTableList( String text ) {
		ArrayList<TableInfo> list = new ArrayList<TableInfo>();
		DataSource dataSource;
		Context context;
		Connection conn = null;
		Statement stmt = null;
		try {
			context = new InitialContext();
			dataSource = (DataSource) context.lookup(StartupServlet.DataSourceName);
			conn = dataSource.getConnection();
			
			stmt = conn.createStatement();
			text = text.trim();
			String cmd = "select * from data_tables" + (( text != null && text.length() > 0 ) ? " where name like '%%"+text+"%%'" : "");
			System.out.println( cmd );
			ResultSet result = stmt.executeQuery(cmd);
			while (result.next()) {
				if( predefinedTables.get( result.getString("table_name") ) == null ){
					TableInfo info = new TableInfo( result.getString("name") , result.getString("table_name") , result.getString("comment") );
					list.add(info);
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally{
			if (stmt != null) {
				try {
					stmt.close();
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
		return list;
	}
	@Override
	public ArrayList<TableInfo> getQueryList( String text ) {
		ArrayList<TableInfo> list = new ArrayList<TableInfo>();
		DataSource dataSource;
		Context context;
		Connection conn = null;
		Statement stmt = null;
		try {
			context = new InitialContext();
			dataSource = (DataSource) context.lookup(StartupServlet.DataSourceName);
			conn = dataSource.getConnection();
			
			stmt = conn.createStatement();
			text = text.trim();
			String cmd = "select * from data_querys" + (( text != null && text.length() > 0 ) ? " where name like '%%"+text+"%%'" : "");
			System.out.println( cmd );
			ResultSet result = stmt.executeQuery(cmd);
			while (result.next()) {
				TableInfo info = new TableInfo( result.getString("name") , result.getString("query") , result.getString("source") );
				list.add(info);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally{
			if (stmt != null) {
				try {
					stmt.close();
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
		return list;
	}
	@Override
	public boolean saveQuery(String name, String dataSourceName, String query) {
		DataSource dataSource;
		Connection conn = null;
		Context context;
		PreparedStatement preparedStatement = null;
		try {
			context = new InitialContext();
			dataSource = (DataSource) context.lookup(StartupServlet.DataSourceName);
			conn = dataSource.getConnection();
		
			String sql = "insert INTO data_querys(name, source, query, keywords) values (?,?,?,?)";
			preparedStatement = conn.prepareStatement(sql);
			preparedStatement.setString(1, name);
			preparedStatement.setString(2, dataSourceName);
			preparedStatement.setString(3, query);
			preparedStatement.setString(4, "");
			if( preparedStatement.executeUpdate() > 0 ){
				return true;
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
		return false;
	}

}

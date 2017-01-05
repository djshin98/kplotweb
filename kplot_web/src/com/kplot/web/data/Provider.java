package com.kplot.web.data;

import java.util.ArrayList;

public interface Provider {
	public void setName(String name);
	public String getName();
	public boolean remove();
	public boolean write( ArrayList<ArrayList<String>> matrix ) throws UnknownTableException, AlreadyExistedTableException;
	public ArrayList<ArrayList<String>> read(ArrayList<Field> columns) throws Exception;
	public ArrayList<Integer> getLengths() throws UnknownTableException;
	public ArrayList<String> getTypes() throws UnknownTableException;
	public ArrayList<Field> getColumns() throws UnknownTableException;
	public ArrayList<TableInfo> getTableList( String text );
	public boolean registry(String name, String table_name, String comment, String keywords);
	public boolean saveQuery(String name, String dataSourceName, String query);
	public ArrayList<TableInfo> getQueryList(String searchText);
}

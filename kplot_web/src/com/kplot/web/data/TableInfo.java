package com.kplot.web.data;

public class TableInfo {
	public String name;
	public String query;
	public String source;
	public String desc;
	public String tableName;

	public TableInfo( String n , String t , String desc ){
		this.name = n.trim();
		this.tableName = t.trim();
		this.query = this.tableName;
		this.desc = desc;
		this.source = this.desc;
	}
	
}

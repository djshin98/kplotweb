package com.kplot.web.data;

public class Field {
	public FieldType 	type;
	public int 		length;
	public String 	name;
	public Field( String n , FieldType t , int l ){
		type = t;
		name = n.trim();
		length = l;
	}
	public void setType(int oldType, int len) {
		String coltype;
		switch( oldType ){
		case Type.INT:coltype = "int"; len = 11; break;
		case Type.LONG:coltype = "long"; len = -1; break;
		case Type.FLOAT:coltype = "float"; len = -1; break;
		case Type.DOUBLE:coltype = "double"; len = -1; break;
		default:coltype = "varchar"; break;
		}
		
		type = MySQL.getFieldType(coltype);
		length = len;
	}
	public String toString(){
		return "`" + name + "` " + type.dbName + ((length > 0)?"("+length+")":"") + " DEFAULT '0', \r\n";
	}
}

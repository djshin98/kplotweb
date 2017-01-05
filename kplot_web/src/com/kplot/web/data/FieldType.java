package com.kplot.web.data;

public class FieldType {
	public String dbName;
	public String javaType;
	public int iType;

	public FieldType(String name, int i, String java) {
		dbName = name;
		javaType = java;
		iType = i;
	}
	
	public static String selectDataType(int columnType) {
		switch( columnType ){
		case 93 : return "date";
		case 1 : return "text";
		case 4 :
		case 2 : return "number";
		}
		return "string";
	}
	
}

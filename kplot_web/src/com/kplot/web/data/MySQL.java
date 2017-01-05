package com.kplot.web.data;

import java.sql.Types;
import java.util.HashMap;
import java.util.Map;

public class MySQL {
	public static HashMap<String,FieldType> typeMap = new HashMap<String,FieldType>();
	static {
		insertField("bigint", 127, "long");
		insertField("binary", 173, "byte");
		insertField("bit", 104, "byte");
		insertField("char", 175, "char");
		insertField("datetime", 61, "Timestamp");
		insertField("date", 62, "Timestamp");
		insertField("decimal", 106, "int");
		insertField("float", 62, "float");
		insertField("double", 59, "double");
		insertField("image", 34, "byte");
		insertField("int", 56, "int");
		insertField("money", 60, "MONEY");
		insertField("nchar", 239, "String");
		insertField("ntext", 99, "String");
		insertField("numeric", 108, "int");
		insertField("nvarchar", 231, "String");
		insertField("real", 59, "double");
		insertField("smalldatetime", 58, "Timestamp");
		insertField("smallint", 52, "int");
		insertField("mediumint", 55, "int");
		insertField("smallmoney", 122, "MONEY");
		insertField("sql_variant", 98, "String");
		insertField("sysname", 231, "String");
		insertField("text", 35, "String");
		insertField("timestamp", 189, "Timestamp");
		insertField("tinyint", 48, "int");
		insertField("uniqueidentifier", 36, "long");
		insertField("varbinary", 165, "bytes");
		insertField("varchar", 167, "String");
		insertField("enum", 168, "String");
		insertField("set", 169, "String");
		insertField("mediumblob", 169, "String");
		insertField("tinytext", 169, "String");
		insertField("mediumtext", 169, "String");
		insertField("time", Types.TIME, "Timestamp");
		insertField("blob", Types.BLOB, "bytes");
		insertField("longtext", -16, "String");
		insertField("year", Types.INTEGER, "char");
		insertField("longblob", Types.BLOB, "bytes");
	}
	
	private static void insertField(String dt, int i, String jt) {
		typeMap.put(dt.trim(), new FieldType(dt, i, jt));

	}
	
	public static String getFieldTypeString(String coltype) {
		FieldType t = (FieldType) typeMap.get(coltype);
		if (t != null)
			return t.javaType;

		return "unknown";

	}
	public static FieldType getFieldType(String coltype) {
		return typeMap.get(coltype);
	}
}

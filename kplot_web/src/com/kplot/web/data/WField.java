package com.kplot.web.data;

public class WField extends Field {

	public WField(String n, String type, int l) {
		super(n, convertFieldType(type), l);
		FieldType t = null;
		if( type.compareTo("string") == 0 ){
			
		}else{
			
		}
		
		// TODO Auto-generated constructor stub
	}

	private static FieldType convertFieldType(String type) {
		if( type.compareTo("date") == 0 ){
			return MySQL.getFieldType("timestamp");
		}else if( type.compareTo("text") == 0 ){
			return MySQL.getFieldType("text");
		}else if( type.compareTo("number") == 0 ){
			return MySQL.getFieldType("double");
		}else{
			return MySQL.getFieldType("varchar");
		}
	}

}

package com.kplot.web.data;

import java.util.regex.Pattern;

public class Type {
	public final static int UNKNOWN = -1;
	public final static int INT = 0;
	public final static int LONG =4;
	public final static int FLOAT = 2;
	public final static int DOUBLE = 1;
	public final static int STRING = 3;
	private static Pattern double_exp_Pattern = Pattern.compile("[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?");
	//private static Pattern doublePattern = Pattern.compile("-?\\d+(\\.\\d*)?");
	public static void main(String[] args) {
		Type t = new Type();
		String str [] = { "0.122322E-12","122.111" , "3" , "  " , "0" , "0.0" , "a" , "a12.1" , "0.a" , "0." , ".0" , "2147483647" , "2147483649" };
		for( int i = 0 ; i < str.length ; i++ ){
			System.out.println( str[i] + " is " + (t.isDouble( str[i] ) ? "double":"non") );
		}
		System.out.println("---------------------");
		for( int i = 0 ; i < str.length ; i++ ){
			System.out.println( str[i] + " is " + (t.isInteger( str[i] ) ? "integer":"non") );
		}
		System.out.println("---------------------");
		for( int i = 0 ; i < str.length ; i++ ){
			System.out.println( str[i] + " is " + t.toString( t.getType(str[i])) );
		}
		
		double d = 10.000000000333333333333331;
		float f = (float)d;
		if( d == (double)f ){
			System.out.println("true");
		}
		
	}
	
	public static boolean isDouble(String string) {
	    return double_exp_Pattern.matcher(string).matches();
	}
	public static boolean isInteger(String string){
		if( isDouble(string) ){
			double d = Double.parseDouble( string );
			return isLong( d );
		}
		return false;
	}
	public static boolean isInteger(double value){
		return Math.floor(value) == value;
	}
	public static boolean isLong(double value) {
		return Math.floor(value) == value;
	}

	public static boolean isFloat(double value) {
		float f = (float)value;
		if( value == (double)f ){
			return true;
		}
		return false;
	}
	
	public static Object getObjectFromString( int type , String string ){
		String vstr = string;
		
		if( string == null || string.isEmpty() ){
			if( type == STRING ){
				string = "";
				return string;
			}
			string = "0";
		}
		if( type == STRING ){
			return string;
		}
		double d = Double.parseDouble( string );
		switch( type ){
		case INT: return new Integer( (int)d );
		case LONG: return new Long( (long)d );
		case FLOAT: return new Float( (float)d );
		case DOUBLE: return new Double( d );
		}
		return string;
	}
	public static double getDoubleFromString( int type , String string ){
		String vstr = string;
		
		if( string == null || string.isEmpty() ){
			if( type == STRING ){
				string = "";
				return 0;
			}
			return 0;
		}
		if( isNumber(string) ){
			return Double.parseDouble( string );
		}
		return 0;
	}
	
	public static int getType(String string){
		
		if( isDouble(string) ){
			double d = Double.parseDouble( string );
			if( isLong( d ) ){
				long l = (long)d;
				if(  -2147483648 <= l && l <= 2147483647 ){
					return INT;
				}else{
					return LONG;
				}
			}else if( isFloat(d) )
				return FLOAT;
			
			return DOUBLE;
		}
		return STRING;
	}
	public static boolean isNumber(String string){
		int t = getType(string);
		return isNumber( t );
	}
	public static boolean isNumber(int t){
		if( t == INT || t == DOUBLE || t == FLOAT || t == LONG )
			return true;
		return false;
	}

	public static int newType( int oldType , int newType ){
		if( newType == UNKNOWN )
			return oldType;
		
		if( oldType == UNKNOWN )
			return newType;
		else if( oldType == STRING )
			return oldType;
		else if( oldType == DOUBLE ){
			if( newType == STRING )
				return STRING;
			return oldType;
		}else if( oldType == LONG ){
			if( newType == STRING || newType == DOUBLE || newType == FLOAT )
				return newType;
			return oldType;
		}else if( oldType == FLOAT ){
			if( newType == STRING || newType == DOUBLE )
				return newType;
			return oldType;
		}else if( oldType == INT ){
			if( newType == STRING || newType == DOUBLE || newType == FLOAT || newType == LONG )
				return newType;
			return oldType;
		}
		return newType;
	}
	
	public static String toString( int t ){
		switch( t ){
		case INT: return "integer";
		case LONG: return "long";
		case FLOAT: return "float";
		case DOUBLE: return "double";
		case STRING: return "string";
		}
		return "unknown";
	}

}



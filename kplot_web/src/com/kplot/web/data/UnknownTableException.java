package com.kplot.web.data;

public class UnknownTableException extends Exception {

	public String name;
	public UnknownTableException(String name) {
		this.name = name;
	}
	public String getMessage(){
		return name + " 테이블이 데이터베이스에 없습니다. data_tables 테이블에서 table_name='"+name+"'인 레코드를 삭제바랍니다.";
	}

}

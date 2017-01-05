package com.kplot.web.data;

public class AlreadyExistedTableException extends Exception {
	public String name;
	public AlreadyExistedTableException(String name) {
		this.name = name;
	}
	public String getMessage(){
		return name + " 테이블이 이미 데이터베이스에 있습니다. ";
	}
	

}

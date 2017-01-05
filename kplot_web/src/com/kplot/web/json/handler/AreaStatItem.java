package com.kplot.web.json.handler;

import java.util.HashMap;

public class AreaStatItem {
	public String 		sido;
	public String 		sgg;
	public double dst;
	public double dsb;
	public double km;
	public double road;
	
	private int count = 0;
	private double tdst= 0;
	private double tdsb= 0;
	private double tkm= 0;
	private HashMap<String,String> troad = new HashMap<String,String>(); 
	
	public AreaStatItem(String sido, String sgg) {
		this.sido = sido;
		this.sgg = sgg;
	}

	public void append(double dst2, double dsb2, double km2, String road2) {
		tdst += dst2;
		tdsb += dsb2;
		tkm += km2;
		troad.put(road2, road2);
		count++;
	}
	public void clear(){
		count = 0;
		tdst = 0;
		tdsb = 0;
		tkm = 0;
		troad = new HashMap<String,String>(); 
	}
	public void end(){
		this.dst = tdst / count;
		this.dsb = tdsb / count;
		this.km = tkm / count;
		this.road = troad.size();
	}

}

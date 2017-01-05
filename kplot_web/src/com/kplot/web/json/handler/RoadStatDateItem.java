package com.kplot.web.json.handler;

public class RoadStatDateItem {
	private String date;
	private double tdst = 0;
	private int count = 0;
	public RoadStatDateItem(String date) {
		this.date = date;
	}

	public double getValue() {
		return tdst/count;
	}

	public void end() {
	}

	public void append(double dst) {
		tdst += dst;
		count += 1;
	}

}

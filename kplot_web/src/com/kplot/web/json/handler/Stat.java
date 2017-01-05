package com.kplot.web.json.handler;

import org.json.JSONException;
import org.json.JSONObject;

public class Stat {
	protected JSONObject COLUMN(String name, int len, String type) throws JSONException {
		JSONObject obj = new JSONObject();
		obj.put("name", name);
		obj.put("length", len);
		obj.put("type", type);
		return obj;
	}
}

package com.kplot.web.data;

import java.awt.Color;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONArray;

import com.itf.framework.util.PathUtil;
import com.kplot.web.table.XTable_data_tables;

public class DataParser {

	public void parsingCSVFileData(ArrayList<String> sheetData) {
		if (sheetData != null) {
			ArrayList<ArrayList<String>> matrix = new ArrayList<ArrayList<String>>();

			for (int i = 0; i < sheetData.size(); i++) {
				int cnt = getCommaCount(sheetData.get(0));
				String[] parseData = new String[cnt];
				parseData = getParsingData(sheetData.get(i), cnt);

				ArrayList<String> realDataArray = new ArrayList<String>();

				for (int n = 0; n < parseData.length; n++) {

					String checkData = parseData[n];

					if (checkData != null && !checkData.trim().isEmpty()) {
						realDataArray.add(checkData);
					}
				}
				matrix.add(realDataArray);
			}
		}
	}
	private static int memoryIndex = 1;
	public boolean parse(String filePath) {

		ArrayList<ArrayList<String>> matrix = new ArrayList<ArrayList<String>>();
		String dataType = PathUtil.onlyExtention(filePath);
		try {
			if (dataType.equals("xls") || dataType.equals("xlsx")) {
				matrix = ReadExcel.readMatrix( filePath );
				String name = PathUtil.onlyName(filePath);
				
				Calendar c = Calendar.getInstance();
				
				
				String table_name = "table_" + (memoryIndex++) + "_" + c.getTimeInMillis();
				MySQLProvider provider = new MySQLProvider(table_name);
				if( provider.registry(name, table_name, name, "" ) ){
					return provider.write(matrix);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	private int findLimitColIndex(ArrayList<String> data) {

		int count = 0;

		for (int i = 0; i < data.size(); i++) {
			String rowstring = data.get(i);

			String[] colData = rowstring.split("\t");

			if (colData.length > count) {
				count = colData.length;
			}
		}

		return count;
	}

	private boolean existInArray(ArrayList<String> array,
			String string) {
		for( int i = 0 ; i < array.size() ; i++ ){
			if( array.get(i).compareTo(string) == 0 )
				return true;
		}
		return false;
	}

	public void parsingConfigSizeData(ArrayList<String> configData) {
		
	}

	public static int getCommaCount(String data) {

		Pattern p = Pattern.compile(",");

		Matcher m = p.matcher(data);
		int count = 0;

		for (int i = 0; m.find(i); i = m.end()) {
			count++;
		}
		return count + 1;
	}

	private int getAndCount(String data) {
		Pattern p = Pattern.compile("&");

		Matcher m = p.matcher(data);
		int count = 0;

		for (int i = 0; m.find(i); i = m.end()) {
			count++;
		}
		return count + 1;
	}

	public static String[] getParsingData(String data, int colNum) {
		String[] parseData = new String[colNum];

		String backData = data;

		for (int i = 0; i < colNum; i++) {

			if (backData.contains(",")) {
				int commaIndex = backData.indexOf(",");
				String cutData = backData.substring(0, commaIndex + 1)
						.replace(",", "").trim();
				parseData[i] = cutData;
				backData = backData.substring(commaIndex + 1);
			} else {
				if (backData != null && backData.length() > 0) {
					parseData[i] = backData;
				}
			}
		}

		return parseData;
	}

	private static String[] getParsingInnerData(String data, int colNum) {
		String[] parseData = new String[colNum];

		String backData = data;

		for (int i = 0; i < colNum; i++) {

			if (backData.contains("&")) {
				int commaIndex = backData.indexOf("&");
				String cutData = backData.substring(0, commaIndex + 1)
						.replace("&", "").trim();
				parseData[i] = cutData;
				backData = backData.substring(commaIndex + 1);
			} else {
				if (backData != null && backData.length() > 0) {
					parseData[i] = backData;
				}
			}
		}

		return parseData;
	}

	private String[] getParsingInnerColorData(String data, int colNum) {
		String[] parseData = new String[colNum];

		String backData = data;

		for (int i = 0; i < colNum; i++) {

			if (backData.contains("/")) {
				int commaIndex = backData.indexOf("/");
				String cutData = backData.substring(0, commaIndex + 1)
						.replace("/", "").trim();
				parseData[i] = cutData;
				backData = backData.substring(commaIndex + 1);
			} else {
				if (backData != null && backData.length() > 0) {
					parseData[i] = backData;
				}
			}
		}

		return parseData;
	}

}
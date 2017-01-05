package com.kplot.web.data;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Iterator;

import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

public class ReadExcel {

	public static ArrayList<ArrayList<String>> readMatrix(String filePath) {
		ArrayList<ArrayList<String>> matrix = new ArrayList<ArrayList<String>>();
		try {
			FileInputStream file = new FileInputStream(new File(filePath));

			DocumentBuilderFactory a = DocumentBuilderFactory.newInstance();

			Workbook workbook = WorkbookFactory.create(file);

			// Get first/desired sheet from the workbook
			Sheet sheet = workbook.getSheetAt(0);
			double value;
			String svalue;
			// Iterate through each rows one by one
			Iterator<Row> rowIterator = sheet.iterator();
			while (rowIterator.hasNext()) {
				Row row = rowIterator.next();
				// For each row, iterate through all the columns
				Iterator<Cell> cellIterator = row.cellIterator();
				ArrayList<String> rowList = new ArrayList<String>();
				int lastColumn = 0;
				while (cellIterator.hasNext()) {
					Cell cell = cellIterator.next();
					//System.out.println(cell.getRowIndex() + "," + cell.getColumnIndex());
					while (lastColumn + 1 < cell.getColumnIndex()) {
						rowList.add("");
						lastColumn++;
					}
					// Check the cell type and format accordingly
					switch (cell.getCellType()) {
					case Cell.CELL_TYPE_NUMERIC:
						value = cell.getNumericCellValue();
						svalue = Type.getObjectFromString(Type.getType(value + ""), value + "").toString();
						rowList.add(svalue);

						break;
					case Cell.CELL_TYPE_STRING:
						// System.out.print(cell.getStringCellValue() + "t");
						rowList.add(cell.getStringCellValue());
						break;
					default:
						rowList.add("");
						break;
					}

					lastColumn = cell.getColumnIndex();
				}
				matrix.add(rowList);
			}
			file.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return matrix;

	}

}

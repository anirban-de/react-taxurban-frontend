import React from 'react';
import ExcelJS from 'exceljs';

const TableToExcel = ({ data, keys, headerNames, fileName }) => {
  const handleDownload = async () => {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Add headers to the worksheet using mapped header names
    const headerRow = keys.map(key => headerNames[key]);
    worksheet.addRow(headerRow);

    // Add data rows to the worksheet
    data.forEach(item => {
      const row = keys.map(key => item[key]);
      worksheet.addRow(row);
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a download link and trigger the download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <span
      className={`cursor-pointer px-3 capitalize py-1 rounded-md bg-green-400 text-white`}
      onClick={handleDownload}
    >
      Download Excel
    </span>
  );
};

export default TableToExcel;
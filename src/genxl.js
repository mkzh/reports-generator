/* Excel report generator */
define(['xlwrapper', 'lodash'], function(xls, _) {
  /* Helper methods */
  var getLongestWidth = function(tables) {
    var largestSize = 0;
    for (var i = 0; i < tables.length; i++) {
      var nextSize = tables[i].getNumColumns();
      if (nextSize > largestSize) {
        largestSize = nextSize;
      }
    }

    return largestSize;
  }

  /* 
   * Calculate set width of excel sheet
   */
  var getSheetWidth = function(tables) {
    var PADDING = 10;
    var largestSize = getLongestWidth(tables);

    return largestSize + PADDING;
  }

  /*
   * calculate sheet height of excel sheet
   */
  var getSheetHeight = function(tables, information) {
    // Distance between each
    var PADDING = 5;

    // Height of the title and its padding
    var TITLE_HEIGHT = 5;

    var sheetHeight = 0;
    var infoLength = (information) ? Object.keys(information).length * 3 + 5 : 0;
    for (var i = 0; i < tables.length; i++) {
      var nextHeight = tables[i].getNumEntries() + 1;
      sheetHeight += nextHeight;
      sheetHeight += PADDING;
    }

    return sheetHeight + TITLE_HEIGHT + infoLength;
  }

  var xlsreport = function(dataObject, callback) {
    var ReportObject = {};

    // Is the layout columnwise or row-wise?
    /* 
     * Ie should the column titles be aligned row major or column major?
     * Feature to be implemented later
    var COLUMN_WISE = 0;
    var ROW_WISE = 1;
    */ 

    var workbook = xls.createWorkbook();

    // Write the excel stuff
    _(dataObject).forEach(function(sheetData, sheetName) {
      // Marign between the edge of the sheet and the table
      var TABLE_MARGIN = 2;

      if (!sheetData || !sheetName) callback(new Error("Excel Write: Malformed excel object"));

      // Sheet width and height, used for sheed creation
      var sheetWidth = getSheetWidth(sheetData.data);
      var sheetHeight = getSheetHeight(sheetData.data, sheetData.information);

      // Debug code
      console.log("Width: " + sheetWidth);
      console.log("Height: " + sheetHeight);

      var sheet = workbook.createSheet(sheetName, sheetWidth, sheetHeight);
      var center = Math.floor(sheetWidth / 2);
      var y = 1;

      // Set the width of columns in use
      var longestTableWidth = getLongestWidth(sheetData.data);
      //console.log("Longest: " + longestTableWidth);
      var startIndex = Math.floor((sheetWidth - 2 * TABLE_MARGIN) / 2 - longestTableWidth / 2);
      for (var i = 1; i <= longestTableWidth; i++) {
        //console.log("Set column length for " + (i + TABLE_MARGIN + startIndex));
        sheet.width(i + TABLE_MARGIN + startIndex, 20);
      }

      // Debug code
      console.log("center: " + center);
      console.log("y: " + y);

      // Set the title of the sheet
      sheet.set(center, y, sheetData.name);
      sheet.border(center, y, {bottom: "thick"});
      sheet.font(center, y, {bold: "true"});
      y += 2;

      // Set information, if applicable
      var info = sheetData.information; 
      if (info) {
        _(info).forEach(function(infoEntry, infoTitle) {

          // Set information title
          sheet.set(center - 1, y, infoTitle);
          sheet.border(center - 1, y, {bottom: "thin", left: "thin", top: "thin", right: "thin"});

          // Set sheet information
          sheet.set(center, y, infoEntry);
          sheet.border(center, y, {bottom: "thin", right: "thin", top: "thin"});
          y++;
        })
      }

      // Padding before first table
      y += 3;
      
      // Draw each table
      var tables = sheetData.data;  
      var numTables = tables.length;
      for (var tableIndex = 0; tableIndex < numTables; tableIndex++) {
        
        var table = tables[tableIndex];
        var startIndex = Math.floor((sheetWidth - 2 * TABLE_MARGIN) / 2 - table.length / 2);

        // Write the title of the table
        sheet.set(startIndex + TABLE_MARGIN, y, table.title);
        sheet.border(startIndex + TABLE_MARGIN, y, {bottom: "medium"})
        y++;

        // Write column labels
        for (var i = 1; i <= table.length; i++) {
          sheet.set(i + TABLE_MARGIN + startIndex, y, table.labels[i - 1]);

          // Set the edge border around the labels
          if (i === 1) {
            sheet.border(i + TABLE_MARGIN + startIndex, y, {left: "thin", top: "thin", bottom: "thin"});
          } else if (i === table.length) {
            sheet.border(i + TABLE_MARGIN + startIndex, y, {right: "thin", top: "thin", bottom: "thin"});
          } else {
            sheet.border(i + TABLE_MARGIN + startIndex, y, {top: "thin", bottom: "thin"});
          }
        }
        y++;

        // Write contents
        for (var i = 0; i < table.entries; i++) {
          var row = table.rows[i];

          // Inner loop: iterate through each data row
          for (var j = 1; j <= row.length; j++) {
            sheet.set(j + TABLE_MARGIN + startIndex, y, row[j - 1]);

            var borderObject = {};
            // If at the edges, set the border for the edge of the sheet
            if (j === 1) {
              borderObject.left = "thin";
            } else if (j === row.length) {
              borderObject.right = "thin";
            }

            // If at the bottom at the table, set the border for the bottom
            if (i === table.entries - 1) {
              borderObject.bottom = "thin";
            }

            sheet.border(j + TABLE_MARGIN + startIndex, y, borderObject);
          }
          y++;
        }

        y += 3;
      }
    });
    
    ReportObject.save = workbook.save.bind(workbook);
    callback(null, ReportObject);
  }

  return xlsreport;
});
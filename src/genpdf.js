/* Pdf report generator */
/* JSPDF api (quick reference) :
 ****************************************
 *  (where doc is an instance of jspdf)
 *  // Text
 *  // Methods can be chained
 * doc.setTextColor(r, g, b)
 * doc.text(x, y, text)
 * doc.addPage()
 * doc.setFont(fontFamily)
 * doc.setFontType(fontType)
 * doc.setFontSize
 *  // Draw
 * doc.setDrawColor(r, g, b)
 * doc.setFillColor(r, g, b)
 * doc.rect(x, y, width, height)
 * doc.setLineWidth(width)
 * doc.line
 *
 * Document objects: 
 * var excelObject = {
    sheet1: {
      name: "Sheet 1", 
      information: {
        generated: new Date(),
        author: "Mike Zhang"
      },
      data: [Table1, Table2, Table3]
    },
    sheet2: {
      name: "Sheet 2",
      data: [Table4, Table5, Table6]
    }
  }
 ****************************************/
define(['jspdf', 'table', 'lodash'], function(jspdf, Table, _) {
  var dim_letter = {x: 612, y: 792};
  var dim_a4 = {x: 595, y: 842};
  var margin = 50;

  // Using standard size: letter
  var orientation = "portrait";
  var type = "letter";
  var size = dim_letter;

  /* Helper functions */
  var drawTitle = function(doc, title, height) {
    var MAX_SIZE = 50;

    // Set the font
    doc.setFont("Helvetica", "Bold");

    // Draw the title
    // Description: starting location is 1/7th the width, text width is 2/3 the width
    var titleStart = Math.ceil(size.x / 7);
    var titleWidth = Math.ceil(size.x * 2 / 3);
    var titleUnitSize = doc.getStringUnitWidth(title, {font: "Helvetica", style: "Bold"});
    var titleSize = titleWidth / titleUnitSize;

    // Readjust the titlesize for too-large cases
    titleSize = titleSize < MAX_SIZE ? titleSize : MAX_SIZE;
    doc.setFontSize(titleSize);
    
    // Calculate the new start height at the end of this operation
    var endHeight = height + 10 + titleSize;

    // Draw the items onto the sheet
    doc.text(titleStart, height + titleSize + 10, title);

    return endHeight;
  };

  var drawInformation = function(doc, information, height) {
    // Set font information
    var FONT_SIZE = 15;
    doc.setFontSize(FONT_SIZE);
    doc.setFont("helvetica", "normal"); // Helvetica normal
    height += 20; // Place a margin before the information and the title

    // The maximum y a page can consume. A padding of margin pts exists at the bottom
    var maximumBottomSize = size.y - margin;
    var infoTabs = Object.keys(information);

    var start = margin;
    var mid = size.x / 2;
    var end = size.x - margin;

    /* Fetch appropriate font size information */
    // By default, we want the smallest possible font size to be 15
    // But if necessary, we make it smaller in the for loop below
    var minSize = 15;
    for (var i = 0; i < infoTabs.length; i++) {
      var heading = infoTabs[i].toString();
      var entry = information[heading].toString();

      /* sizes */
      var headingUnit = doc.getStringUnitWidth(heading, {font: "Helvetica"});
      var entryUnit = doc.getStringUnitWidth(entry, {font: "Helvetica"});

      var headSize = (mid - start) / headingUnit;
      var entrySize = (end - mid) / entryUnit;
      var min = Math.min(headSize, entrySize);

      if (minSize > min) minSize = min;
    }

    // let minSize = the size of the font. Where minSize, defined above, is the smallest font size
    // needed to fit the text within the table
    doc.setFontSize(minSize);
    //console.log("Font size was set to: " + minSize);

    /* Draw information based on fetched font size information */
    for (var i = 0; i < infoTabs.length; i++) {
      if (height >= maximumBottomSize) {
        // New page
        height = margin;
        doc.addPage();
      }
      var heading = infoTabs[i].toString();
      var entry = information[heading].toString();

      // Where to start the heading/entry, from the x direction
      var headingStart = start;
      var entryStart = mid;

      doc.text(headingStart, height + minSize + 5, heading);
      doc.text(entryStart, height + minSize + 5, entry);

      doc.rect(headingStart, height, mid - start, minSize + 10);
      doc.rect(entryStart, height, end - mid, minSize + 10);

      // Increment the height
      height += minSize + 10;
    }

    return height;
  };

  var drawTableSimple = function(doc, table, height) {
    // Buffer from previous thing
    height += 10;

    // Simplest possible table drawing logic
    var tableLength = table.length;
    var start = margin;
    var end = size.x - margin;
    var totalLength = end - start;
    var maximumBottomSize = size.y - margin; // Maximum bottom size

    var title = table.title;
    var labels = table.labels;
    var rows = table.rows;
    var numRows = rows.length;

    var numPartitions = table.length;
    var titleFontSize = 15;
    var tableFontSize = 8; // Make this small (keep this draw simple);
    var rowGap = 5; // Gap between each row
    var titleUnit = doc.getStringUnitWidth(title, {font: "Helvetica", style: "Bold"});
    var calcFontSize = totalLength / titleUnit;

    // Adjust title Font size only if calculated font size is smaller
    titleFontSize = (calcFontSize < titleFontSize) ? calcFontSize : titleFontSize;

    // Set the font
    doc.setFont("Helvetica", "Bold");
    doc.setFontSize(titleFontSize);

    // Attempt to create a new page in the event that a table could get cut off
    var totalTableHeight = titleFontSize + rowGap + (tableFontSize + rowGap) * numRows;
    if (totalTableHeight + height > maximumBottomSize) {
      // If the table is not too large for one page, we create a new page
      if (totalTableHeight < maximumBottomSize) {
        height = margin;
        doc.addPage();
      }
    }

    // Draw the title
    doc.text(size.x / 2 - (titleFontSize * titleUnit) / 2, height + titleFontSize, title);
    height += titleFontSize + rowGap;

    // Get the table partitions (where each section is allowed to draw)
    var partitions = [];
    for (var i = 0; i < numPartitions; i++) {
      var calcSize = totalLength / numPartitions;
      var calcStart = start + calcSize * i;
      var calcEnd = start + calcSize * (i + 1);
      var calcMid = (calcStart + calcEnd) / 2;
      partitions[i] = {
        partSize: calcSize,
        partStart: calcStart,
        partEnd: calcEnd,
        partMid: calcMid
      }

      console.log(partitions[i]);
    }

    // Set the table font size
    doc.setFontSize(tableFontSize);

    // Draw the headings
    for (var part = 0; part < numPartitions; part++) {
      var start = partitions[part].partStart;
      var label = labels[part];
      var labelUnitSize = doc.getStringUnitWidth(label, {font: "Helvetica", style: "Bold"});
      var labelSize = labelUnitSize * tableFontSize;

      doc.text(start, height + tableFontSize, label);
    }

    // Update the height
    height += tableFontSize + rowGap;

    // Set the standard table font
    doc.setFont("helvetica", "normal");
    
    // Draw each row
    for (var i = 0; i < numRows; i++) {
      for (var part = 0; part < numPartitions; part++) {
        var start = partitions[part].partStart;
        var entry = rows[i][part].toString();
        var entryUnitSize = doc.getStringUnitWidth(label, {font: "helvetica"});
        var entrySize = entryUnitSize * tableFontSize;

        doc.text(start, height + tableFontSize, entry);
      }

      height += tableFontSize + rowGap;
      if (height > maximumBottomSize) {
        height = margin;
        doc.addPage();
      }
    }

    return height;
  };

  var drawTables = function(doc, tables, height) {
    var len = tables.length;
    for (var i = 0; i < len; i++) {
      var table = tables[i];
      height = drawTableSimple(doc, table, height);
    }

    return height;
  };

  /* Main client */
  var pdfreport = function(obj, callback) {
    var Result = {};
    var doc = new jspdf(orientation, "pt", type);
    var height = 0;
    // Grab the sheet names
    var sheetNames = Object.keys(obj);

    for (var i = 0; i < sheetNames.length; i++) {
      var curSheet = obj[sheetNames[i]];
      var name = curSheet.name;
      var information = curSheet.information;
      var data = curSheet.data;

      // Draw the title, then update the start height
      height = drawTitle(doc, name, height);

      // After Height
      // console.log("After title height: " + height);

      if (information) {
        height = drawInformation(doc, information, height);
      }
      height = drawTables(doc, data, height);

      // Add a new page only if another sheet exists
      if (i != sheetNames.length - 1) {
        height = 0;
        doc.addPage();
      }
    }

    Result.save = doc.save.bind(doc);
    callback(null, Result);
  };

  return pdfreport;
});






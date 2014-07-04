Reports-generator v0.0.1
========================
A utility for generating well-formatted reports in pdf, excel and html formats.

Usage
=====
``` javascript

// Declare some tables
var tableSchema = [String, Number, Number];
var tableLabels = ["Name", "Wins", "Losses"];
var MyLittleReportTable1 = new Table("My Table Name", tableSchema, tableLabels);
var MyLittleReportTable2 = ...

// Send in a report object
var reportObject = {
  firstSheet: {
    name: "Title of sheet to display",
    information: {
      infoField: "Some info here"
      "Another Info Field": "More info here"
    },
    data: [MyLittleReportTable1, MyLittleReportTale2, ...]
  },
  secondSheet: {
    ...
  },
  ...
};

// Generate a pdf file
PDFReport(reportObject, function callback(err, ReportObject) {
  if (err) console.error("Big trubble!");
  else {
    console.log("Success!");
    ReportObject.save("MyPDFReport");
  }
});

// Similarly for xlsx reports
ExcelReport(reportObject, function callback(err, ReportObject) {
  if (err) console.error("Very bad!");
  else {
    console.log("Success!");
    ReportObject.save("MyExcelReport");
  }
})

```

Browser Compatibility
=====================
This module uses jsPDF and js-xlsx. 
jsPDF requires IE6+ (with shim for IE9 and below), Firefox 3+, Chrome, Safari 3+, Opera and
js-xlsx requires IE6+, FF18+, Chrome 24+

define(["genxl", "genpdf", "table"], function(xlsreport, pdfreport, table) {
  var exports = {};
  exports.PDFReport = pdfreport;
  exports.ExcelReport = xlsreport;
  exports.Table = table;

  return exports;
});
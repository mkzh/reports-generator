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
 *  // Draw
 * doc.setDrawColor(r, g, b)
 * doc.setFillColor(r, g, b)
 * doc.rect(x, y, width, height)
 * doc.setLineWidth(width)
 * doc.line
 ****************************************/
define(['jspdf', 'table', 'lodash'], function(jspdf, Table, _) {
  var pdfreport = function(obj, callback) {
    var Result = {};
    var doc = new jspdf();

    var coord = {x: 0, y: 0};
    // Grab the sheet names
    var sheetNames = Object.keys(obj);

    for (var i = 0; i < sheetNames.length; i++) {
      var curSheet = obj[sheetNames[i]];
    }
  }

  return pdfreport;
});
// xlwrapper: define a wrapper for xlsx javascript
// a wrapper around @chuanyi's msexcelbuilder with 
// additional numerical formatting features
// Author: Mike Zhang 
define(['xlsx', 'filesaver'], function(xlsx, saveAs) {
  var wrapper = {};

  /* Helper functions */
  /* ========================================================================== */
  /* Convert a given date to the associated excel value. Ripped from xlsx-js example:
   * view-source:http://sheetjs.com/demos/writexlsx.html                        */
  function datenum(v, date1904) {
    if(date1904) v+=1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
  };

  /* Constructors */
  /* ========================================================================== */
  var Workbook = function() {
    this.SheetNames = [];
    this.Sheets = {};
  };

  var Sheet = function(sheet_name, column_count, row_count) {
    var range = {s: {c: 0, r: 0}, e: {c: column_count, r: row_count} };
    
    

    this.sheet_name = sheet_name;
    this['!ref'] = xlsx.utils.encode_range(range);
    this.column_count = column_count;
    this.row_count = row_count;

    this['!cols'] = [];
    for (var i = 0; i < column_count; i++) {
      this['!cols'][i] = {wch: 8.48};
    }
  };

  /* Class method definitions */
  /* ========================================================================== */


  /* Workbook methods */
  // Alias for workbook constructor
  wrapper.createWorkbook = function() {
    return new Workbook();
  }

  /* Create a new sheet */
  Workbook.prototype.createSheet = function(sheet_name, column_count, row_count) {
    var sheet = new Sheet(sheet_name, column_count, row_count);
    this.Sheets[sheet_name] = sheet;
    this.SheetNames[this.SheetNames.length] = sheet_name;

    return sheet;
  };

  /* Cancel the current workbook: delete all data */
  Workbook.prototype.cancel = function() {
    this.SheetNames = [];
    this.Sheets = {};
  };

  /* Save the current workbook */
  Workbook.prototype.save = function(file_name) {
    
    var wopts = { bookType: 'xlsx', bookSST: true, type: 'binary' };
    var wbout = xlsx.write(this, wopts);

    /* Ripped from js-xlsx examples */
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }

    // Add extension if necessary
    var ext = file_name.substring(file_name.length - 5);
    if (ext !== ".xlsx") {
      file_name += ".xlsx";
    }

    saveAs(new Blob([s2ab(wbout)], {type: ""}), file_name);
  }; 

  /* Sheet methods */
  Sheet.prototype.set = function(col, row, val) {
    var coor = xlsx.utils.encode_cell({c: col, r: row});
    var cell = {v: val};

    if (cell.v == null) {
      
      return;
    }

    if (typeof cell.v === 'number') cell.t = 'n';
    else if (typeof cell.v === 'boolean') cell.t = 'b';
    else if (cell.v instanceof Date) {
      cell.t = 'n';
      cell.z = xlsx.SSF._table[14];
      cell.v = datenum(cell.v);
    } else cell.t = 's';

    this[coor] = cell;
  };

  Sheet.prototype.border = function(col, row, value) {
    // To be implemented
  };

  Sheet.prototype.font = function(col, row, value) {
    // To be implemented
  };

  Sheet.prototype.width = function(col, width) {
    this['!cols'][col].wch = width;
  }

  Sheet.prototype.makeTrippy = function(col, row) {
    var coor = xlsx.utils.encode_cell({c: col, r: row});
    this[coor].s = {
      numFmtId: 0,
      fontId: '5',
      fillId: 0,
      borderId: '1',
      xfId: '0',
      applyFont: '1',
      applyBorder: '1'
    }
  };

  return wrapper;

});








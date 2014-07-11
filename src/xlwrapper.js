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
  var Workbook = function(file_name) {
    this.file_name = file_name;
    this.SheetNames = [];
    this.Sheets = {};
  };

  var Sheet = function(sheet_name, column_count, row_count) {
    var range = {s: {c: 0, r: 0}, e: {c: column_count, r: row_count} };
    console.log(range);
    console.log(xlsx.utils.encode_range(range));

    this.sheet_name = sheet_name;
    this['!ref'] = xlsx.utils.encode_range(range);
    this.column_count = column_count;
    this.row_count = row_count;
  };

  /* Class method definitions */
  /* ========================================================================== */


  /* Workbook methods */
  // Alias for workbook constructor
  wrapper.createWorkbook = function(file_name) {
    return new Workbook(file_name);
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
  Workbook.prototype.save = function(callback) {
    console.log(this);
    var wopts = { bookType: 'xlsx', bookSST: true, type: 'binary' };
    var wbout = xlsx.write(this, wopts);

    /* Ripped from js-xlsx examples */
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }

    saveAs(new Blob([s2ab(wbout)], {type: ""}), this.file_name);
  }; 

  /* Sheet methods */
  Sheet.prototype.set = function(col, row, val) {
    var coor = xlsx.utils.encode_cell({c: col, r: row});
    var cell = {v: val};

    if (cell.v == null) {
      console.error("Attempting to write a null value, not doing anything");
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








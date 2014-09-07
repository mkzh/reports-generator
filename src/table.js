// Table: a standard data structure for reports generation
// Define the table module
define(['lodash'], function(_) {
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
  };

  /* 
   * Calculate set width of excel sheet
   */
  var getSheetWidth = function(tables) {
    var PADDING = 10;
    var largestSize = getLongestWidth(tables);

    return largestSize + PADDING;
  };

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
  };

  /* Table object definition */
  var Table = function(title, schema, labels) {
    // Entries in the table
    if (schema.length != labels.length) {
      throw new Error("Table: schema and label array must be the same length");
    }

    // Check if the schema is valid: that is, it only contains one of the four valid schema types
    var validSchemaEntries = [Number, String, Date, Boolean];
    _.forEach(schema, function(schemaEntry) {
      var index = _.indexOf(validSchemaEntries, schemaEntry);
      if (index > -1) return true;
      throw new Error("Table: unrecognized schema type " + schemaEntry + " in schema declaration");
    });
    
    // Schema can consist of "number", "string", "date", "boolean"
    this.title = title;
    this.schema = schema;
    this.labels = labels;
    this.length = schema.length;
    this.entries = 0;
    this.rows = [];
  };

  /*
   * Alternative initialization scheme for table: duplicate an already existing table object
   */
  Table.initializeFromTable = function(other) {
    var schema = other.schema;
    var title = other.title;
    var labels = other.labels;
    var rows = other.rows;

    var table = new Table(title, schema, labels);
    table.pushRows(rows);

    return table;
  }

  /*
   * Add multiple rows of elements to a table
   */
  Table.prototype.pushRows = function(rows) {
    for (var i = 0; i < rows.length; i++) {
      this.pushRow(rows[i]);
    }
  }

  /*
   * Add a row of elements to a table. 
   */
  Table.prototype.pushRow = function(row) {
    if (row.length != this.length) throw new Error("Table: Length mismatch");
    
    for (var i = 0; i < row.length; i++) {
      var type = this.schema[i];

      // Check if each row matches the schema type declared
      if (type === Number) {
        if (!_.isNumber(row[i])) {
          throw new Error("Table: incorrect entry type at index " + i);
        }
      } else if (type === String) {
        if (!_.isString(row[i])) {
          throw new Error("Table: incorrect entry type at index " + i);
        }
      } else if (type === Date) {
        if (!_.isDate(row[i])) {
          throw new Error("Table: incorrect entry type at index " + i);
        }
      } else if (type === Boolean) {
        if (!_.isBoolean(row[i])) {
          throw new Error("Table: incorrect entry type at index " + i);
        }
      }
    }

    this.rows.push(row);
    this.entries++;
  }

    /*
   * Add a row of elements to the table where the row is an object
   */
  Table.prototype.pushObjectRow = function(rowValues) {
    var keys = Object.keys(rowValues);
    var arr = [];
    for (var i = 0; i < keys.length; i++) {
      // Push the next value into the array
      arr[i] = rowValues[keys[i]];
    }

    // Debug code
    /*
    
    
    
    */

    this.pushRow(arr);
  }

  /*
   * Get the number of entries in the table
   */
  Table.prototype.getNumEntries = function() {
    return this.entries;
  }

  /*
   * Get the number of columns in the schema
   */
  Table.prototype.getNumColumns = function() {
    return this.length;
  }

  Table.getLongestWidth = getLongestWidth;
  Table.getSheetWidth = getSheetWidth;
  Table.getSheetHeight = getSheetHeight;

  return Table;
})
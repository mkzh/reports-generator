define(["xlwrapper", "jspdf", "lodash"], function(xlsx, jspdf, _) {
  var exports = {};
  var Table = function(title, schema, labels) {
    this.title = title;
    this.schema = schema;
    this.labels = labels;
  };

  exports.Table = Table;
  return exports;
});
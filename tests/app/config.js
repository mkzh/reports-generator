requirejs.config({
  baseUrl: '../src',
  paths: {
    xlsx: "../bower_components/js-xlsx/dist/xlsx.core.min",
    jspdf: "../bower_components/jspdf/dist/jspdf.min",
    lodash: "../bower_components/lodash/dist/lodash.min",
    app: "../tests/app"
  },
  shim: {
    xlsx: {
      exports: 'XLSX'
    },
    jspdf: {
      exports: 'jsPDF'
    },
    lodash: {
      exports: '_'
    }
  }
});
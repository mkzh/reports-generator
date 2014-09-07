{
  baseUrl: '../src',
  name: "main",
  out: "../dist/compiled-generator.min.js",
  /*dir: "../dist", */
  paths: {
    xlsx: "../bower_components/js-xlsx/dist/xlsx.core.min",
    jspdf: "../bower_components/jspdf/dist/jspdf.min",
    lodash: "../bower_components/lodash/dist/lodash.min",
    filesaver: "../bower_components/FileSaver.js/FileSaver"
    /*app: "../tests/app"*/
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
    },
    filesaver: {
      exports: 'saveAs'
    }
  }
}

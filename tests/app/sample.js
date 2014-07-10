require(['../dist/reports-generator.amd.min.js', 'xlwrapper'], function(ReportsGenerator, xlwrapper) {
  console.log(xlwrapper);

  var xls = xlwrapper.createWorkbook("test2.xlsx");
  var sheet1 = xls.createSheet("My Sheet", 10, 10);
  var sheet2 = xls.createSheet("My Other Sheet", 20, 10);

  sheet1.set(1, 3, "This is string");
  sheet1.set(2, 3, 5);
  sheet1.set(3, 3, new Date());
  sheet1.set(4, 3, true);

  xls.save();
});
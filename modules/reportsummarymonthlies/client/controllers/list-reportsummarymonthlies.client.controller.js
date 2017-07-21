(function () {
  'use strict';

  angular
    .module('reportsummarymonthlies')
    .controller('ReportsummarymonthliesListController', ReportsummarymonthliesListController);

  ReportsummarymonthliesListController.$inject = ['ReportSummaryMonthlyService', 'EmployeeprofilesService'];

  function ReportsummarymonthliesListController(ReportSummaryMonthlyService, EmployeeprofilesService) {
    var vm = this;
    vm.employeeprofiles = EmployeeprofilesService.query();
    vm.companyId = localStorage.getItem('companyId');
    // vm.reportsummarymonthlies = ReportSummaryMonthlyService.query();
    vm.selectemployee = {};
    vm.startDate = new Date();
    vm.endDate = new Date();
    vm.reportData = null;
    vm.startCall = false;
    vm.searchReport = searchReport;
    vm.selected = selected;
    vm.getDay = getDay;
    vm.days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

    function searchReport(startDate, endDate) {
      vm.reportData = null;

      var date_start = new Date(startDate).getDate();
      var month_start = new Date(startDate).getMonth() + 1;
      var year_start = new Date(startDate).getFullYear();
      var inputDateStart = year_start + "-" + ((month_start) < 10 ? "0" + month_start : month_start) + "-" + (date_start < 10 ? "0" + date_start : date_start);

      var date_end = new Date(endDate).getDate();
      var month_end = new Date(endDate).getMonth() + 1;
      var year_end = new Date(endDate).getFullYear();
      var inputDateEnd = year_end + "-" + ((month_end) < 10 ? "0" + month_end : month_end) + "-" + (date_end < 10 ? "0" + date_end : date_end);

      vm.inputDateStart = inputDateStart;
      vm.inputDateEnd = inputDateEnd;

      ReportSummaryMonthlyService.getReportSummaryMonthlies(vm.companyId,inputDateStart,inputDateEnd).then(function (report) {
        vm.report = report;
        vm.startCall = false;
      }, function (error) {
        vm.startCall = true;
      });
    }

    function getDay(day) {
      return vm.days[day];
    }

    function selected(item) {
      if (item) {
        vm._id = item._id;
      }
    }
  }
}());

(function() {
    'use strict';

    angular
        .module('reportmonthlies')
        .controller('ReportmonthliesListController', ReportmonthliesListController);

    ReportmonthliesListController.$inject = ['ReportmonthlyService', 'EmployeeprofilesService'];

    function ReportmonthliesListController(ReportmonthlyService, EmployeeprofilesService) {
        var vm = this;
        // vm.reportmonthlies = ReportmonthliesService.query();
        vm.employeeprofiles = EmployeeprofilesService.query();
        vm.selectemployee = {};
        vm.reportDate = new Date();
        vm.reportData = null;
        vm.startCall = false;
        vm.searchReport = searchReport;
        vm.selected = selected;
        vm.getDay = getDay;
        vm.days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

        function searchReport(reportDate) {
            vm.reportData = null;
            var date = new Date(reportDate).getDate();
            var month = new Date(reportDate).getMonth() + 1;
            var year = new Date(reportDate).getFullYear();
            var inputDate = year + "-" + ((month) < 10 ? "0" + month : month) + "-" + (date < 10 ? "0" + date : date);
            console.warn(inputDate);
            if (vm._id) {
                ReportmonthlyService.getReportMonthlies(inputDate, vm._id).then(function(report) {
                    console.log(report);
                    vm.reportData = report;
                    if (vm.reportData.data.length) {
                        vm.startCall = false;
                    } else {
                        vm.startCall = true;
                    }
                }, function(error) {
                    console.error(error);
                    vm.startCall = true;
                });
            }
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

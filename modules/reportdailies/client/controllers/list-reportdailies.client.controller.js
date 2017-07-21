(function () {
    'use strict';

    angular
        .module('reportdailies')
        .controller('ReportdailiesListController', ReportdailiesListController);

    ReportdailiesListController.$inject = ['ReportdailiesDayService'];

    function ReportdailiesListController(ReportdailiesDayService) {
        var vm = this;
        vm.reportDate = new Date();
        vm.searchReport = searchReport;
        // vm.reportdailies = ReportdailiesService.query();
        vm.reportData = null;
        vm.startCall = false;

        function searchReport(reportDate) {
            vm.reportData = null;
            var date = new Date(reportDate).getDate();
            var month = new Date(reportDate).getMonth() + 1;
            var year = new Date(reportDate).getFullYear();
            var inputDate = year + "-" + ((month) < 10 ? "0" + month : month) + "-" + (date < 10 ? "0" + date : date);
            console.warn(inputDate);
            ReportdailiesDayService.getReportDailies(inputDate).then(function (report) {
                console.log(report);
                vm.reportData = report;
                if (vm.reportData.data.length) {
                    vm.startCall = false;
                } else {
                    vm.startCall = true;
                }
            }, function (error) {
                console.error(error);
                vm.startCall = true;
            });
        }
    }
}());

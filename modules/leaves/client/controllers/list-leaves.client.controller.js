(function () {
  'use strict';

  angular
    .module('leaves')
    .controller('LeavesListController', LeavesListController);

  LeavesListController.$inject = ['$scope','LeavesService', '$http'];

  function LeavesListController($scope, LeavesService, $http) {
    var vm = this;

    vm.leaves = LeavesService.query();
    vm.searchLeave = searchLeave;
    vm.disableDate = disableDate;
    $scope.startDate = new Date();
    $scope.endDate = new Date();
    
    function searchLeave(startDate, endDate, leaveType) {
      if (leaveType === 'All') {
        vm.leaves = LeavesService.query();
      } else {
        $http.post('/api/getLeaveByLeaveTypeAndDate', { leaveType: leaveType, startDate: startDate, endDate: endDate }).success(function (leaves) {
          vm.leaves = leaves;
        }).error(function (error) {
        });
      }
    }

    function disableDate(leaveType){
      if(leaveType === 'All'){
        $scope.disDate = true;
      }else{
        $scope.disDate = false;        
      }
    }
  }
}());

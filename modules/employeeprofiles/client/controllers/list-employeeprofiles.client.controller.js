(function () {
  'use strict';

  angular
    .module('employeeprofiles')
    .controller('EmployeeprofilesListController', EmployeeprofilesListController);

  EmployeeprofilesListController.$inject = ['EmployeeprofilesService'];

  function EmployeeprofilesListController(EmployeeprofilesService) {
    var vm = this;

    vm.employeeprofiles = EmployeeprofilesService.query();
  }
}());

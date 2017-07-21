(function () {
  'use strict';

  angular
    .module('checkins')
    .controller('CheckinsListController', CheckinsListController);

  CheckinsListController.$inject = ['CheckinsService'];

  function CheckinsListController(CheckinsService) {
    var vm = this;

    vm.checkins = CheckinsService.query();

    
  }
}());

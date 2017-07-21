(function () {
  'use strict';

  angular
    .module('reportmonthlies')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Reportmonthlies',
      state: 'reportmonthlies',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'reportmonthlies', {
      title: 'List Reportmonthlies',
      state: 'reportmonthlies.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'reportmonthlies', {
      title: 'Create Reportmonthly',
      state: 'reportmonthlies.create',
      roles: ['user']
    });
  }
}());

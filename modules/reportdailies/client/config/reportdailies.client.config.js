(function () {
  'use strict';

  angular
    .module('reportdailies')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Reportdailies',
      state: 'reportdailies',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'reportdailies', {
      title: 'List Reportdailies',
      state: 'reportdailies.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'reportdailies', {
      title: 'Create Reportdaily',
      state: 'reportdailies.create',
      roles: ['user']
    });
  }
}());

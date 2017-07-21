(function () {
  'use strict';

  angular
    .module('leaves')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Leaves',
      state: 'leaves',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'leaves', {
      title: 'List Leaves',
      state: 'leaves.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'leaves', {
      title: 'Create Leave',
      state: 'leaves.create',
      roles: ['user']
    });
  }
}());

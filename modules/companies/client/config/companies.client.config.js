(function () {
  'use strict';

  angular
    .module('companies')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Companies',
      state: 'companies',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'companies', {
      title: 'List Companies',
      state: 'companies.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'companies', {
      title: 'Create Company',
      state: 'companies.create',
      roles: ['user']
    });
  }
}());

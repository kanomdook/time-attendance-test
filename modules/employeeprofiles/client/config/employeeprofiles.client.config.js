(function () {
  'use strict';

  angular
    .module('employeeprofiles')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Employeeprofiles',
      state: 'employeeprofiles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'employeeprofiles', {
      title: 'List Employeeprofiles',
      state: 'employeeprofiles.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'employeeprofiles', {
      title: 'Create Employeeprofile',
      state: 'employeeprofiles.create',
      roles: ['user']
    });
  }
}());

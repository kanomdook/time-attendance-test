(function () {
  'use strict';

  angular
    .module('checkins')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Checkins',
      state: 'checkins',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'checkins', {
      title: 'List Checkins',
      state: 'checkins.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'checkins', {
      title: 'Create Checkin',
      state: 'checkins.create',
      roles: ['user']
    });
  }
}());

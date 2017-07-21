(function () {
  'use strict';

  angular
    .module('checkins')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('checkins', {
        abstract: true,
        url: '/checkins',
        template: '<ui-view/>'
      })
      .state('checkins.list', {
        url: '',
        templateUrl: 'modules/checkins/client/views/list-checkins.client.view.html',
        controller: 'CheckinsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Checkins List'
        }
      })
      .state('checkins.create', {
        url: '/create',
        templateUrl: 'modules/checkins/client/views/form-checkin.client.view.html',
        controller: 'CheckinsController',
        controllerAs: 'vm',
        resolve: {
          checkinResolve: newCheckin
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Checkins Create'
        }
      })
      .state('checkins.edit', {
        url: '/:checkinId/edit',
        templateUrl: 'modules/checkins/client/views/form-checkin.client.view.html',
        controller: 'CheckinsController',
        controllerAs: 'vm',
        resolve: {
          checkinResolve: getCheckin
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Checkin {{ checkinResolve.name }}'
        }
      })
      .state('checkins.view', {
        url: '/:checkinId',
        templateUrl: 'modules/checkins/client/views/view-checkin.client.view.html',
        controller: 'CheckinsController',
        controllerAs: 'vm',
        resolve: {
          checkinResolve: getCheckin
        },
        data: {
          pageTitle: 'Checkin {{ checkinResolve.name }}'
        }
      });
  }

  getCheckin.$inject = ['$stateParams', 'CheckinsService'];

  function getCheckin($stateParams, CheckinsService) {
    return CheckinsService.get({
      checkinId: $stateParams.checkinId
    }).$promise;
  }

  newCheckin.$inject = ['CheckinsService'];

  function newCheckin(CheckinsService) {
    return new CheckinsService();
  }
}());

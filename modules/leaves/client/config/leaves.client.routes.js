(function () {
  'use strict';

  angular
    .module('leaves')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('leaves', {
        abstract: true,
        url: '/leaves',
        template: '<ui-view/>'
      })
      .state('leaves.list', {
        url: '',
        templateUrl: 'modules/leaves/client/views/list-leaves.client.view.html',
        controller: 'LeavesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Leaves List'
        }
      })
      .state('leaves.create', {
        url: '/create',
        templateUrl: 'modules/leaves/client/views/form-leave.client.view.html',
        controller: 'LeavesController',
        controllerAs: 'vm',
        resolve: {
          leaveResolve: newLeave
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Leaves Create'
        }
      })
      .state('leaves.edit', {
        url: '/:leaveId/edit',
        templateUrl: 'modules/leaves/client/views/form-leave.client.view.html',
        controller: 'LeavesController',
        controllerAs: 'vm',
        resolve: {
          leaveResolve: getLeave
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Leave {{ leaveResolve.name }}'
        }
      })
      .state('leaves.view', {
        url: '/:leaveId',
        templateUrl: 'modules/leaves/client/views/view-leave.client.view.html',
        controller: 'LeavesController',
        controllerAs: 'vm',
        resolve: {
          leaveResolve: getLeave
        },
        data: {
          pageTitle: 'Leave {{ leaveResolve.name }}'
        }
      });
  }

  getLeave.$inject = ['$stateParams', 'LeavesService'];

  function getLeave($stateParams, LeavesService) {
    return LeavesService.get({
      leaveId: $stateParams.leaveId
    }).$promise;
  }

  newLeave.$inject = ['LeavesService'];

  function newLeave(LeavesService) {
    return new LeavesService();
  }
}());

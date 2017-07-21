(function () {
  'use strict';

  angular
    .module('reportsummarymonthlies')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('reportsummarymonthlies', {
        abstract: true,
        url: '/reportsummarymonthlies',
        template: '<ui-view/>'
      })
      .state('reportsummarymonthlies.list', {
        url: '',
        templateUrl: 'modules/reportsummarymonthlies/client/views/list-reportsummarymonthlies.client.view.html',
        controller: 'ReportsummarymonthliesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Reportsummarymonthlies List'
        }
      })
      .state('reportsummarymonthlies.create', {
        url: '/create',
        templateUrl: 'modules/reportsummarymonthlies/client/views/form-reportsummarymonthly.client.view.html',
        controller: 'ReportsummarymonthliesController',
        controllerAs: 'vm',
        resolve: {
          reportsummarymonthlyResolve: newReportsummarymonthly
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Reportsummarymonthlies Create'
        }
      })
      .state('reportsummarymonthlies.edit', {
        url: '/:reportsummarymonthlyId/edit',
        templateUrl: 'modules/reportsummarymonthlies/client/views/form-reportsummarymonthly.client.view.html',
        controller: 'ReportsummarymonthliesController',
        controllerAs: 'vm',
        resolve: {
          reportsummarymonthlyResolve: getReportsummarymonthly
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Reportsummarymonthly {{ reportsummarymonthlyResolve.name }}'
        }
      })
      .state('reportsummarymonthlies.view', {
        url: '/:reportsummarymonthlyId',
        templateUrl: 'modules/reportsummarymonthlies/client/views/view-reportsummarymonthly.client.view.html',
        controller: 'ReportsummarymonthliesController',
        controllerAs: 'vm',
        resolve: {
          reportsummarymonthlyResolve: getReportsummarymonthly
        },
        data: {
          pageTitle: 'Reportsummarymonthly {{ reportsummarymonthlyResolve.name }}'
        }
      });
  }

  getReportsummarymonthly.$inject = ['$stateParams', 'ReportsummarymonthliesService'];

  function getReportsummarymonthly($stateParams, ReportsummarymonthliesService) {
    return ReportsummarymonthliesService.get({
      reportsummarymonthlyId: $stateParams.reportsummarymonthlyId
    }).$promise;
  }

  newReportsummarymonthly.$inject = ['ReportsummarymonthliesService'];

  function newReportsummarymonthly(ReportsummarymonthliesService) {
    return new ReportsummarymonthliesService();
  }
}());

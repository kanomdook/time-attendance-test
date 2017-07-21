(function () {
  'use strict';

  angular
    .module('reportmonthlies')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('reportmonthlies', {
        abstract: true,
        url: '/reportmonthlies',
        template: '<ui-view/>'
      })
      .state('reportmonthlies.list', {
        url: '',
        templateUrl: 'modules/reportmonthlies/client/views/list-reportmonthlies.client.view.html',
        controller: 'ReportmonthliesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Reportmonthlies List'
        }
      })
      .state('reportmonthlies.create', {
        url: '/create',
        templateUrl: 'modules/reportmonthlies/client/views/form-reportmonthly.client.view.html',
        controller: 'ReportmonthliesController',
        controllerAs: 'vm',
        resolve: {
          reportmonthlyResolve: newReportmonthly
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Reportmonthlies Create'
        }
      })
      .state('reportmonthlies.edit', {
        url: '/:reportmonthlyId/edit',
        templateUrl: 'modules/reportmonthlies/client/views/form-reportmonthly.client.view.html',
        controller: 'ReportmonthliesController',
        controllerAs: 'vm',
        resolve: {
          reportmonthlyResolve: getReportmonthly
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Reportmonthly {{ reportmonthlyResolve.name }}'
        }
      })
      .state('reportmonthlies.view', {
        url: '/:reportmonthlyId',
        templateUrl: 'modules/reportmonthlies/client/views/view-reportmonthly.client.view.html',
        controller: 'ReportmonthliesController',
        controllerAs: 'vm',
        resolve: {
          reportmonthlyResolve: getReportmonthly
        },
        data: {
          pageTitle: 'Reportmonthly {{ reportmonthlyResolve.name }}'
        }
      });
  }

  getReportmonthly.$inject = ['$stateParams', 'ReportmonthliesService'];

  function getReportmonthly($stateParams, ReportmonthliesService) {
    return ReportmonthliesService.get({
      reportmonthlyId: $stateParams.reportmonthlyId
    }).$promise;
  }

  newReportmonthly.$inject = ['ReportmonthliesService'];

  function newReportmonthly(ReportmonthliesService) {
    return new ReportmonthliesService();
  }
}());

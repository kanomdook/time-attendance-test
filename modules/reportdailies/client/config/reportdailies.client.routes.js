(function () {
  'use strict';

  angular
    .module('reportdailies')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('reportdailies', {
        abstract: true,
        url: '/reportdailies',
        template: '<ui-view/>'
      })
      .state('reportdailies.list', {
        url: '',
        templateUrl: 'modules/reportdailies/client/views/list-reportdailies.client.view.html',
        controller: 'ReportdailiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Reportdailies List'
        }
      })
      .state('reportdailies.create', {
        url: '/create',
        templateUrl: 'modules/reportdailies/client/views/form-reportdaily.client.view.html',
        controller: 'ReportdailiesController',
        controllerAs: 'vm',
        resolve: {
          reportdailyResolve: newReportdaily
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Reportdailies Create'
        }
      })
      .state('reportdailies.edit', {
        url: '/:reportdailyId/edit',
        templateUrl: 'modules/reportdailies/client/views/form-reportdaily.client.view.html',
        controller: 'ReportdailiesController',
        controllerAs: 'vm',
        resolve: {
          reportdailyResolve: getReportdaily
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Reportdaily {{ reportdailyResolve.name }}'
        }
      })
      .state('reportdailies.view', {
        url: '/:reportdailyId',
        templateUrl: 'modules/reportdailies/client/views/view-reportdaily.client.view.html',
        controller: 'ReportdailiesController',
        controllerAs: 'vm',
        resolve: {
          reportdailyResolve: getReportdaily
        },
        data: {
          pageTitle: 'Reportdaily {{ reportdailyResolve.name }}'
        }
      });
  }

  getReportdaily.$inject = ['$stateParams', 'ReportdailiesService'];

  function getReportdaily($stateParams, ReportdailiesService) {
    return ReportdailiesService.get({
      reportdailyId: $stateParams.reportdailyId
    }).$promise;
  }

  newReportdaily.$inject = ['ReportdailiesService'];

  function newReportdaily(ReportdailiesService) {
    return new ReportdailiesService();
  }
}());

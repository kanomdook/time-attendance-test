(function () {
  'use strict';

  angular
    .module('employeeprofiles')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('employeeprofiles', {
        abstract: true,
        url: '/employeeprofiles',
        template: '<ui-view/>'
      })
      .state('employeeprofiles.list', {
        url: '',
        templateUrl: 'modules/employeeprofiles/client/views/list-employeeprofiles.client.view.html',
        controller: 'EmployeeprofilesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Employeeprofiles List'
        }
      })
      .state('employeeprofiles.create', {
        url: '/create',
        templateUrl: 'modules/employeeprofiles/client/views/form-employeeprofile.client.view.html',
        controller: 'EmployeeprofilesController',
        controllerAs: 'vm',
        resolve: {
          employeeprofileResolve: newEmployeeprofile
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Employeeprofiles Create'
        }
      })
      .state('employeeprofiles.edit', {
        url: '/:employeeprofileId/edit',
        templateUrl: 'modules/employeeprofiles/client/views/form-employeeprofile.client.view.html',
        controller: 'EmployeeprofilesController',
        controllerAs: 'vm',
        resolve: {
          employeeprofileResolve: getEmployeeprofile
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Employeeprofile {{ employeeprofileResolve.name }}'
        }
      })
      .state('employeeprofiles.view', {
        url: '/:employeeprofileId',
        templateUrl: 'modules/employeeprofiles/client/views/view-employeeprofile.client.view.html',
        controller: 'EmployeeprofilesController',
        controllerAs: 'vm',
        resolve: {
          employeeprofileResolve: getEmployeeprofile
        },
        data: {
          pageTitle: 'Employeeprofile {{ employeeprofileResolve.name }}'
        }
      });
  }

  getEmployeeprofile.$inject = ['$stateParams', 'EmployeeprofilesService'];

  function getEmployeeprofile($stateParams, EmployeeprofilesService) {
    return EmployeeprofilesService.get({
      employeeprofileId: $stateParams.employeeprofileId
    }).$promise;
  }

  newEmployeeprofile.$inject = ['EmployeeprofilesService'];

  function newEmployeeprofile(EmployeeprofilesService) {
    return new EmployeeprofilesService();
  }
}());

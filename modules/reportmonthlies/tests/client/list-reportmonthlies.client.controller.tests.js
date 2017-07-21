(function () {
  'use strict';

  describe('Reportmonthlies List Controller Tests', function () {
    // Initialize global variables
    var ReportmonthliesListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ReportmonthliesService,
      mockReportmonthly;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ReportmonthliesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ReportmonthliesService = _ReportmonthliesService_;

      // create mock article
      mockReportmonthly = new ReportmonthliesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Reportmonthly Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Reportmonthlies List controller.
      ReportmonthliesListController = $controller('ReportmonthliesListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockReportmonthlyList;

      beforeEach(function () {
        mockReportmonthlyList = [mockReportmonthly, mockReportmonthly];
      });

      it('should send a GET request and return all Reportmonthlies', inject(function (ReportmonthliesService) {
        // Set POST response
        $httpBackend.expectGET('api/reportmonthlies').respond(mockReportmonthlyList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.reportmonthlies.length).toEqual(2);
        expect($scope.vm.reportmonthlies[0]).toEqual(mockReportmonthly);
        expect($scope.vm.reportmonthlies[1]).toEqual(mockReportmonthly);

      }));
    });
  });
}());

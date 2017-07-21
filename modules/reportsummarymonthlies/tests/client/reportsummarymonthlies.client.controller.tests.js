(function () {
  'use strict';

  describe('Reportsummarymonthlies Controller Tests', function () {
    // Initialize global variables
    var ReportsummarymonthliesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ReportsummarymonthliesService,
      mockReportsummarymonthly;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ReportsummarymonthliesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ReportsummarymonthliesService = _ReportsummarymonthliesService_;

      // create mock Reportsummarymonthly
      mockReportsummarymonthly = new ReportsummarymonthliesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Reportsummarymonthly Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Reportsummarymonthlies controller.
      ReportsummarymonthliesController = $controller('ReportsummarymonthliesController as vm', {
        $scope: $scope,
        reportsummarymonthlyResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleReportsummarymonthlyPostData;

      beforeEach(function () {
        // Create a sample Reportsummarymonthly object
        sampleReportsummarymonthlyPostData = new ReportsummarymonthliesService({
          name: 'Reportsummarymonthly Name'
        });

        $scope.vm.reportsummarymonthly = sampleReportsummarymonthlyPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ReportsummarymonthliesService) {
        // Set POST response
        $httpBackend.expectPOST('api/reportsummarymonthlies', sampleReportsummarymonthlyPostData).respond(mockReportsummarymonthly);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Reportsummarymonthly was created
        expect($state.go).toHaveBeenCalledWith('reportsummarymonthlies.view', {
          reportsummarymonthlyId: mockReportsummarymonthly._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/reportsummarymonthlies', sampleReportsummarymonthlyPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Reportsummarymonthly in $scope
        $scope.vm.reportsummarymonthly = mockReportsummarymonthly;
      });

      it('should update a valid Reportsummarymonthly', inject(function (ReportsummarymonthliesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/reportsummarymonthlies\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('reportsummarymonthlies.view', {
          reportsummarymonthlyId: mockReportsummarymonthly._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (ReportsummarymonthliesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/reportsummarymonthlies\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Reportsummarymonthlies
        $scope.vm.reportsummarymonthly = mockReportsummarymonthly;
      });

      it('should delete the Reportsummarymonthly and redirect to Reportsummarymonthlies', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/reportsummarymonthlies\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('reportsummarymonthlies.list');
      });

      it('should should not delete the Reportsummarymonthly and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());

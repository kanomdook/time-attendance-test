(function () {
  'use strict';

  describe('Reportmonthlies Route Tests', function () {
    // Initialize global variables
    var $scope,
      ReportmonthliesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ReportmonthliesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ReportmonthliesService = _ReportmonthliesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('reportmonthlies');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/reportmonthlies');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ReportmonthliesController,
          mockReportmonthly;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('reportmonthlies.view');
          $templateCache.put('modules/reportmonthlies/client/views/view-reportmonthly.client.view.html', '');

          // create mock Reportmonthly
          mockReportmonthly = new ReportmonthliesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Reportmonthly Name'
          });

          // Initialize Controller
          ReportmonthliesController = $controller('ReportmonthliesController as vm', {
            $scope: $scope,
            reportmonthlyResolve: mockReportmonthly
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:reportmonthlyId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.reportmonthlyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            reportmonthlyId: 1
          })).toEqual('/reportmonthlies/1');
        }));

        it('should attach an Reportmonthly to the controller scope', function () {
          expect($scope.vm.reportmonthly._id).toBe(mockReportmonthly._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/reportmonthlies/client/views/view-reportmonthly.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ReportmonthliesController,
          mockReportmonthly;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('reportmonthlies.create');
          $templateCache.put('modules/reportmonthlies/client/views/form-reportmonthly.client.view.html', '');

          // create mock Reportmonthly
          mockReportmonthly = new ReportmonthliesService();

          // Initialize Controller
          ReportmonthliesController = $controller('ReportmonthliesController as vm', {
            $scope: $scope,
            reportmonthlyResolve: mockReportmonthly
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.reportmonthlyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/reportmonthlies/create');
        }));

        it('should attach an Reportmonthly to the controller scope', function () {
          expect($scope.vm.reportmonthly._id).toBe(mockReportmonthly._id);
          expect($scope.vm.reportmonthly._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/reportmonthlies/client/views/form-reportmonthly.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ReportmonthliesController,
          mockReportmonthly;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('reportmonthlies.edit');
          $templateCache.put('modules/reportmonthlies/client/views/form-reportmonthly.client.view.html', '');

          // create mock Reportmonthly
          mockReportmonthly = new ReportmonthliesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Reportmonthly Name'
          });

          // Initialize Controller
          ReportmonthliesController = $controller('ReportmonthliesController as vm', {
            $scope: $scope,
            reportmonthlyResolve: mockReportmonthly
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:reportmonthlyId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.reportmonthlyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            reportmonthlyId: 1
          })).toEqual('/reportmonthlies/1/edit');
        }));

        it('should attach an Reportmonthly to the controller scope', function () {
          expect($scope.vm.reportmonthly._id).toBe(mockReportmonthly._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/reportmonthlies/client/views/form-reportmonthly.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

(function () {
  'use strict';

  describe('Reportdailies Route Tests', function () {
    // Initialize global variables
    var $scope,
      ReportdailiesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ReportdailiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ReportdailiesService = _ReportdailiesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('reportdailies');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/reportdailies');
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
          ReportdailiesController,
          mockReportdaily;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('reportdailies.view');
          $templateCache.put('modules/reportdailies/client/views/view-reportdaily.client.view.html', '');

          // create mock Reportdaily
          mockReportdaily = new ReportdailiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Reportdaily Name'
          });

          // Initialize Controller
          ReportdailiesController = $controller('ReportdailiesController as vm', {
            $scope: $scope,
            reportdailyResolve: mockReportdaily
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:reportdailyId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.reportdailyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            reportdailyId: 1
          })).toEqual('/reportdailies/1');
        }));

        it('should attach an Reportdaily to the controller scope', function () {
          expect($scope.vm.reportdaily._id).toBe(mockReportdaily._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/reportdailies/client/views/view-reportdaily.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ReportdailiesController,
          mockReportdaily;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('reportdailies.create');
          $templateCache.put('modules/reportdailies/client/views/form-reportdaily.client.view.html', '');

          // create mock Reportdaily
          mockReportdaily = new ReportdailiesService();

          // Initialize Controller
          ReportdailiesController = $controller('ReportdailiesController as vm', {
            $scope: $scope,
            reportdailyResolve: mockReportdaily
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.reportdailyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/reportdailies/create');
        }));

        it('should attach an Reportdaily to the controller scope', function () {
          expect($scope.vm.reportdaily._id).toBe(mockReportdaily._id);
          expect($scope.vm.reportdaily._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/reportdailies/client/views/form-reportdaily.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ReportdailiesController,
          mockReportdaily;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('reportdailies.edit');
          $templateCache.put('modules/reportdailies/client/views/form-reportdaily.client.view.html', '');

          // create mock Reportdaily
          mockReportdaily = new ReportdailiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Reportdaily Name'
          });

          // Initialize Controller
          ReportdailiesController = $controller('ReportdailiesController as vm', {
            $scope: $scope,
            reportdailyResolve: mockReportdaily
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:reportdailyId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.reportdailyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            reportdailyId: 1
          })).toEqual('/reportdailies/1/edit');
        }));

        it('should attach an Reportdaily to the controller scope', function () {
          expect($scope.vm.reportdaily._id).toBe(mockReportdaily._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/reportdailies/client/views/form-reportdaily.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

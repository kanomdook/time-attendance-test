(function () {
  'use strict';

  // Companies controller
  angular
    .module('companies')
    .controller('CompaniesController', CompaniesController);

  CompaniesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'companyResolve', 'FileUploader', '$http', '$timeout'];

  function CompaniesController($scope, $state, $window, Authentication, company, FileUploader, $http, $timeout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.company = company;
    localStorage.setItem('companyId', vm.company._id);
    $scope.branchs = vm.company.branchs;
    localStorage.setItem('branchs', JSON.stringify($scope.branchs));
    vm.companyname = JSON.parse(JSON.stringify(vm.company)).name;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.init = init;
    $scope.postcode = null;
    $scope.language = null;

    if (!vm.company._id) {
      vm.company.images = [];
      vm.company.address = {
        country: {
          cca2: "TH",
          cca3: "THA",
          en: {
            common: "Thailand",
            official: "Kingdom of Thailand"
          },
          th: "ราชอาณาจักรไทย",
          currency: "THB"
        }
      };
    }

    $scope.initView = function(){
      $http.get('/api/employee/company',{company:vm.company._id}).success(function (employee) {
        vm.employee = employee;
        vm.emppersen = (vm.employee.length / 25) * 100;
        vm.emppersenStyle = `width:${vm.emppersen}%`;
      }).error(function (error) {
      });

      $http.get('/api/checkin/company').success(function (checkin) {
        vm.checkin = checkin;
        vm.checkinPersen = (vm.checkin.length / 3000) * 100;
        vm.checkinPersenStyle = `width:${vm.checkinPersen}%`;
      }).error(function (error) {
      });

      $http.get('/api/leave/company').success(function (leave) {
        vm.leave = leave.reverse();
        vm.leavePersen = (vm.leave.length / 3000) * 100;
        vm.leavePersenStyle = `width:${vm.leavePersen}%`;
      }).error(function (error) {
      });
    };
    
    function init() {
      $http.get('json/postcode.json').success(function (response) {
        $scope.postcode = response.postcodeData;
      }).error(function (error) {

      });
      $http.get('json/country-language.json').success(function (response) {
        $scope.country = response.countryData;
      }).error(function (error) {

      });
    }
    // Remove existing Company
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.company.$remove($state.go('companies.list'));
      }
    }

    // Save Company
    function save(isValid) {
      $scope.startCall = true;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.companyForm');
        $scope.startCall = false;
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.company._id) {
        vm.company.branchs = $scope.branchs;
        vm.company.$update(successCallback, errorCallback);
      } else {
        vm.company.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('companies.view', {
          companyId: res._id
        });
        $scope.startCall = false;

      }

      function errorCallback(res) {
        vm.error = res.data.message;
        $scope.startCall = false;

      }
    }

    $scope.callback = function (postcode) {
      $scope.checkAutocomplete(postcode);
    };

    $scope.checkAutocomplete = function (postcode) {
      if (postcode) {
        vm.company.address.postcode = postcode.postcode;
        vm.company.address.district = postcode.district;
        vm.company.address.subdistrict = postcode.subdistrict;
        vm.company.address.province = postcode.province;
      } else {
        vm.company.address.district = '';
        vm.company.address.province = '';
        vm.company.address.subdistrict = '';
      }
    };

    // upload images
    $scope.uploader = new FileUploader({
      url: 'api/companies_picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            vm.selectedImage = fileReaderEvent.target.result;
            if (vm.company.images.length === 1) {
              vm.company.images[0].url = vm.selectedImage;
            } else {
              vm.company.images.push({
                public_id: null,
                url: vm.selectedImage
              });
            }
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;
      $scope.status = false;
      // Populate user object
      // $scope.user = Authentication.user = response;
      if (vm.company.images.length === 2) {
        vm.company.images[0].public_id = response.image.public_id;
        vm.company.images[0].url = response.image.url;
      } else {
        vm.company.images.push({
          public_id: response.image.public_id,
          url: response.image.url
        });
      }
      console.log(response);

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      // var index = vm.company.images.url.indexOf(vm.selectedImage);
      var index = vm.company.images.map(function(e) { return e.url; }).indexOf(vm.selectedImage);
      vm.company.images.splice(index, 1);
      $scope.imageURL = "";
    };
    // upload images end

    $scope.addBranch = function (brunch, address, subdistrict, district, province, postcode, country, latitude, longitude) {
            if (brunch && address) {
                $scope.branchs.push({
                    branch: brunch,
                    address: address,
                    subdistrict: subdistrict,
                    district: district,
                    province: province,
                    postcode: postcode,
                    country: country,
                    latitude: latitude,
                    longitude: longitude
                });
            }
        };

        $scope.deleteBrunch = function (brunch) {
            for (var i = 0; i < $scope.branchs.length; i++) {
                if ($scope.branchs[i].branch === brunch) {
                    $scope.branchs.splice(i, 1);
                    break;
                }
            }
        };

  }
}());

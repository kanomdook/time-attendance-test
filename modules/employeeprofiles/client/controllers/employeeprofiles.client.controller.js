(function () {
    'use strict';

    // Employeeprofiles controller
    angular
        .module('employeeprofiles')
        .controller('EmployeeprofilesController', EmployeeprofilesController);

    EmployeeprofilesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'employeeprofileResolve', 'FileUploader', '$timeout', '$http', 'EmployeeService'];

    function EmployeeprofilesController($scope, $state, $window, Authentication, employeeprofile, FileUploader, $timeout, $http, EmployeeService) {
        var vm = this;

        vm.authentication = Authentication;
        vm.employeeprofile = employeeprofile;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        vm.init = init;
        vm.initView = initView;
        vm.updateLeace = updateLeace;
        vm.branchs = JSON.parse(localStorage.getItem('branchs'));
        vm.selectedBranch = {};
        $scope.postcode = null;
        $scope.language = null;

        if(vm.branchs.length > 0){
            vm.employeeprofile.branch = vm.branchs[0].branch;
            vm.selectedBranch = vm.branchs[0];
        }

        $scope.selectBranch = function(){
            for (var i = 0; i < vm.branchs.length; i++) {
                if(vm.branchs[i].branch === vm.employeeprofile.branch){
                    vm.selectedBranch = vm.branchs[i];
                } 
            }
        };

        if (!vm.employeeprofile._id) {
            vm.employeeprofile.address = {
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
        } else {
            if (vm.employeeprofile.shiftin) {
                vm.employeeprofile.shiftin = new Date(vm.employeeprofile.shiftin);
            }

            if (vm.employeeprofile.shiftout) {
                vm.employeeprofile.shiftout = new Date(vm.employeeprofile.shiftout);
            }
        }

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


        // Create file uploader instance
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
                        vm.employeeprofile.image = fileReaderEvent.target.result;
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
            vm.employeeprofile.image = response.image.url;

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
            $scope.imageURL = vm.employeeprofile.image;
        };

        // Remove existing Employeeprofile
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.employeeprofile.$remove($state.go('employeeprofiles.list'));
            }
        }

        // Save Employeeprofile
        function save(isValid) {

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.employeeprofileForm');
                return false;
            }
            // TODO: move create/update logic to service
            if (vm.employeeprofile._id) {
                vm.employeeprofile.branchs = vm.selectedBranch;
                vm.employeeprofile.$update(successCallback, errorCallback);
            } else {
                vm.employeeprofile.branchs = vm.selectedBranch;
                vm.employeeprofile.company = vm.authentication.user.company;
                vm.employeeprofile.leader = null;
                vm.employeeprofile.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('employeeprofiles.view', {
                    employeeprofileId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }

        $scope.callback = function (postcode) {
            $scope.checkAutocomplete(postcode);
        };

        $scope.checkAutocomplete = function (postcode) {
            if (postcode) {
                vm.employeeprofile.address.postcode = postcode.postcode;
                vm.employeeprofile.address.district = postcode.district;
                vm.employeeprofile.address.subdistrict = postcode.subdistrict;
                vm.employeeprofile.address.province = postcode.province;
            } else {
                vm.employeeprofile.address.district = '';
                vm.employeeprofile.address.province = '';
                vm.employeeprofile.address.subdistrict = '';
            }
        };

        function initView() {
            var newDate = new Date().getFullYear() + '' + (new Date().getMonth() + 1);
            EmployeeService.getChenckinByMonth(newDate, vm.employeeprofile._id).then(function (checkins) {
                vm.checkins = checkins;
            }, function (error) {
            });

            EmployeeService.getleaveByUser(vm.employeeprofile._id).then(function (leaves) {
                vm.leaves = leaves;
            }, function (error) {
            });
        }

        function updateLeace(item, status) {
            if ($window.confirm('คุณต้องการ ' + status + '?')) {
                item.approveStatus = status;
                EmployeeService.updateLeaveStatus(item).then(function (leave) {
                    item = leave;
                }, function (error) {
                    console.error(error);
                });
            }
        }
    }
}());

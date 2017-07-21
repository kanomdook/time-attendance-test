'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', 'NgMap', '$uibModal', '$geolocation',
    function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator, NgMap, $uibModal, $geolocation) {
        var map;
        var center;
        $scope.branchs = [];
        $geolocation.getCurrentPosition({
            timeout: 60000,
            enableHighAccuracy: true
        }).then(function (position) {
            // center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        });

        $scope.authentication = Authentication;
        $scope.popoverMsg = PasswordValidator.getPopoverMsg();

        // Get an eventual error defined in the URL query string:
        $scope.error = $location.search().err;

        // If user is signed in then redirect back home
        if ($scope.authentication.user) {
            $location.path('/companies/' + $scope.authentication.user.company);
        }

        $scope.callback = function (postcode) {
            $scope.checkAutocomplete(postcode);
        };

        $scope.checkAutocomplete = function (postcode) {
            if (postcode) {
                $scope.company.address.postcode = postcode.postcode;
                $scope.company.address.district = postcode.district;
                $scope.company.address.subdistrict = postcode.subdistrict;
                $scope.company.address.province = postcode.province;
            } else {
                $scope.company.address.district = '';
                $scope.company.address.province = '';
                $scope.company.address.subdistrict = '';
            }
        };

        $scope.showGoogleMap = function () {
            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'myModalContent.html',
                size: 'lg',
                controller: function ($scope) {
                    NgMap.getMap().then(function (map) {
                        map = map;
                        map.setCenter(center);
                    });
                    $scope.cancel = function () {
                        modal.dismiss('cancel');
                    };
                    $scope.ok = function () {

                    };
                }
            });
        };

        $scope.hideRegisterForm = false;
        $scope.hideCompanyForm = true;

        $scope.init = function () {
            $http.get('json/postcode.json').success(function (response) {
                $scope.postcode = response.postcodeData;
            }).error(function (error) {

            });
            $http.get('json/country-language.json').success(function (response) {
                $scope.country = response.countryData;
                $scope.company = {
                    address: {
                        country: {
                            "cca2": "TH",
                            "cca3": "THA",
                            "en": {
                                "common": "Thailand",
                                "official": "Kingdom of Thailand"
                            },
                            "th": "ราชอาณาจักรไทย",
                            "currency": "THB"
                        }
                    }
                };
            }).error(function (error) {

            });
        };

        $scope.nextStep = function () {
            $scope.hideRegisterForm = true;
            $scope.hideCompanyForm = false;
        };

        $scope.backStep = function () {
            $scope.hideCompanyForm = true;
            $scope.hideRegisterForm = false;
        };

        $scope.createData = function (credentials, company) {
            $http.post('/api/auth/signup', credentials).success(function (user) {
                createCompany(company, user, credentials);
            }).error(function (err) {
                console.error(err);
            });
        };

        function createCompany(company, user, credentials) {
            company.user = user._id;
            company.branchs = $scope.branchs;
            $http.post('/api/companies', company).success(function (comp) {
                updateUser(user, comp._id, credentials);
            }).error(function (err) {
                console.error(err);
            });
        }

        function updateUser(user, comp_id, credentials) {
            user.company = comp_id;
            user.password = credentials.password;
            $http.put('/api/users', user).success(function (res) {
                // $location.path('/companies/' + res.company);
                $window.location.href = '/companies/' + res.company;
            }).error(function (err) {
                console.error(err);
            });
        }

        $scope.signup = function (isValid) {
            $scope.error = null;
            $scope.startCall = true;
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');
                $scope.startCall = false;

                return false;
            }

            $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;
                $scope.startCall = false;
                // And redirect to the previous or home page
                $state.go($state.previous.state.name || 'home', $state.previous.params);
            }).error(function (response) {
                $scope.startCall = false;

                $scope.error = response.message;
            });
        };

        $scope.signin = function (isValid) {
            $scope.error = null;
            $scope.startCall = true;
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');
                $scope.startCall = false;
                return false;
            }

            $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;
                $scope.startCall = false;
                // And redirect to the previous or home page
                // $state.go($state.previous.state.name || 'home', $state.previous.params);
                $window.location.href = '/companies/' + response.company._id;
            }).error(function (response) {
                $scope.startCall = false;
                $scope.error = response.message;
            });
        };

        // OAuth provider request
        $scope.callOauthProvider = function (url) {
            if ($state.previous && $state.previous.href) {
                url += '?redirect_to=' + encodeURIComponent($state.previous.href);
            }

            // Effectively call OAuth authentication route:
            $window.location.href = url;
        };

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
]);

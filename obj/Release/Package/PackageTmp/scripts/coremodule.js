angular.module('modulehelper', [])
    .factory('utilityFactory', function ($http) {
        return {
            getFileList:
                    function () {
                        return $http.get('/listwithangular', { cache: false });
                    }
        }
    })
    .controller('UtilityController', ['$scope', 'utilityFactory', function ($scope, utilityFactory) {
        $scope.init = function () { $scope.getFiles(); }
        $scope.allfiles = {};
        $scope.getFiles = function () {
            utilityFactory.getFileList().then(function (dataResponse) {
                $scope.allfiles = dataResponse.data;
            });
        }
    }
    ]);
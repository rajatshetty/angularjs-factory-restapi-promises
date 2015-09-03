// Declare the main module
var myApp = angular.module('myApp', ['ui.router','ngResource']);

// Initialize the main module
myApp.run(['$rootScope', '$state', function ($rootScope, $state) {
    'use strict';
     
    // Expose $state to scope for convenience
    $rootScope.$state = $state;
    
}]);

// Configure the main module
myApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {

    'use strict';
    
    // Enable CORS
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
    $urlRouterProvider.otherwise('/welcome');
    
    $stateProvider
        .state('partial1', {
            url: '/partial1',
            templateUrl: 'PartialHtmls/partial1.html',
            controller: 'Partial1Ctrl'
        }).state('partial2', {
            url: '/partial2',
            templateUrl: 'PartialHtmls/partial2.html',
            controller: 'Partial2Ctrl'
        }).state('welcome', {
            url: '/welcome',
            templateUrl: 'PartialHtmls/welcome.html',
            controller: 'welcomeCtrl'
        });
}]);






myApp.controller('Partial1Ctrl', ['$scope', 'gistsData', function($scope, gistsData) {

    $scope.message = "Waiting for data...";

    $scope.gists = gistsData; // Bind a scope model directly to the resource

    gistsData.$promise.then(function() {
        $scope.message = '';
    });

}]);



myApp.controller('welcomeCtrl', ['$scope', 'Datafactory','DataReadDelete', function($scope, Datafactory,DataReadDelete) {

    $scope.message = "Waiting for data...";

    Datafactory.query().$promise.then(function(result) {
        $scope.posts=result;
    });


    $scope.getUserInfo=function(id){
        DataReadDelete.get({user:id}).$promise.then(function(result) {
            alert("Body:" + result.body);
        },function(result){
            alert("Failed:"+result);
        });
    }

    $scope.deleteUser=function(id){
        DataReadDelete.delete({user:id}).$promise.then(function(result){
            alert("Deleted the record with ID:"+id);
        },function(result){
           alert("Failed:"+result);
        });
    }


    $scope.addUser=function(){
        var user={name:'SampleName',email:'sample@email.com'};
        DataReadDelete.save(user).$promise.then(function(result){
            alert("Added user sucessfully!!!");
        },function(result){
            alert("Failed adding user");
        });
    }

    $scope.editUser=function(){
        var user={name:'SampleChangedName',email:'samplechange@email.com'};
        DataReadDelete.update({user:101},user).$promise.then(function(result){
            alert("Edited user sucessfully!!!");
        },function(result){
            alert("Failed editing user");
        });
    }

}]);




myApp.factory('Datafactory', ['$resource', function ($resource) {
    'use strict';
    var baseurl="http://jsonplaceholder.typicode.com/posts";

    return $resource(baseurl, null, {
        query:{
          cache:true,
          isArray: true,
          method: "GET"
        }
    });
}]);


myApp.factory('DataReadDelete', ['$resource', function ($resource) {
    'use strict';
    var baseurl="http://jsonplaceholder.typicode.com/posts/:user";

    return $resource(baseurl,{user:'@user'},{
    update:{
        method:'PUT'
    }
    });
}]);
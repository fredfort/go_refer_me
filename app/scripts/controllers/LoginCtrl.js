'use strict';


angular.module('discountdublin')
  .controller('LoginCtrl',['$scope','$state','API','User','Linkedin', function ($scope,$state, API,User, Linkedin) {


    $scope.linkedInLogin = function(){
      Linkedin.authorization().then(function(data){
        $state.go('main.dashboard');
      }).catch(function(data){
        alert('cant connect to linkedin')
      });
    }

  }]);

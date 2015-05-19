'use strict';


angular.module('discountdublin')
  .controller('LoginCtrl',['$scope','$state','API','User','Linkedin', function ($scope,$state, API,User, Linkedin) {


    $scope.linkedInLogin = function(){
      Linkedin.authorization().then(function(data){
            Linkedin.getUserInformation().then(function(user){
                API.createUser(user)
                .then(function(userToken){
                  debugger;
                  User.setUser(userToken);
                  $state.go('main.dashboard');
                }).catch(function(err){
                  alert('User creation error '+err);
                });
            });
      }).catch(function(data){
        alert('cant connect to linkedin')
      });
    }

  }]);

'use strict';


angular.module('discountdublin')
  .controller('LoginCtrl',['$scope','$state','API','User','Linkedin', function ($scope,$state, API,User, Linkedin) {


    $scope.linkedInLogin = function(){
      Linkedin.authorization().then(function(data){
            Linkedin.getUserInformation().then(function(user){
                var linkedinJob = user.positions.values[0];
                var currentJob = {
                  id: linkedinJob.id,
                  company:linkedinJob.company.name,
                  title:linkedinJob.title,
                  summary: linkedinJob.summary
                };
                user.currentJob = currentJob;
                API.createUser(user)
                .then(function(userToken){
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

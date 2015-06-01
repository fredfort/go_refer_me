'use strict';


angular.module('discountdublin')
  .controller('LoginCtrl',['$scope','$rootScope','$state','$modal','API','User','Linkedin', 'md5',
    function ($scope,$rootScope,$state,$modal, API,User, Linkedin, md5) {

    $scope.formValid = true;
    var modalInstance = null;

    $scope.getJob = function(linkedinJob){
      return {
        id: linkedinJob.id,
        company:linkedinJob.company.name,
        title:linkedinJob.title,
        summary: linkedinJob.summary
      };
    };

    $scope.linkedInLogin = function(){
      Linkedin.authorization().then(function(data){
        Linkedin.getUserInformation().then(function(user){
          user.currentJob = $scope.getJob(user.positions.values[0]);
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
    };

    $scope.signUpPopUp = function() {
      $rootScope.modalInstance = $modal.open({
        animation: true,
        size:'md',
        templateUrl: 'views/modal/signin.html',
        controller: 'LoginCtrl'
      });
    };

    $scope.signin = function(){
      $scope.checked = true;
      if($scope.firstName && $scope.lastName && $scope.company  && $scope.title && $scope.emailAddress 
                          && $scope.password && $scope.category && ($scope.password === $scope.password_confirm)){
        $scope.formValid = true;
        var user = {
          firstName: $scope.firstName,
          lastName : $scope.lastName,
          currentJob : {
            company: $scope.company,
            title:   $scope.title,
          }, 
          category     : $scope.category,
          company      : $scope.company,
          title        : $scope.title,
          emailAddress : $scope.emailAddress,
          password     : md5.createHash($scope.password)
        };
        debugger;
        API.createUser(user).then(function(userToken){
            User.setUser(userToken);
            $state.go('main.dashboard');
            $rootScope.modalInstance.close();
          }).catch(function(err){
            alert('User creation error '+err);
          });
      }else{
        $scope.formValid = false;
      }
    };

    $scope.login = function(){
      $scope.checked = true;
      if($scope.emailAddress && $scope.password){
        $scope.formValid = true;
        API.login($scope.emailAddress, md5.createHash($scope.password)).then(function(userToken){
          debugger;
        });
      }else{
        $scope.formValid = false;
      }
    }

  }]);

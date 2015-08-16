'use strict';


angular.module('discountdublin')
  .controller('LoginCtrl',['$scope','$rootScope','$state','$modal','API','User','Linkedin', 'md5','toaster','industries',
    function ($scope,$rootScope,$state,$modal, API,User, Linkedin, md5, toaster, industries) {

    $scope.formValid = true;
    var modalInstance = null;

    $scope.getIndustriesArray = function(){
      var sub_industries = [];
      angular.forEach(industries.getIndustries(), function(value, key) {
        sub_industries = sub_industries.concat(value);
      });
      return sub_industries;
    };


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
      if($scope.firstName && $scope.lastName && $scope.company  && $scope.title && $scope.emailAddress && $scope.industry && $scope.location
                          && $scope.password && $scope.category && ($scope.password === $scope.password_confirm)){
        $scope.formValid = true;
        var user = {
          firstName: $scope.firstName,
          lastName : $scope.lastName,
          currentJob : {
            company: $scope.company,
            title:   $scope.title,
          }, 
          industry     : $scope.industry,
          location     : {name:$scope.location},
          category     : $scope.category,
          company      : $scope.company,
          title        : $scope.title,
          emailAddress : $scope.emailAddress,
          password     : md5.createHash($scope.password)
        };
        API.createUser(user).then(function(userToken){
          $scope.haveAccount=true;   
        }).catch(function(err){
            alert('User creation error '+err);
          });
      }else{
        $scope.formValid = false;
      }
    };

    $scope.login = function(){
      $scope.checked = true;
      $scope.wrongCredential = false;
      if($scope.emailAddress && $scope.password){
        $scope.formValid = true;;
        API.login($scope.emailAddress, md5.createHash($scope.password)).then(function(userToken){
         if(userToken.data && userToken.data.user){//if login successful
            User.setUser(userToken);
            $state.go('main.dashboard');
            $rootScope.modalInstance.close();
         }else{
          $scope.wrongCredential = true;
          $scope.apiMessageError = userToken.data.error;
         }
        })
      }else{
        $scope.formValid = false;
      }
    };

    $scope.reinitPassword = function(){
      API.reinitPassword($scope.emailAddress).then(function(res){
        toaster.pop('success','An email has been sent to '+$scope.emailAddress);
      });
    };
    $scope.industries = $scope.getIndustriesArray();
  }]);

'use strict';

angular.module('discountdublin')
  .controller('MainCtrl',['$scope','$state','Linkedin','User','industries','locations','API',function ($scope,$state, Linkedin, User,industries, locations, API) {

    $scope.getIndustriesArray = function(){
      var sub_industries = [];
      angular.forEach($scope.industries, function(value, key) {
        sub_industries = sub_industries.concat(value);
      });
      return sub_industries;
    };

    $scope.getLocationArray = function(){
      var country = [];
      angular.forEach($scope.locations, function(value, key) {
        country = country.concat(value);
      });
      return country;
    };

  	$scope.logout = function(){
  		User.clear();
  		$state.go('login');
  		Linkedin.logout().catch(function(err){
  			alert('disconnection error');
  		});
  	};

    $scope.notImplemented = function(){
      alert("not implemted yet");
    };

    $scope.saveUserProfile = function(profile){
      return API.updateUser(profile).then(function(){
        User.updateUser(profile);
      }).catch(function(error){
        toaster.pop('error', 'Profile changes could not be saved');
      });
    };
    
    $scope.industries     = industries.getIndustries();
    $scope.sub_industries = $scope.getIndustriesArray();

    $scope.locations      = locations.getLocations();
    $scope.countries        = $scope.getLocationArray();
  }]);

'use strict';

angular.module('discountdublin')
  .controller('MainCtrl',['$scope','$state','$interval','Linkedin','User','industries','locations','functions','languages','API','linkedinProfile',
      function ($scope,$state,$interval, Linkedin, User,industries, locations, functions, languages, API,linkedinProfile) {
1
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

    $scope.getUser = function(){
      API.me().then(function(user){
        $scope.user.invitationsReceived = user.data.invitationsReceived;
      });
    };
    
    $scope.user            = linkedinProfile.data;  
    $scope.industries      = industries.getIndustries();
    $scope.sub_industries  = $scope.getIndustriesArray();

    $scope.locations       = locations.getLocations();
    $scope.countries       = $scope.getLocationArray();

    $scope.functions       = functions.getFunctions();
    $scope.languages       = languages.getLanguages();

    $interval($scope.getUser, 1000 * 30);

  }]);

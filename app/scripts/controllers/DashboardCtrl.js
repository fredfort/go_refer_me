'use strict';

angular.module('discountdublin')
.controller('DashboardCtrl',['$scope','$state','linkedinProfile', 'API','User', function ($scope,$state,linkedinProfile, API,User) { 
	if(!linkedinProfile){
		$state.go('login');//TODO dirty change that
	}
	$scope.linkedinProfile = linkedinProfile;
	if(!$scope.linkedinProfile.search){
		$scope.linkedinProfile.search = { industries:[], locations:[]};
	}
	
	$scope.addIndustry = function(){
		linkedinProfile.search.industries.push($scope.industry);
		$scope.industry = '';
	};

	$scope.addLocation = function(){
		linkedinProfile.search.locations.push($scope.location);
		$scope.location = '';
	};

	$scope.removeIndustry = function(industry){
		linkedinProfile.search.industries = _.without(linkedinProfile.search.industries, industry)
	};

	$scope.removeLocation = function(location){
		linkedinProfile.search.locations = _.without(linkedinProfile.search.locations, location)
	}

	$scope.saveProfile = function(){
		API.updateUser($scope.linkedinProfile).then(function(){
			User.updateUser($scope.linkedinProfile);
		});
	}


}]);


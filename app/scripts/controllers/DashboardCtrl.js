'use strict';

angular.module('discountdublin')
.controller('DashboardCtrl',['$scope','$state','linkedinProfile', 'API','User', 'toaster', function ($scope,$state,linkedinProfile, API,User,toaster) { 
	if(!linkedinProfile){
		$state.go('login');//TODO dirty change that
	}
	$scope.linkedinProfile = linkedinProfile;
	if(!$scope.linkedinProfile.search){
		$scope.linkedinProfile.search = { industries:[], locations:[]};
	}

	$scope.saveProfile = function(){
		API.updateUser($scope.linkedinProfile).then(function(){
			User.updateUser($scope.linkedinProfile);
			//toaster.pop('success', 'Profile changes has been saved');
		}).catch(function(error){
			toaster.pop('error', 'Profile changes could not be saved');
		});
	};
	
	$scope.addIndustry = function(){
		linkedinProfile.search.industries.push($scope.industry);
		$scope.industry = '';
		$scope.saveProfile();
	};

	$scope.addLocation = function(){
		linkedinProfile.search.locations.push($scope.location);
		$scope.location = '';
		$scope.saveProfile();
	};

	$scope.removeIndustry = function(industry){
		linkedinProfile.search.industries = _.without(linkedinProfile.search.industries, industry);
		$scope.saveProfile();
	};

	$scope.removeLocation = function(location){
		linkedinProfile.search.locations = _.without(linkedinProfile.search.locations, location);
		$scope.saveProfile();
	};

	$scope.searchJobSeeker = function(){
		$state.go('main.search');
	};

}]);


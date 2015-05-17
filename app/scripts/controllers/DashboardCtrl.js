'use strict';

angular.module('discountdublin')
.controller('DashboardCtrl',['$scope','linkedinProfile', function ($scope,linkedinProfile) { 
	$scope.linkedinProfile = linkedinProfile;
	$scope.linkedinProfile.search = { industries:[], locations:[]};
	debugger;

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


}]);


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

	if(!$scope.linkedinProfile.wants){
		$scope.linkedinProfile.wants = { industries:[], locations:[], companies:[]};
	}

	//Industries
	$scope.addIndustry = function(){
		linkedinProfile.search.industries.push($scope.industry);
		$scope.industry = '';
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.removeIndustry = function(industry){
		linkedinProfile.search.industries = _.without(linkedinProfile.search.industries, industry);
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	//Location
	$scope.addLocation = function(){
		linkedinProfile.search.locations.push($scope.location);
		$scope.location = '';
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.removeLocation = function(location){
		linkedinProfile.search.locations = _.without(linkedinProfile.search.locations, location);
		$scope.saveUserProfile($scope.linkedinProfile);
	};


	/*Job seeker*/
	$scope.addLocationWish = function(){
		linkedinProfile.wants.locations.push($scope.wants_location);
		$scope.wants_location = '';
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.removeLocationWish = function(location){
		linkedinProfile.wants.locations = _.without(linkedinProfile.wants.locations, location);
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.addCompanyWish = function(){
		linkedinProfile.wants.companies.push($scope.wants_company);
		$scope.wants_company = '';
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.removeCompanyWish = function(company){
		linkedinProfile.wants.companies = _.without(linkedinProfile.wants.companies, company);
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.addIndustryWish = function(){
		linkedinProfile.wants.industries.push($scope.wants_industry);
		$scope.wants_company = '';
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.removeIndustryWish = function(industry){
		linkedinProfile.wants.industries = _.without(linkedinProfile.wants.industries, industry);
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.searchJobSeeker = function(){
		$state.go('main.search');
	};

	$scope.searchReferer = function(){
		debugger;
		$state.go('main.search');
	};

}]);


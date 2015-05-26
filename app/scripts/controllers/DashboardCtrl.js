'use strict';

angular.module('discountdublin')
.controller('DashboardCtrl',['$scope','$state','linkedinProfile', 'API','User','companies', 'toaster', function ($scope,$state,linkedinProfile, API,User, companies, toaster) { 
	if(!linkedinProfile){
		$state.go('login');//TODO dirty change that
	}

	$scope.linkedinProfile = linkedinProfile;
	if(!$scope.linkedinProfile.search){
		$scope.linkedinProfile.search = { industries:[], locations:[], functions:[], languages:[]};
	}

	if(!$scope.linkedinProfile.wants){
		$scope.linkedinProfile.wants = { industries:[], locations:[], companies:[], functions:[], languages:[]};
	}

	$scope.companiesArray = _.map(companies, function(company){
		if(company.currentJob){
			return company.currentJob.company;
		}
	});

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

	$scope.addFunction = function(){
		if(!linkedinProfile.search.functions){
			linkedinProfile.search.functions = [];
		}
		linkedinProfile.search.functions.push($scope.function);
		$scope.function = '';
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.removeFunction = function(myfunction){
		linkedinProfile.search.functions = _.without(linkedinProfile.search.functions, myfunction);
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


	$scope.addFunctionWish = function(){
		if(!linkedinProfile.wants.functions){
			linkedinProfile.wants.functions = [];
		}
		linkedinProfile.wants.functions.push($scope.wants_function);
		$scope.wants_function = '';
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.removeFunctionWish = function(myfunction){
		linkedinProfile.wants.functions = _.without(linkedinProfile.wants.functions, myfunction);
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.searchJobSeeker = function(){
		$state.go('main.search');
	};

	$scope.searchReferer = function(){;
		$state.go('main.search');
	};

}]);


'use strict';

angular.module('discountdublin')
.controller('DashboardCtrl',['$scope','$state','linkedinProfile', 'API','User','companies', 'toaster', function ($scope,$state,linkedinProfile, API,User, companies, toaster) { 
	if(!linkedinProfile){
		$state.go('login');//TODO dirty change that
	}

	//Init user profile
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

	//watch any change on the user profile and save them in database
	$scope.$watch('linkedinProfile', function(newValue, oldValue){
		if(newValue && oldValue && newValue !== oldValue){
			$scope.saveUserProfile($scope.linkedinProfile);
		}
	}, true);

	//Look for match
	$scope.searchJobSeeker = function(){
		$state.go('main.search');
	};

	$scope.searchReferer = function(){;
		$state.go('main.search');
	};
}]);
'use strict';

angular.module('discountdublin')
.controller('DashboardCtrl',['$scope','$state', 'API','User', 'toaster','usersSearched',
	function ($scope,$state, API,User, toaster, usersSearched) { 


	if(!$scope.user){
		$state.go('login');//TODO dirty change that
	}

	//Init user profile
	$scope.linkedinProfile = $scope.user; 
	$scope.usersSearched    = usersSearched;
	if(!$scope.linkedinProfile.search){
		$scope.linkedinProfile.search = { industries:[], locations:[], functions:[], languages:[]};
	}

	if(!$scope.linkedinProfile.wants){
		$scope.linkedinProfile.wants = { industries:[], locations:[], companies:[], functions:[], languages:[]};
	}


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
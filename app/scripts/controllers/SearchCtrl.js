'use strict';

angular.module('discountdublin')
.controller('SearchCtrl',['$scope','$state','search', 'API','User', 'toaster', function ($scope,$state,search, API,User,toaster) { 
	$scope.search = search;
	$scope.currentProfile = 0;

	$scope.next = function(){
		if($scope.currentProfile < $scope.search.length - 1){
			$scope.currentProfile++;
		}
	};

	$scope.previous = function(){
		if($scope.currentProfile >  0){
			$scope.currentProfile--;
		}
	}

	
}]);


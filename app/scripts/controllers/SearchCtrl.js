'use strict';

angular.module('discountdublin')
.controller('SearchCtrl',['$scope','$state','search', 'API','User', 'toaster', function ($scope,$state,search, API,User,toaster) { 

	$scope.user = User.getUser();
	$scope.search = search;
	$scope.currentProfile = 0;

	$scope.next = function(){
		if($scope.currentProfile < $scope.search.length){
			$scope.currentProfile++;
		}
	};

	$scope.previous = function(){
		if($scope.currentProfile >  0){
			$scope.currentProfile--;
		}
	};

	$scope.gotIt = function(){
		localStorage.hasGotIt = true;
	};

	$scope.hasGotIt = function(){
		return localStorage.hasGotIt;
	};

	$scope.trashProfile = function(profile){
		if(!$scope.user.trash){
			$scope.user.trash = [];
		}
		$scope.user.trash.push(profile._id);
		$scope.saveUserProfile($scope.user).then(function(data){
			$scope.next()
		});
	};

	$scope.saveProfile = function(profile){
		if(!$scope.isAlreadySaved(profile)){
			if(!$scope.user.saved){
				$scope.user.saved = [];
			}
			$scope.user.saved.push(profile._id);
			$scope.saveUserProfile($scope.user).then(function(data){
				$scope.next()
			});
		}else{
			$scope.next();
		}
	};

	$scope.contactProfile = function(profile){
		API.sendInvitation(profile).then(function(user){
			toaster.pop('success','An invitation has been sent');
			$scope.next();
		}).catch(function(err){
			debugger;
		});
	}

	$scope.clearTrash = function(){
		$scope.user.trash = [];
		$scope.saveUserProfile($scope.user);
	};

	$scope.clearSavedList = function(){
		$scope.user.saved = [];
		$scope.saveUserProfile($scope.user);
	};

	$scope.isAlreadySaved = function(linkedinProfile){
		return $scope.user.saved.indexOf(linkedinProfile._id) != -1;
	};

	$scope.goToSavedList = function(){
		$scope.currentProfile = 0;
		$state.go('main.userSaved');
	}

}]);


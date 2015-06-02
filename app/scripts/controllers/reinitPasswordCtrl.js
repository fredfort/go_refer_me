angular.module('discountdublin')

.controller('reinitPasswordCtrl',['$scope','$state','API','md5','toaster','$stateParams',function ($scope,$state,API,md5,toaster,$stateParams) {

	$scope.reinitPassword = function(){
		if($scope.password && $scope.password === $scope.password_confirm){
			API.changePassword(md5.createHash($scope.password), $stateParams.token).then(function(success){
				$scope.errorPassword = false;
				toaster.pop("success","Your password has been changed");
				$state.go('login');
			}).catch(function(err){
				toaster.pop('error', "Your token has expired, do the 'i forgot my password' process again");
			});
		}else{
			$scope.errorPassword = true;
		}
	}

}]);
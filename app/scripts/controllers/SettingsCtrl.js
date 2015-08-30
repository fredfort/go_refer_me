angular.module('discountdublin')
.controller('SettingsCtrl', ['$scope','API', 'User', function ($scope, API, User) {

		$scope.deleteUser = function(){
			
			API.deleteUser().then(function(){
				debugger;
				User.logout();
			});
		}
	
}]);
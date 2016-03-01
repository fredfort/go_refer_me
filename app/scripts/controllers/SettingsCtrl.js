angular.module('discountdublin')
.controller('SettingsCtrl', ['$scope','API', 'User', 'toaster','referer',function ($scope, API, User,toaster,referer) {

		$scope.referer = referer;

		$scope.deleteUser = function(){
			API.deleteUser().then(function(){
				User.logout();
			});
		}

		$scope.sendReferer = function(){
			API.addReferer($scope.refererId).then(function(user){
				$scope.user.credit  = user.data.user.credit;
				$scope.user.referer = user.data.user.referer;
				$scope.referer =  user.data.referer;

				toaster.pop('success','Thanks to '+$scope.referer.firstName+' '+$scope.referer.lastName+'. You now have a credit of '+user.data.user.credit);

			}).catch(function(err){
				console.log(err.data);
				toaster.pop('error',err.data);
			});

		}
}]);
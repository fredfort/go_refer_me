angular.module('discountdublin')
.directive('friends', ['$state','API', 'toaster', 'User', function ($state,API,toaster,User) {
	return {
		restrict: 'A',
		scope:{
			userProfile:'=',//connected user
			persons:'=',//possible connections
			saveFct:'&',
			personFilter:'='
		},
		templateUrl:'scripts/directives/friends/friends.html',
		link: function (scope, iElement, iAttrs) {


		}
	};
}])
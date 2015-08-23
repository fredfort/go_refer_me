angular.module('discountdublin')
.directive('friends', ['$state','API', 'toaster', 'User', function ($state,API,toaster,User) {
	return {
		restrict: 'A',
		scope:{
			userProfile:'=',//connected user
			persons:'=',//possible connections
			personFilter:'=',
			sortFilter:'='
		},
		templateUrl:'scripts/directives/friends/friends.html',
		link: function (scope, iElement, iAttrs) {

			scope.changeFriendShipStatus = function(user){
		      API.changeFriendShipStatus(user)
		    };

		    scope.unFriend = function(user){
		      API.unFriend(user).then(function(res){
		        scope.persons = _.without(scope.persons, user);
		        toaster.pop('info', 'User unfriended');
		      });
		    };


		}
	};
}])
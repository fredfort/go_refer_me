angular.module('discountdublin')
.directive('profile', [function () {
	return {
		restrict: 'A',
		templateUrl:'scripts/directives/profile/profile.html',
		scope:{
			profile:'=',
			refreshFct:'&'
		},
		link: function (scope, iElement, iAttrs) {
			scope.clearTrash = function(){
				scope.profile.trash = [];
			};
			scope.clearSavedProfile = function(){
				scope.profile.saved = [];
				scope.profile.onlyShowSavedProfile = false;
			}

			scope.toggleShowOnlySavedProfile = function(){//TODO do not listen to this event, no need to call API
				scope.profile.onlyShowSavedProfile = !scope.profile.onlyShowSavedProfile;
			}
		}
	};
}])
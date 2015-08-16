angular.module('discountdublin')
.directive('profile', [function () {
	return {
		restrict: 'A',
		templateUrl:'scripts/directives/profile/profile.html',
		scope:{
			profile:'='
		},
		link: function (scope, iElement, iAttrs) {
	
		}
	};
}])
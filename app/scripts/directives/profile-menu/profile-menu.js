angular.module('discountdublin')
.directive('profileMenu', ['$state','$window','User', 'Linkedin', function ($state,$window, User, Linkedin) {
	return {
		restrict: 'A',
		templateUrl:'scripts/directives/profile-menu/profile-menu.html',
		scope:{
			profileMenu:'=',
			slideOpen:'='
		},
		link: function (scope, iElement, iAttrs) {
		  	scope.logout = function(){
				User.logout();
	  		};

	  		scope.clickLink = function(){
	  			if(window.innerWidth < 992){//mobile
	  				scope.slideOpen = false;
	  			}
	  		};

		}
	};
}])
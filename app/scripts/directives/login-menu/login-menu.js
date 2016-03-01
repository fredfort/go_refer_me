angular.module('discountdublin')
.directive('loginMenu', ['$state','User', 'Linkedin', function ($state, User, Linkedin) {
	return {
		restrict: 'A',
		templateUrl:'scripts/directives/login-menu/login-menu.html',
		scope:{
			slideOpen:'='
		}

	};
}])
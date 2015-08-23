angular.module('discountdublin')
.directive('profileMenu', ['$state','User', 'Linkedin', function ($state, User, Linkedin) {
	return {
		restrict: 'A',
		templateUrl:'scripts/directives/profile-menu/profile-menu.html',
		scope:{
			profileMenu:'=',
			slideOpen:'='
		},
		link: function (scope, iElement, iAttrs) {
		  	scope.logout = function(){
			User.clear();
	  		$state.go('login');
	  		Linkedin.logout().catch(function(err){
	  			alert('disconnection error');
	  		});
  	};
		}
	};
}])
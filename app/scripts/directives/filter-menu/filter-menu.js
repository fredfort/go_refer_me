angular.module('discountdublin')
.directive('filterMenu', ['$state','$window', function ($state,$window) {
	return {
		restrict: 'A',
		scope:{
			category:'=',
			user:'='
		},
		templateUrl:'scripts/directives/filter-menu/filter-menu.html',
		link: function (scope, iElement, iAttrs) {
			scope.$watch('category', function(newValue,oldValue){
			 	scope.widerFilter = (scope.category==='referer');
			});

			scope.getFiltersLength = function(type){
				if(scope.category === 'referer'){
					if(scope.user.search[type]){
						return scope.user.search[type].length;
					}else{
						return 0;
					}
				}else if(scope.category === 'looking_for_job'){
					if(type === 'functions'){
						var industriesLength = scope.user.wants.industries.length;
						var functionsLength  = scope.user.wants[type].length;
						return industriesLength + functionsLength;
					}
					return scope.user.wants[type].length;
				}
			};

			scope.goToFilter = function(filterType){
				$state.go('main.filter',{filterType:filterType});
			};


	  		scope.windowWidth = $window.innerWidth+'px';
			var w = angular.element($window);
			scope.$watch(
				function () {
				  return $window.innerWidth;
				},
				function (value) {
				  if(value > 992){
				    scope.windowWidth = $window.innerWidth - 285+'px';
				  }else{
				    scope.windowWidth = $window.innerWidth+'px';
				  }
				},
				true
			);

			w.bind('resize', function(){
				scope.$apply();
			});
			
		}
	};
}])
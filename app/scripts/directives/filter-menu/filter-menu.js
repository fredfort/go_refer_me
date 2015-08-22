angular.module('discountdublin')
.directive('filterMenu', ['$state', function ($state) {
	return {
		restrict: 'A',
		scope:{
			category:'='
		},
		templateUrl:'scripts/directives/filter-menu/filter-menu.html',
		link: function (scope, iElement, iAttrs) {
			scope.$watch('category', function(newValue,oldValue){
				scope.widerFilter = (scope.category==='referer');
			});
			scope.goToFilter = function(filterType){
				$state.go('main.filter',{filterType:filterType});
			}
			
		}
	};
}])
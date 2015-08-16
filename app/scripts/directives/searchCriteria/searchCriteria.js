angular.module('discountdublin')
.directive('searchCriteria', [function () {
	return {
		restrict: 'A',
		templateUrl:'scripts/directives/searchCriteria/searchCriteria.html',
		scope:{
			itemType:'@',
			items:'=',
			typeaheadItems:'='
		},
		link: function (scope, iElement, iAttrs) {
			
			scope.addItem = function(){
				debugger;
				if(scope.item && scope.item.length){
					scope.items.push(scope.item);
					scope.item = '';
				}
			};

			scope.removeItem = function(item){
				scope.items = _.without(scope.items, item);
			};

		}
	};
}])
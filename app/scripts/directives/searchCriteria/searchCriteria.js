angular.module('discountdublin')
.directive('searchCriteria', [function () {
	return {
		restrict: 'A',
		templateUrl:'scripts/directives/searchCriteria/searchCriteria.html',
		scope:{
			itemType:'@',
			items:'=',
			typeaheadItems:'=',
			hideSave:'='
		},
		link: function (scope, iElement, iAttrs) {

			scope.data= {
				item:''
			};
			scope.experiences = ['junior','intermediate','senior'];

			scope.addItem = function(){
				if(scope.data.item && scope.data.item.length){
					scope.items.push(scope.data.item);
					scope.data.item = '';
	
				}
			};

			scope.removeItem = function(item){
				scope.items = _.without(scope.items, item);
			};

			scope.selectAll = function(){
				scope.items = scope.typeaheadItems;
			};

			scope.deselectAll = function(){
				scope.items = [];
			};

			scope.toggleItem = function(item){
				if(scope.items.indexOf(item) === -1){
					scope.items.push(item);
				}else{
					scope.removeItem(item);
				}
			};

		}
	};
}])
angular.module('discountdublin')
.directive('searchCriteria', ['toaster',function (toaster) {
	return {
		restrict: 'A',
		templateUrl:'scripts/directives/searchCriteria/searchCriteria.html',
		scope:{
			user:'=',
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


				if(scope.itemType === 'location' && scope.items.length >= 10){
					toaster.pop('info','You can\'t add more than 10 locations in your filters');
				}else{
					if(scope.data.item && scope.data.item.length && scope.items.indexOf(scope.data.item) === -1){
						scope.items.push(scope.data.item);
						scope.data.item = '';
		
					}
				}
			};

			scope.removeItem = function(item){
				if(item !== scope.user.location.name){
					scope.items = _.without(scope.items, item);
				}else{
					toaster.pop('info','You can\'t remove your location as a filter');
				}
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
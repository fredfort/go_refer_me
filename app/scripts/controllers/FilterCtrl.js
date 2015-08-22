angular.module('discountdublin')
.controller('FilterCtrl', ['$scope','$stateParams', function($scope, $stateParams){
	$scope.filterType = $stateParams.filterType;

	$scope.companiesArray = _.map($scope.companies, function(company){
		if(company.currentJob){
			return company.currentJob.company;
		}
	});
	
}]);
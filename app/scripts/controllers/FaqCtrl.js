angular.module('discountdublin')
.controller('FaqCtrl', ['$scope','questions', function ($scope,questions) {
	$scope.questions = questions.data;
}]);
angular.module('discountdublin')
.controller('TestController', ['$scope','$firebaseObject',function($scope,$firebaseObject){
	$scope.test = "test!";

	var ref = new Firebase("https://shining-inferno-6689.firebaseio.com/data");
	
	$scope.data = {text:''};
	$scope.chat = [];

	$scope.addMessage = function () {
		ref.set({
		  title: $scope.data.text,
		  name:  $scope.data.name
		});
		$scope.data.text = '';
	}

	ref.on("value", function(snapshot) {
		if(snapshot.val()){
			$scope.chat = [];
			console.log(snapshot.val());
  			angular.forEach(snapshot.val(), function(k,v){
  				$scope.$apply(function(){
  					$scope.chat.push({name:k.name,text:k.title})
  					console.log(k.name,k.title);

  				});
  			});
  		}
	});

}]);
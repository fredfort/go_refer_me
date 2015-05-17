'use strict';


angular.module('discountdublin')
  .controller('MainCtrl',['$scope','$state','Linkedin', function ($scope,$state, Linkedin) {

  	$scope.logout = function(){
  		Linkedin.logout().then(function(data){
  			$state.go('login');
  		});
  	
  	}

  }]);

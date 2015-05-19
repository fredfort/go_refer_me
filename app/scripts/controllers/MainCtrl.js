'use strict';


angular.module('discountdublin')
  .controller('MainCtrl',['$scope','$state','Linkedin','User', function ($scope,$state, Linkedin, User) {

  	$scope.logout = function(){
  		User.clear();
  		$state.go('login');
  		Linkedin.logout().then(function(data){
  			//nothing to do here
  		}).catch(function(err){
  			alert('disconnection error');
  		});
  	
  	}

  }]);

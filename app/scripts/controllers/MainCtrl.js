'use strict';


angular.module('discountdublin')
  .controller('MainCtrl',['$scope','$state','Linkedin','User','industries', function ($scope,$state, Linkedin, User,industries) {

    $scope.industries = industries.getIndustries();
    var sub_industries = [];
    angular.forEach($scope.industries, function(value, key) {
      sub_industries = sub_industries.concat(value);
    });
    $scope.sub_industries = sub_industries;
    
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

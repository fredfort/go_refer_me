angular.module('discountdublin')

.factory('API',['$http','md5',function($http,md5){
	var nodeAPI = 'http://localhost:3000/';
	//var nodeAPI = 'http://default-environment-tjdrvapm26.elasticbeanstalk.com/';
	var baseURL = nodeAPI;
	var user = null;

	return {
		createUser :function(category){
			return $http.post(baseURL+'user');
		},

		searchUser :function(){
			return $http.get(baseURL+'user');
		},

	}

}]);
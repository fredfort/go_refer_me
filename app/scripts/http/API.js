angular.module('discountdublin')

.factory('API',['$http','md5',function($http,md5){
	//var nodeAPI = 'http://localhost:3000/';
	var nodeAPI = 'http://goreferme.elasticbeanstalk.com/';
	var baseURL = nodeAPI;
	var user = null;

	return {
		createUser :function(user){
			return $http.post(baseURL+'user',{user:user});
		},

		getUser: function(user){
			return $http.get(baseURL+'user/'+user.id);
		},

		updateUser: function(user){
			return $http.put(baseURL+'user/',{user:user});
		},

		searchUsers :function(){
			return $http.get(baseURL+'user');
		},

	}

}]);
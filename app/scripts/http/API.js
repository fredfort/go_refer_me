angular.module('discountdublin')

.factory('API',['$http',function($http){
	//var nodeAPI = 'http://localhost:3000/';
	var nodeAPI = 'http://goreferme.elasticbeanstalk.com/';
	var baseURL = nodeAPI;
	var user = null;

	return {
		createUser :function(user){
			return $http.post(baseURL+'user',{user:user});
		},
		
		login :function(email, password){
			return $http.post(baseURL+'user/login',{emailAddress:email,password:password});
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

		searchUsersByIds:function(ids){
			return $http.post(baseURL+'user/search',{ids:ids});
		},

		searchCompanies:function(ids){
			return $http.get(baseURL+'companies');
		},

		sendInvitation: function(userInvited){
			return $http.post(baseURL+'invite', {user:userInvited});
		},

		me:function(){
			return $http.get(baseURL+'me');
		}, 

		acceptInvitation:function(user){
			return $http.post(baseURL+'user/accept',{user:user});
		},

		denyInvitation:function(user){
			return $http.post(baseURL+'user/deny', {user:user});
		},

		unFriend:function(user){
			return $http.post(baseURL+'user/unFriend',{user:user});
		},

		cancelInvitation:function(user){
			return $http.post(baseURL+'user/cancelInvitation',{user:user});
		},

		reinitPassword:function(email){
			return $http.post(baseURL+'user/reinitPassword',{emailAddress:email});
		},

		changePassword:function(password,token){
			return $http({
				method:'POST',
				url:baseURL+'user/changePassword',
				data:{password:password},
				headers:{
					'x-access-token':token,
				}
			});
		}
	}

}]);
angular.module('discountdublin')

.factory('User', function(){
	var user = null;
	return {
		setUser: function(userToken){
			this.user = userToken.data.user;
			localStorage.userToken = JSON.stringify(userToken.data);
		},

		updateUser: function(user){
			this.user = user;
			var userToken = JSON.parse(localStorage.userToken);
			userToken.user = user;
			localStorage.userToken = JSON.stringify(userToken);
		},

		getToken:function(){
			return JSON.parse(localStorage.userToken).token;
		}, 

		hasToken: function(){
			return localStorage.userToken != null;
		},

		getUser: function(){
			if(this.user){
				return this.user;
			}else if(localStorage.userToken){
				var userToken =  JSON.parse(localStorage.userToken);
				return userToken.user;
			}else{
				return null;
			}
		},
		clear: function(){
			localStorage.clear();
			return null;
		}
	}

});
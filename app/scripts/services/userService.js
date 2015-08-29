angular.module('discountdublin')

.factory('User', ['$location', '$interval','Linkedin', function($location, $interval, Linkedin){
	var user = null,fetchUserinterval;
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
		},

		logout: function(){
			this.clear();
			$location.path('/');
	  		Linkedin.logout().catch(function(err){
	  			alert('disconnection error');
	  		});
	  		this.stopUserInterval();
	  	},

	  	setFetchUserInterval: function(fetchUserFct){
	  		 this.fetchUserinterval = $interval(fetchUserFct, 1000 * 30);
	  	},

	  	stopUserInterval: function(){
	  		$interval.cancel(this.fetchUserinterval);
	  	},


	}

}]);
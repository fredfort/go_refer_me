angular.module('discountdublin')

.factory('User',function(){
	var user = null;
	return {
		setUser: function(user){
			this.user = user;
			localStorage.user = JSON.stringify(user);
		},
		getUser: function(){
			if(this.user){
				return this.user;
			}else if(localStorage.user){
				return  JSON.parse(localStorage.user);
			}else{
				return {};
			}
		},
		clear: function(){
			localStorage.clear();
			return null;
		}
	}

});
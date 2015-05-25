angular.module('discountdublin')

.factory('Linkedin',['$http','$q',function($http, $q){

	var vm = this;

	return {

		getUserInformation: function(){
			var deferred = $q.defer();
			var url = 'people/~:(id,positions,specialties,summary,first-name,last-name,headline,siteStandardProfileRequest,industry,location,skills,picture-url)?format=json';
			IN.API.Raw(url).method('GET').body().result(function(data){
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		isAuthorized: function(){

			var isAuthorized =  IN.User.isAuthorized();
			setTimeout(function() {
				return isAuthorized;
			}, 1000);
		},

		authorization: function(user){
			var deferred = $q.defer();
			IN.User.authorize(function(data){
				if(IN.User.isAuthorized()){
					deferred.resolve(data);
				}else{
					deferred.reject(data);
				}
			});
			return deferred.promise;
		},

		logout: function(){
			var deferred = $q.defer();
			IN.User.logout(function(data){
				deferred.resolve(data);
			});
			return deferred.promise;
		}
	}

}]);
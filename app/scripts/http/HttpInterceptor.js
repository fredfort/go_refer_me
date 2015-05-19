angular.module('discountdublin').factory('HttpInterceptor',['$window','$q','User', function($window,$q, User) {
    var sessionInjector = {

    	request: function(config){
        if(User.hasToken()){
          config.headers['x-access-token'] = User.getToken();
        }else{
          delete config.headers['x-access-token']
        }
    		return config;
    	},

      response: function(config) {
        return config;
      },

      responseError: function(rejection){
        if(rejection.status === 403 || rejection.status === 401){
          $window.location.replace('#/login');
          localStorage.removeItem('token');
        }
        return $q.reject(rejection);    
      }
    };
    return sessionInjector;
}]);
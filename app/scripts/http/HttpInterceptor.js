angular.module('discountdublin').factory('HttpInterceptor',['$window','$q',function($window,$q) {
    var sessionInjector = {

    	request: function(config){
        if(localStorage.token){
          config.headers['x-access-token'] = localStorage.token;
        }
        // if(localStorage.facebook_id){
        //   config.headers['x-access-id'] = localStorage.facebook_id;
        // }
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
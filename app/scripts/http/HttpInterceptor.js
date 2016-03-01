angular.module('discountdublin').factory('HttpInterceptor',['$window','$q','User','toaster', function($window,$q, User, toaster) {
    var sessionInjector = {

    	request: function(config){
        if(!config.headers['x-access-token']){
          if(User.hasToken() && !config.headers['Authorization']){
            config.headers['x-access-token'] = User.getToken();
          }else{
            delete config.headers['x-access-token']
          }
        }
    		return config;
    	},

      response: function(config) {
        return config;
      },

      responseError: function(rejection){
        if(rejection.status === 403 || rejection.status === 401){
          User.logout();
          toaster.pop('error', rejection.data);
        }else if(rejection.status !== 404 && rejection.status !== 400){
          toaster.pop('error', rejection.data);
        }
        return $q.reject(rejection);    
      }
    };
    return sessionInjector;
}]);
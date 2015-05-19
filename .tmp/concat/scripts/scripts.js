'use strict';

/**
 * @ngdoc overview
 * @name discountdublin
 * @description
 * # discountdublin
 *
 * Main module of the application.
 */
angular
  .module('discountdublin', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'angular-md5',
    'toaster',
    'ui.bootstrap'
  ])
  .config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function ($stateProvider, $urlRouterProvider,$httpProvider) {

    $httpProvider.interceptors.push('HttpInterceptor');


    $urlRouterProvider.otherwise('/login');

    //
    // Now set up the states
    $stateProvider
      .state('main',{
        url:'/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        abstract:true
      })
      .state('login',{
        url:'/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('main.dashboard',{
        url:'dashboard',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        resolve:{
          linkedinProfile:['User','$state', function(User, $state){
            return User.getUser();
          }]
        }
      })
      .state('main.search',{
        url:'search',
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl',
        resolve:{
          search:['API', function(API){
            return API.searchUsers().then(function(people){
              return people.data;
            });
          }]
        }
      });
  }]);
'use strict';


angular.module('discountdublin')
  .controller('MainCtrl',['$scope','$state','Linkedin','User', function ($scope,$state, Linkedin, User) {

  	$scope.logout = function(){
  		User.clear();
  		$state.go('login');
  		Linkedin.logout().then(function(data){
  			//nothing to do here
  		}).catch(function(err){
  			alert('disconnection error');
  		});
  	
  	}

  }]);

'use strict';

angular.module('discountdublin')
.controller('SearchCtrl',['$scope','$state','search', 'API','User', 'toaster', function ($scope,$state,search, API,User,toaster) { 
	$scope.search = search;
	$scope.currentProfile = 0;

	$scope.next = function(){
		if($scope.currentProfile < $scope.search.length - 1){
			$scope.currentProfile++;
		}
	};

	$scope.previous = function(){
		if($scope.currentProfile >  0){
			$scope.currentProfile--;
		}
	}

	
}]);


'use strict';


angular.module('discountdublin')
  .controller('LoginCtrl',['$scope','$state','API','User','Linkedin', function ($scope,$state, API,User, Linkedin) {


    $scope.linkedInLogin = function(){
      Linkedin.authorization().then(function(data){
            Linkedin.getUserInformation().then(function(user){
                API.createUser(user)
                .then(function(userToken){
                  debugger;
                  User.setUser(userToken);
                  $state.go('main.dashboard');
                }).catch(function(err){
                  alert('User creation error '+err);
                });
            });
      }).catch(function(data){
        alert('cant connect to linkedin')
      });
    }

  }]);

'use strict';

angular.module('discountdublin')
.controller('DashboardCtrl',['$scope','$state','linkedinProfile', 'API','User', 'toaster', function ($scope,$state,linkedinProfile, API,User,toaster) { 
	if(!linkedinProfile){
		$state.go('login');//TODO dirty change that
	}
	$scope.linkedinProfile = linkedinProfile;
	if(!$scope.linkedinProfile.search){
		$scope.linkedinProfile.search = { industries:[], locations:[]};
	}

	$scope.saveProfile = function(){
		API.updateUser($scope.linkedinProfile).then(function(){
			User.updateUser($scope.linkedinProfile);
			//toaster.pop('success', 'Profile changes has been saved');
		}).catch(function(error){
			toaster.pop('error', 'Profile changes could not be saved');
		});
	};
	
	$scope.addIndustry = function(){
		linkedinProfile.search.industries.push($scope.industry);
		$scope.industry = '';
		$scope.saveProfile();
	};

	$scope.addLocation = function(){
		linkedinProfile.search.locations.push($scope.location);
		$scope.location = '';
		$scope.saveProfile();
	};

	$scope.removeIndustry = function(industry){
		linkedinProfile.search.industries = _.without(linkedinProfile.search.industries, industry);
		$scope.saveProfile();
	};

	$scope.removeLocation = function(location){
		linkedinProfile.search.locations = _.without(linkedinProfile.search.locations, location);
		$scope.saveProfile();
	};

	$scope.searchJobSeeker = function(){
		$state.go('main.search');
	};

}]);


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
angular.module('discountdublin')

.factory('Linkedin',['$http','$q',function($http, $q){
	var format = '?format=json';
	var params = ':(id,first-name,skills,educations,languages,twitter-accounts,industry,location)'
	var vm = this;

	return {

		getUserInformation: function(){
			var deferred = $q.defer();
			var url = 'people/~:(id,first-name,last-name,headline,siteStandardProfileRequest,industry,location,skills,num-connections,picture-url)?format=json'
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
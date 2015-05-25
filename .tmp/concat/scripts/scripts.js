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
          search:['API', 'User', function(API,User){
             var userTrash = User.getUser().trash;
            return API.searchUsers().then(function(people){
              var people = people.data;
              return _.filter(people, function(person){
                return userTrash.indexOf(person._id) === -1;
              });
            });
          }]
        }
      })
      .state('main.userSaved',{
        url:'userSaved',
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl',
        resolve:{
          search:['API','User', function(API, User){
            var ids = User.getUser().saved;
            return API.searchUsersByIds(ids).then(function(people){
              return people.data;
            });
          }]
        }
      })
      .state('main.info',{
        url:'info',
        templateUrl: 'views/info.html'
      })
      .state('main.credit',{
        url:'credit',
        templateUrl: 'views/credit.html',
        controller:'CreditController'
      });
  }]);
'use strict';

angular.module('discountdublin')
  .controller('MainCtrl',['$scope','$state','Linkedin','User','industries','locations','API',function ($scope,$state, Linkedin, User,industries, locations, API) {

    $scope.getIndustriesArray = function(){
      var sub_industries = [];
      angular.forEach($scope.industries, function(value, key) {
        sub_industries = sub_industries.concat(value);
      });
      return sub_industries;
    };

    $scope.getLocationArray = function(){
      var country = [];
      angular.forEach($scope.locations, function(value, key) {
        country = country.concat(value);
      });
      return country;
    };

  	$scope.logout = function(){
  		User.clear();
  		$state.go('login');
  		Linkedin.logout().catch(function(err){
  			alert('disconnection error');
  		});
  	};

    $scope.notImplemented = function(){
      alert("not implemted yet");
    };

    $scope.saveUserProfile = function(profile){
      return API.updateUser(profile).then(function(){
        User.updateUser(profile);
      }).catch(function(error){
        toaster.pop('error', 'Profile changes could not be saved');
      });
    };
    
    $scope.industries     = industries.getIndustries();
    $scope.sub_industries = $scope.getIndustriesArray();

    $scope.locations      = locations.getLocations();
    $scope.countries        = $scope.getLocationArray();
  }]);

'use strict';

angular.module('discountdublin')
.controller('SearchCtrl',['$scope','$state','search', 'API','User', 'toaster', function ($scope,$state,search, API,User,toaster) { 

	$scope.user = User.getUser();
	$scope.search = search;
	$scope.currentProfile = 0;

	$scope.next = function(){
		if($scope.currentProfile < $scope.search.length){
			$scope.currentProfile++;
		}
	};

	$scope.previous = function(){
		if($scope.currentProfile >  0){
			$scope.currentProfile--;
		}
	};

	$scope.gotIt = function(){
		localStorage.hasGotIt = true;
	};

	$scope.hasGotIt = function(){
		return localStorage.hasGotIt;
	};

	$scope.trashProfile = function(profile){
		if(!$scope.user.trash){
			$scope.user.trash = [];
		}
		$scope.user.trash.push(profile._id);
		$scope.saveUserProfile($scope.user).then(function(data){
			$scope.next()
		});
	};0

	$scope.saveProfile = function(profile){
		if(!$scope.isAlreadySaved(profile)){
			if(!$scope.user.saved){
				$scope.user.saved = [];
			}
			$scope.user.saved.push(profile._id);
			$scope.saveUserProfile($scope.user).then(function(data){
				$scope.next()
			});
		}else{
			$scope.next();
		}
	};

	$scope.contactProfile = function(profile){
		$scope.notImplemented();
	}

	$scope.clearTrash = function(){
		$scope.user.trash = [];
		$scope.saveUserProfile($scope.user);
	};

	$scope.clearSavedList = function(){
		$scope.user.saved = [];
		$scope.saveUserProfile($scope.user);
	};

	$scope.isAlreadySaved = function(linkedinProfile){
		return $scope.user.saved.indexOf(linkedinProfile._id) != -1;
	};

	$scope.goToSavedList = function(){
		$scope.currentProfile = 0;
		$state.go('main.userSaved');
	}

}]);


'use strict';


angular.module('discountdublin')
  .controller('LoginCtrl',['$scope','$state','API','User','Linkedin', function ($scope,$state, API,User, Linkedin) {


    $scope.linkedInLogin = function(){
      Linkedin.authorization().then(function(data){
            Linkedin.getUserInformation().then(function(user){
                var linkedinJob = user.positions.values[0];
                var currentJob = {
                  id: linkedinJob.id,
                  company:linkedinJob.company.name,
                  title:linkedinJob.title,
                  summary: linkedinJob.summary
                };
                user.currentJob = currentJob;
                API.createUser(user)
                .then(function(userToken){
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

	if(!$scope.linkedinProfile.wants){
		$scope.linkedinProfile.wants = { industries:[], locations:[], companies:[]};
	}

	//Industries
	$scope.addIndustry = function(){
		linkedinProfile.search.industries.push($scope.industry);
		$scope.industry = '';
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.removeIndustry = function(industry){
		linkedinProfile.search.industries = _.without(linkedinProfile.search.industries, industry);
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	//Location
	$scope.addLocation = function(){
		linkedinProfile.search.locations.push($scope.location);
		$scope.location = '';
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.removeLocation = function(location){
		linkedinProfile.search.locations = _.without(linkedinProfile.search.locations, location);
		$scope.saveUserProfile($scope.linkedinProfile);
	};


	/*Job seeker*/
	$scope.addLocationWish = function(){
		linkedinProfile.wants.locations.push($scope.wants_location);
		$scope.wants_location = '';
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.removeLocationWish = function(location){
		linkedinProfile.wants.locations = _.without(linkedinProfile.wants.locations, location);
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.addCompanyWish = function(){
		linkedinProfile.wants.companies.push($scope.wants_company);
		$scope.wants_company = '';
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.removeCompanyWish = function(company){
		linkedinProfile.wants.companies = _.without(linkedinProfile.wants.companies, company);
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.addIndustryWish = function(){
		linkedinProfile.wants.industries.push($scope.wants_industry);
		$scope.wants_company = '';
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.removeIndustryWish = function(industry){
		linkedinProfile.wants.industries = _.without(linkedinProfile.wants.industries, industry);
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.searchJobSeeker = function(){
		$state.go('main.search');
	};

	$scope.searchReferer = function(){
		debugger;
		$state.go('main.search');
	};

}]);


angular.module('discountdublin')
.controller('CreditCtrl.js', function(){
	var embeddedPPFlow = new PAYPAL.apps.DGFlow({trigger: 'submitBtn'});

})
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
		}
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
angular.module('discountdublin')
.factory('industries', function(){

var industries = 
{
	"Agriculture":[
		"Dairy",
		"Farming",
		"Fishery",
		"Ranching"
	],
	"Arts":[
		"Arts and Crafts",
		"Design",
		"Fine Art",
		"Graphic Design",
		"Motion Pictures and Film",
		"Museums and Institutions",	
		"Music",
		"Performing Arts",
		"Photography"
	],
	"Construction":[
		"Architecture & Planning",
		"Building Materials",
		"Civil Engineering",
		"Construction"
	],
	"Consumer Goods":[
		"Apparel & Fashion",
		"Consumer Electronics", 
		"Consumer Goods", 
		"Cosmetics", 
		"Food Production", 
		"Furniture", 
		"Import and Export", 
		"Luxury Goods & Jewelry", 
		"Retail", 
		"Sporting Goods", 
		"Supermarkets", 
		"Tobacco", 
		"Wholesale", 
		"Wine and Spirits"
	],
	"Corporate":[
		"Business Supplies and Equipment",
		"Facilities Services" , 
		"Human Resources", 
		"Management Consulting", 
		"Market Research", 	
		"Marketing and Advertising", 
		"Outsourcing/Offshoring", 	
		"Professional Training & Coaching",
		"Public Relations and Communications",
		"Security and Investigations", 
		"Staffing and Recruiting"
	],
	"Educational":["E-Learning",
		"Education Management",
		"Higher Education",
		"Primary/Secondary Education",
		"Research"
	],
	"Finance Accounting":[
		"Banking",
		"Capital Markets",
		"Commercial Real Estate",
		"Financial Services",
		"Insurance",
		"Investment Banking",
		"Investment Management",
		"Real Estate",
		"Venture Capital & Private Equity"
	],
	"Government	Executive Office":[
		"Government Administration",
		"Government Relations",
		"International Affairs",
		"Judiciary",
		"Law Enforcement",
		"Legislative Office",
		"Military",
		"Political Organization",
		"Public Policy",
		"Public Safety"
	],
	"High Tech	Computer & Network Security":[
	 	"Computer Hardware",
	 	"Computer Networking",
	 	"Computer Software",
	 	"Defense & Space",
	 	"Information Technology and Services",
	 	"Internet",
	 	"Nanotechnology",
	 	"Semiconductors",
	 	"Telecommunications",
	 	"Wireless"
	 ],
	"Legal":[
		"Alternative Dispute Resolution",
		"Law Practice",
		"Legal Services"
	],
	"Manufacturing	Automotive":[
		"Aviation & Aerospace",
		"Chemicals",
		"Electrical/Electronic Manufacturing",
		"Glass, Ceramics & Concrete",
		"Industrial Automation",
		"Machinery",
		"Mechanical or Industrial Engineering",
		"Mining & Metals",
		"Oil & Energy",
		"Packaging and Containers",
		"Paper & Forest Products",
		"Plastics",
		"Railroad Manufacture",
		"Renewables & Environment",
		"Shipbuilding",
		"Textiles",
		"Utilities"
	],
	"Media	Animation":[
		"Broadcast Media",
		"Media Production",
		"Newspapers",
		"Online Media",
		"Printing",
		"Publishing",
		"Writing and Editing"
	],
	"Medical":[
		"Alternative Medicine",
		"Biotechnology",
		"Health, Wellness and Fitness",
		"Hospital & Health Care",
		"Medical Devices",
		"Medical Practice",
		"Mental Health Care",
		"Pharmaceuticals",
		"Veterinary"
	],
	"Non-profit":[	
		"Consumer Services",
		"Fund-Raising",
		"International Trade and Development",
		"Nonprofit Organization Management",
		"Philanthropy",
		"Program Development",
		"Think Tanks"
	],
	"Recreational":[
		"Computer Games",
		"Entertainment",
		"Events Services",
		"Food & Beverages",
		"Gambling & Casinos",
		"Hospitality",
		"Leisure, Travel & Tourism",
		"Recreational Facilities and Services",
		"Restaurants",
		"Sports"
	],
	"Service":[
		"Civic & Social Organization",
		"Environmental Services",
		"Individual & Family Services",
		"Information Services",
		"Libraries",
		"Religious Institutions",
		"Translation and Localization"
	],
	"Transportation	Airlines/Aviation":[
		"Logistics and Supply Chain",
		"Maritime",
		"Package/Freight Delivery",
		"Transportation/Trucking/Railroad",
		"Warehousing"
	]
}
	return {
		getIndustries: function(){
			return industries;
		}
	}

});

angular.module('discountdublin')
.factory('locations', function(){

var locations ={
	"Africa":[	"Algeria",
		"Cameroon",
		"Egypt",
		"Ghana",
		"Kenya",
		"Morocco",
		"Nigeria",
		"Tanzania",
		"Tunisia",
		"Uganda",
		"Zimbabwe",
		"South Africa"
	],
	"Asia":[
		"Bangladesh",
		"China",
		"Hong Kong",
		"India",
		"Indonesia",
		"Japan",
		"Korea",
		"Malaysia",
		"Nepal",
		"Philippines",
		"Singapore",
		"Sri Lanka",
		"Taiwan",
		"Thailand",
		"Vietnam"
	],
	"Europe":[
		"Austria",
		"Belgium",
		"Bulgaria",
		"Croatia",
		"Czech Republic",
		"Denmark",
		"Finland",
		"France",
		"Germany",
		"Greece",
		"Hungary",
		"Ireland",
		"Italy",
		"Lithuania",
		"Netherlands",
		"Norway",
		"Poland",
		"Portugal",
		"Romania",
		"Russian Federation",
		"Serbia",
		"Slovak Republic",
		"Spain",
		"Sweden",
		"Switzerland",
		"Turkey",
		"Ukraine",
		"United Kingdom"
	],
	"Latin America":[
		"Argentina",
		"Bolivia",
		"Brazil",
		"Chile",
	 	"Colombia",
	 	"Costa Rica",
	 	"Dominican Republic",
	 	"Ecuador",
	 	"Guatemala",
	 	"Mexico",
	 	"Panama",
	 	"Peru",
	 	"Puerto Rico",
	 	"Trinidad and Tobago",
	 	"Uruguay",
	 	"Venezuela"
	],
	"Middle East":[
		"Bahrain",
	 	"Iran",
	 	"Israel",
	 	"Jordan",
	 	"Kuwait",
	 	"Lebanon",
	 	"Pakistan",
	 	"Qatar",
	 	"Saudi Arabia",
	 	"Sultanate of Oman",
	 	"United Arab Emirates"
	],
	"North America":[
		"Canada",
	 	"United States"
	]
}

	return {
		getLocations: function(){
			return locations;
		}
	}

});

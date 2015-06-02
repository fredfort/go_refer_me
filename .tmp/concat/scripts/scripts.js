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
    'angular-md5',
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
        abstract:true,
        resolve:{
          linkedinProfile:['API','$state','User', function(API,$state,User){
            return API.me().then(function(me){
              User.updateUser(me.data);
              return me;
            }).catch(function(err){
              $state.go('login');
            });
          }]
        }
      })
      .state('login',{
        url:'/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('reinitPassword',{
        url:'/reinitPassword/:token',
        templateUrl: 'views/reinitPassword.html',
        controller: 'reinitPasswordCtrl'
      })
      .state('main.dashboard',{
        url:'dashboard',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        resolve:{
          linkedinProfile:['User','$state', function(User, $state){
            return User.getUser();
          }],
          companies:['API', function(API){
            return API.searchCompanies().then(function(companies){
              return companies.data;
            });
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
      .state('main.searchSettings',{
        url:'searchSettings',
        controller: 'DashboardCtrl',
        templateUrl: 'views/searchSettings.html',
         resolve:{
          linkedinProfile:['User','$state', function(User, $state){
            return User.getUser();
          }],
          companies:['API', function(API){
            return API.searchCompanies().then(function(companies){
              return companies.data;
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
      .state('main.friendsRequest',{
        url:'friends',
        templateUrl: 'views/friendsRequest.html',
        controller: 'FriendRequestCtrl',
        resolve:{
          me:['API', function(API){
            return API.me().then(function(me){
              return me;
            });
          }],
          invitations:['API','me', function(API, me){
            var ids = me.data.invitationsReceived;
            return API.searchUsersByIds(ids).then(function(people){
              return people.data;
            });
          }],
           friends:['API','me', function(API, me){
            var ids = me.data.friends;
            return API.searchUsersByIds(ids).then(function(people){
              return people.data;
            });
          }],
           invitationsSent:['API','me', function(API, me){
            var ids = me.data.invitationsSent;
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
  .controller('MainCtrl',['$scope','$state','$interval','Linkedin','User','industries','locations','functions','languages','API','linkedinProfile',
      function ($scope,$state,$interval, Linkedin, User,industries, locations, functions, languages, API,linkedinProfile) {
1
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

    $scope.getUser = function(){
      API.me().then(function(user){
        $scope.user.invitationsReceived = user.data.invitationsReceived;
      });
    };
    
    $scope.user            = linkedinProfile.data;  
    $scope.industries      = industries.getIndustries();
    $scope.sub_industries  = $scope.getIndustriesArray();

    $scope.locations       = locations.getLocations();
    $scope.countries       = $scope.getLocationArray();

    $scope.functions       = functions.getFunctions();
    $scope.languages       = languages.getLanguages();

    $interval($scope.getUser, 1000 * 30);

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
		API.sendInvitation(profile).then(function(user){
			debugger;
			toaster.pop('success','An invitation has been sent');
			$scope.next();
		}).catch(function(err){
			debugger;
		});
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
  .controller('FriendRequestCtrl',['$scope','$state','API', 'invitations', 'friends', 'invitationsSent', 'toaster',
      function ($scope,$state, API, invitations, friends,invitationsSent, toaster) {

    $scope.invitations     = invitations;
    $scope.friends         = friends;
    $scope.invitationsSent = invitationsSent;

    $scope.acceptInvitation = function(user){
    	API.acceptInvitation(user).then(function(res){
    		$scope.friends.push(user);
    		$scope.invitations = _.without($scope.invitations, user);
        $scope.user.invitationsReceived = $scope.invitations;
    		toaster.pop('info', 'Invitation accepted');
    	});
    };

     $scope.denyInvitation = function(user){
     	API.denyInvitation(user).then(function(res){
    		$scope.invitations = _.without($scope.invitations, user);
        $scope.user.invitationsReceived = $scope.invitations; 
    		toaster.pop('info', 'Invitation denied');
    	});
    };

     $scope.unFriend = function(user){
      API.unFriend(user).then(function(res){
        $scope.friends = _.without($scope.friends, user);
        toaster.pop('info', 'User unfriended');
      });
    };

    $scope.cancelInvitation = function(user){
      API.cancelInvitation(user).then(function(res){
        $scope.invitationsSent = _.without($scope.invitationsSent, user);
        toaster.pop('info', 'User unfriended');
      });
    };

  }]);

'use strict';


angular.module('discountdublin')
  .controller('LoginCtrl',['$scope','$rootScope','$state','$modal','API','User','Linkedin', 'md5','toaster',
    function ($scope,$rootScope,$state,$modal, API,User, Linkedin, md5, toaster) {

    $scope.formValid = true;
    var modalInstance = null;

    $scope.getJob = function(linkedinJob){
      return {
        id: linkedinJob.id,
        company:linkedinJob.company.name,
        title:linkedinJob.title,
        summary: linkedinJob.summary
      };
    };

    $scope.linkedInLogin = function(){
      Linkedin.authorization().then(function(data){
        Linkedin.getUserInformation().then(function(user){
          user.currentJob = $scope.getJob(user.positions.values[0]);
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
    };

    $scope.signUpPopUp = function() {
      $rootScope.modalInstance = $modal.open({
        animation: true,
        size:'md',
        templateUrl: 'views/modal/signin.html',
        controller: 'LoginCtrl'
      });
    };

    $scope.signin = function(){
      $scope.checked = true;
      if($scope.firstName && $scope.lastName && $scope.company  && $scope.title && $scope.emailAddress 
                          && $scope.password && $scope.category && ($scope.password === $scope.password_confirm)){
        $scope.formValid = true;
        var user = {
          firstName: $scope.firstName,
          lastName : $scope.lastName,
          currentJob : {
            company: $scope.company,
            title:   $scope.title,
          }, 
          category     : $scope.category,
          company      : $scope.company,
          title        : $scope.title,
          emailAddress : $scope.emailAddress,
          password     : md5.createHash($scope.password)
        };
        API.createUser(user).then(function(userToken){
            User.setUser(userToken);
            $state.go('main.dashboard');
            $rootScope.modalInstance.close();
          }).catch(function(err){
            alert('User creation error '+err);
          });
      }else{
        $scope.formValid = false;
      }
    };

    $scope.login = function(){
      $scope.checked = true;
      $scope.wrongCredential = false;
      if($scope.emailAddress && $scope.password){
        $scope.formValid = true;
        API.login($scope.emailAddress, md5.createHash($scope.password)).then(function(userToken){
         if(userToken.data && userToken.data.user){//if login successful
            User.setUser(userToken);
            $state.go('main.dashboard');
            $rootScope.modalInstance.close();
         }else{
          $scope.wrongCredential = true;
         }
        });
      }else{
        $scope.formValid = false;
      }
    };

    $scope.reinitPassword = function(){
      API.reinitPassword($scope.emailAddress).then(function(res){
        toaster.pop('success','An email has been sent to '+$scope.emailAddress);
      });
    };

  }]);

'use strict';

angular.module('discountdublin')
.controller('DashboardCtrl',['$scope','$state','linkedinProfile', 'API','User','companies', 'toaster', function ($scope,$state,linkedinProfile, API,User, companies, toaster) { 
	if(!linkedinProfile){
		$state.go('login');//TODO dirty change that
	}

	$scope.linkedinProfile = linkedinProfile;
	if(!$scope.linkedinProfile.search){
		$scope.linkedinProfile.search = { industries:[], locations:[], functions:[], languages:[]};
	}

	if(!$scope.linkedinProfile.wants){
		$scope.linkedinProfile.wants = { industries:[], locations:[], companies:[], functions:[], languages:[]};
	}

	$scope.companiesArray = _.map(companies, function(company){
		if(company.currentJob){
			return company.currentJob.company;
		}
	});

	//Industries
	$scope.addIndustry = function(){
		if($scope.industry && $scope.industry.length){
			linkedinProfile.search.industries.push($scope.industry);
			$scope.industry = '';
			$scope.saveUserProfile($scope.linkedinProfile);
		}
	};

	$scope.removeIndustry = function(industry){
		linkedinProfile.search.industries = _.without(linkedinProfile.search.industries, industry);
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	//Location
	$scope.addLocation = function(){
		if($scope.location && $scope.location.length){
			linkedinProfile.search.locations.push($scope.location);
			$scope.location = '';
			$scope.saveUserProfile($scope.linkedinProfile);
		}
	};

	$scope.removeLocation = function(location){
		linkedinProfile.search.locations = _.without(linkedinProfile.search.locations, location);
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	//Function
	$scope.addFunction = function(){
		if($scope.function && $scope.function.length){
			if(!linkedinProfile.search.functions){
				linkedinProfile.search.functions = [];
			}
			linkedinProfile.search.functions.push($scope.function);
			$scope.function = '';
			$scope.saveUserProfile($scope.linkedinProfile);
		}
	};

	$scope.removeFunction = function(myfunction){
		linkedinProfile.search.functions = _.without(linkedinProfile.search.functions, myfunction);
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	//Function
	$scope.addLanguage = function(){
		if($scope.language && $scope.language.length){
			if(!linkedinProfile.search.languages){
				linkedinProfile.search.languages = [];
			}
			linkedinProfile.search.languages.push($scope.language);
			$scope.language = '';
			$scope.saveUserProfile($scope.linkedinProfile);
		}
	};

	$scope.removeLanguage = function(language){
		linkedinProfile.search.languages = _.without(linkedinProfile.search.languages, language);
		$scope.saveUserProfile($scope.linkedinProfile);
	};


	/*Job seeker*/
	$scope.addLocationWish = function(){
		if($scope.wants_location && $scope.wants_location.length){
			linkedinProfile.wants.locations.push($scope.wants_location);
			$scope.wants_location = '';
			$scope.saveUserProfile($scope.linkedinProfile);
		}
	};

	$scope.removeLocationWish = function(location){
		linkedinProfile.wants.locations = _.without(linkedinProfile.wants.locations, location);
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.addCompanyWish = function(){
		if($scope.wants_company && $scope.wants_company.length){
			linkedinProfile.wants.companies.push($scope.wants_company);
			$scope.wants_company = '';
			$scope.saveUserProfile($scope.linkedinProfile);
		}
	};

	$scope.removeCompanyWish = function(company){
		linkedinProfile.wants.companies = _.without(linkedinProfile.wants.companies, company);
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.addIndustryWish = function(){
		if($scope.wants_company && $scope.wants_company.length){
			linkedinProfile.wants.industries.push($scope.wants_industry);
			$scope.wants_company = '';
			$scope.saveUserProfile($scope.linkedinProfile);
		}
	};

	$scope.removeIndustryWish = function(industry){
		linkedinProfile.wants.industries = _.without(linkedinProfile.wants.industries, industry);
		$scope.saveUserProfile($scope.linkedinProfile);
	};


	$scope.addFunctionWish = function(){
		if($scope.wants_function && $scope.wants_function.length){
			if(!linkedinProfile.wants.functions){
				linkedinProfile.wants.functions = [];
			}
			linkedinProfile.wants.functions.push($scope.wants_function);
			$scope.wants_function = '';
			$scope.saveUserProfile($scope.linkedinProfile);
		}
	};

	$scope.removeFunctionWish = function(myfunction){
		linkedinProfile.wants.functions = _.without(linkedinProfile.wants.functions, myfunction);
		$scope.saveUserProfile($scope.linkedinProfile);
	};


	$scope.addLanguageWish = function(){
		if($scope.wants_language && $scope.wants_language.length){
			if(!linkedinProfile.wants.languages){
				linkedinProfile.wants.languages = [];
			}
			linkedinProfile.wants.languages.push($scope.wants_language);
			$scope.wants_language = '';
			$scope.saveUserProfile($scope.linkedinProfile);
		}
	};

	$scope.removeLanguageWish = function(language){
		linkedinProfile.wants.languages = _.without(linkedinProfile.wants.languages, language);
		$scope.saveUserProfile($scope.linkedinProfile);
	};

	$scope.searchJobSeeker = function(){
		$state.go('main.search');
	};

	$scope.searchReferer = function(){;
		$state.go('main.search');
	};

}]);


angular.module('discountdublin')
.controller('CreditCtrl.js', function(){
	var embeddedPPFlow = new PAYPAL.apps.DGFlow({trigger: 'submitBtn'});

})
angular.module('discountdublin')

.controller('reinitPasswordCtrl',['$scope','$state','API','md5','toaster','$stateParams',function ($scope,$state,API,md5,toaster,$stateParams) {

	$scope.reinitPassword = function(){
		if($scope.password && $scope.password === $scope.password_confirm){
			API.changePassword(md5.createHash($scope.password), $stateParams.token).then(function(success){
				$scope.errorPassword = false;
				toaster.pop("success","Your password has been changed");
				$state.go('login');
			}).catch(function(err){
				toaster.pop('error', "Your token has expired, do the 'i forgot my password' process again");
			});
		}else{
			$scope.errorPassword = true;
		}
	}

}]);
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
angular.module('discountdublin').factory('HttpInterceptor',['$window','$q','User', function($window,$q, User) {
    var sessionInjector = {

    	request: function(config){
        if(!config.headers['x-access-token']){
          if(User.hasToken()){
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
			var url = 'people/~:(id,positions,specialties,email-address,summary,first-name,last-name,headline,siteStandardProfileRequest,industry,location,skills,picture-url)?format=json';
			IN.API.Raw(url).method('GET').body().result(function(data){
				debugger;
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

angular.module('discountdublin')
.factory('functions', function(){
	var getFunctions = function(){
		return [
			'Academics',
			'Accounting',
			'Administrative',
			'Business development',
			'Buyer',
			'Consultant',
			'Creative',
			'Engineering',
			'Entrepreneur',
			'Finance',
			'Human resources',
			'Information technology',
			'Legal',
			'Marketing',
			'Medical',
			'Operations',
			'Product',
			'Public relations',
			'Real estate',
			'Sales',
			'Support'
		]
	}

	return {
		getFunctions : getFunctions
	}
});
angular.module('discountdublin')
.factory('languages', function(){

	var languages = [
		'Afar',
		'Afrikaans',
		'Aja-Gbe',
		'Akan (Akuapem Twi, Ashante Twi, Fante)',
		'Albanian',
		'Amharic',
		'Anii',
		'Armenian',
		'Aymara',
		'Azerbaijani',
		'Balanta',
		'Bambara',
		'Bariba',
		'Bassari',
		'Bedik',
		'Belarusian',
		'Bengali',
		'Berber',
		'Biali',
		'Bislama',
		'Boko',
		'Bomuv',
		'Bosnian',
		'Bozo',
		'Buduma',
		'Bulgarian',
		'Burmese',
		'Cantonese',
		'Catalan',
		'Chinese, Mandarin',
		'Chichewa',
		'Chirbawe (Sena)',
		'Chokwe',
		'Croatian',
		'Czech',
		'Dagaare',
		'Dagbani',
		'Dangme',
		'Danish',
		'Dari',
		'Dendi',
		'Dhivehi',
		'Dioula',
		'Dogon',
		'Dutch',
		'Dzongkha',
		'English',
		'Estonian',
		'Ewe-Gbe',
		'Fijian',
		'Filipino',
		'Finnish',
		'Fon-Gbe',
		'Foodo',
		'French',
		'Fula',
		'Ga',
		'Gbe',
		'Gen-Gbe',
		'Georgian',
		'German',
		'Gonja',
		'Gourmanché',
		'Greek',
		'Guaraní',
		'Gujarati',
		'Haitian Creole',
		'Hassaniya',
		'Hausa',
		'Hebrew',
		'Hindi',
		'Hiri Motu',
		'Hungarian',
		'Igbo',
		'Icelandic',
		'Indonesian',
		'Irish',
		'Italian',
		'Japanese',
		'Jola',
		'Kabye',
		'Kalanga',
		'Kanuri',
		'Kasem',
		'Kazakh',
		'Khmer',
		'Kikongo-Kituba',
		'Kimbundu',
		'Kinyarwanda',
		'Kirundi',
		'Kissi',
		'Khoisan',
		'Korean',
		'Kpelle',
		'Kurdish',
		'Kwanyama',
		'Kyrgyz',
		'Lao',
		'Latin',
		'Latvian',
		'Lingala',
		'Lithuanian',
		'Lukpa',
		'Luxembourgish',
		'Macedonian',
		'Malagasy',
		'Malay',
		'Malinke',
		'Maltese',
		'Mamara',
		'Manding (Mandinka, Malinke)',
		'Mandinka',
		'Mandjak',
		'Mankanya',
		'Manx Gaelic',
		'Māori',
		'Marshallese',
		'Mbelime',
		'Moldovan',
		'Mongolian',
		'Montenegrin',
		'Mossi',
		'Nambya',
		'Nateni',
		'Ndau',
		'Nepali',
		'New Zealand Sign Language',
		'Noon',
		'Northern Sotho',
		'Norwegian',
		'Nzema',
		'Oniyan',
		'Ossetian',
		'Punjabi',
		'Papiamento',
		'Pashto',
		'Persian',
		'Polish',
		'Portuguese',
		'Quechua',
		'Romanian',
		'Romansh',
		'Russian',
		'Safen',
		'Sango',
		'Saraiki',
		'Sena',
		'Serbian',
		'Serer',
		'Seychellois Creole',
		'Shona',
		'Sinhala',
		'Slovak',
		'Slovene',
		'Somali',
		'Songhay-Zarma',
		'Soninke',
		'Sotho',
		'Spanish',
		'Susu',
		'Swahili',
		'Swati',
		'Swedish',
		'Syenara',
		'Tajik',
		'Tagalog',
		'Tamasheq',
		'Tamil',
		'Tammari',
		'Tasawaq',
		'Tebu',
		'Telugu',
		'Tetum',
		'Thai',
		'Tigrinya',
		'Tok Pisin',
		'Toma',
		'Tonga',
		'Tshiluba',
		'Tsonga',
		'Tswana',
		'Turkish',
		'Turkmen',
		'Ukrainian',
		'Umbundu',
		'Urdu',
		'Uzbek',
		'Venda',
		'Vietnamese',
		'Waama',
		'Waci-Gbe',
		'Wamey',
		'Welsh',
		'Wolof',
		'Xhosa',
		'Xwela-Gbe',
		'Yobe',
		'Yom',
		'Yoruba',
		'Zimbabwean sign language',
		'Zulu'
	]

	var getLanguages = function(){
		return languages;
	};

	return {
		getLanguages:getLanguages
	}
})
var mod = angular.module('discountdublin');

mod.filter('categoryFilter', function() {
	var returnedString ='';
  return function(input) {
     switch(input) {
      case "referer":
         returnedString = "Referer";
         break;
      case "looking_for_job":
         returnedString = "Job seeker";
         break;
   }
   return returnedString;
  };
});
'use strict';

/**
 * @ngdoc overview
 * @name discountdublin
 * @description
 * # discountdublin
 *
 * Main module of the application.
 */
var app = angular
  .module('discountdublin', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ui.router',
    'ui.select',
    'ngSanitize',
    'ngTouch',
    'toaster',
    'angular-md5',
    'angularMoment',
    'ui.bootstrap',
    'pageslide-directive'
  ]);

  app.config(function ($stateProvider, $urlRouterProvider,$httpProvider) {

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
          }],
          companies:['API', function(API){
            return API.searchCompanies().then(function(companies){
              return companies.data;
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
      .state('activateAccount',{
        url:'/activateAccount?access_token',
        templateUrl: 'views/activateAccount.html',
        resolve:{
          active:['API','$stateParams', function(API,$stateParams){
            return API.activateAccount($stateParams.access_token);
          }]
        }
      })
      .state('main.dashboard',{
        url:'dashboard',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        resolve:{
          usersSearched:['API', 'User', function(API,User){
            return API.searchUsers(null, 1).then(function(people){
              return people.data;
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
      .state('main.filter',{
        url:'filters/:filterType',
        templateUrl: 'views/filter.html',
        controller: 'FilterCtrl',
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
            var ids = _.map(me.data.friends, function(friend){
              return friend.id;
            });
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
      .state('main.settings',{
        url:'settings',
        controller:'SettingsCtrl',
        templateUrl: 'views/settings.html',
        resolve:{
          referer:[ 'API','linkedinProfile',function(API,linkedinProfile){
            if(linkedinProfile.data.referer){
              return API.searchUsersByIds([linkedinProfile.data.referer]).then(function(people){
                return people.data[0];
              });
            }else{
              return null;
            }
          }]
        }
      })
      .state('main.credit',{
        url:'credit?paymentId&token&PayerID?qte',
        templateUrl: 'views/credit.html',
        controller:'CreditCtrl'
      })
       .state('info',{
        url:'/info',
        templateUrl: 'views/info.html',
      })
      .state('info.blog',{
        url:'/blog',
        templateUrl: 'views/blog.html',
      })
      .state('info.about',{
        url:'/about',
        templateUrl: 'views/about.html',
      })
      .state('info.contact',{
        url:'/contact',
        templateUrl: 'views/contact.html',
      })
       .state('main.faq',{
        url:'faq',
        templateUrl: 'views/faq.html',
        controller:'FaqCtrl',
        resolve:{
          questions:['$http', function($http){
              return $http.get('assets/questions.json');
          }]
        }
      });
  });

  app.run(['$rootScope','toaster', function ($rootScope,toaster){

      $rootScope.isLoading =  true;

      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $rootScope.currentState = toState;
        $rootScope.isLoading =  true;
      })

      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
        $rootScope.currentState = toState;
        $rootScope.isLoading =  false;
      });

      $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
        $rootScope.isLoading =  false;
        toaster.pop('error',error);
      });
  }]);
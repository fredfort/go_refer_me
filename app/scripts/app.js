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
  .config(function ($stateProvider, $urlRouterProvider,$httpProvider) {

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
      .state('main.info',{
        url:'info',
        templateUrl: 'views/info.html'
      })
      .state('main.credit',{
        url:'credit',
        templateUrl: 'views/credit.html',
        controller:'CreditController'
      });
  });
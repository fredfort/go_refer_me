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
  });
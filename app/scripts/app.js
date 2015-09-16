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
    'ui.select',
    'ngSanitize',
    'ngTouch',
    'toaster',
    'angular-md5',
    'angularMoment',
    'ui.bootstrap',
    'pageslide-directive'
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
        templateUrl: 'views/settings.html'
      })
      .state('main.credit',{
        url:'credit?paymentId&token&PayerID?qte',
        templateUrl: 'views/credit.html',
        controller:'CreditCtrl'
      });
  });
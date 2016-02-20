'use strict';

angular.module('discountdublin')
  .controller('MainCtrl',['$rootScope','$scope','$state','$interval','toaster','User','industries','locations','functions','languages','API','linkedinProfile','companies',
    function ($rootScope, $scope,$state,$interval, toaster, User,industries, locations, functions, languages, API,linkedinProfile,companies) {
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

    $scope.goToConnection = function(){
      if($state.$current.self.name === 'main.friendsRequest'){
        $state.reload();
      }else{
        $state.go('main.friendsRequest');
      }
      $scope.collapse = true;
    };

    $scope.logout = function(){
        User.logout();
    };
    
    $scope.user            = linkedinProfile.data;  
    $scope.industries      = industries.getIndustries();
    $scope.sub_industries  = $scope.getIndustriesArray();

    $scope.locations       = locations.getLocations();
    $scope.countries       = $scope.getLocationArray();

    $scope.functions       = functions.getFunctions();
    $scope.languages       = languages.getLanguages();
    $scope.companies       = companies;


   User.setFetchUserInterval($scope.getUser);


      //watch any change on the user profile and save them in database
  $scope.$watch('user', function(newValue, oldValue){
    if(newValue && oldValue && newValue !== oldValue){
      $scope.saveUserProfile($scope.user);
    }
  }, true);

  $rootScope.currentState = $state.$current.self;

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    $rootScope.currentState = toState;
    $scope.isLoading =  true;
  })

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
    $rootScope.currentState = toState;
    $scope.isLoading =  false;
  });

  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
    $scope.isLoading =  false;
    toaster.pop('error',error);
  });


  }]);

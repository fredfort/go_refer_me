'use strict';

angular.module('discountdublin')
  .controller('FriendRequestCtrl',['$scope','$state','API', 'invitations', 'friends', 'invitationsSent', 'toaster',
      function ($scope,$state, API, invitations, friends,invitationsSent, toaster) {

    $scope.invitations     = invitations;
    $scope.friends         = friends;

    angular.forEach($scope.friends, function(friends){//map every friend with the personal frienship details
      angular.forEach($scope.user.friends, function(friend){
        if(friends._id === friend.id){
         friends.date_connection  = friend.date_connection;
         friends.status  = friend.status;
         friends.last_update  = friend.last_update;
        }
      });
    });

    $scope.invitationsSent = invitationsSent;

    $scope.acceptInvitation = function(user){
    	API.acceptInvitation(user).then(function(res){
    		$scope.friends = res.data.friends;
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

    $scope.changeFriendShipStatus = function(user){
      API.changeFriendShipStatus(user)
    }
  }]);
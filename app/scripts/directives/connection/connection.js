angular.module('discountdublin')
.directive('connection', ['$state','API', 'toaster', 'User', function ($state,API,toaster,User) {
	return {
		restrict: 'A',
		scope:{
			userProfile:'=',//connected user
			users:'=',//possible connections
			saveFct:'&'
		},
		templateUrl:'scripts/directives/connection/connection.html',
		link: function (scope, iElement, iAttrs) {

			scope.isAlreadySaved = function(linkedinProfile){
				return scope.userProfile.saved.indexOf(linkedinProfile._id) !== -1;
			};

			scope.hasSentInvitation = function(linkedinProfile){
				return scope.userProfile.invitationsSent.indexOf(linkedinProfile._id) !== -1;
			};

			scope.isTrashed  = function(linkedinProfile){
				return scope.userProfile.trash.indexOf(linkedinProfile._id) !== -1;
			};


			scope.trashProfile = function(profile){
				if(!scope.userProfile.trash){
					scope.userProfile.trash = [];
				}
				if(!scope.isTrashed(profile)){
					scope.userProfile.trash.push(profile._id);
					scope.saveFct(scope.userProfile);
				}
			};

			scope.saveProfile = function(profile){
				if(!scope.isAlreadySaved(profile)){
					if(!scope.userProfile.saved){
						scope.userProfile.saved = [];
					}
					scope.userProfile.saved.push(profile._id);
				}else{
					//unsave
					scope.userProfile.saved = _.without(scope.userProfile.saved, profile._id);
				}
				scope.saveFct(scope.userProfile);
			};

			scope.contactProfile = function(profile){
				if(!scope.hasSentInvitation(profile)){
					API.sendInvitation(profile).then(function(user){
						scope.userProfile.invitationsSent.push(profile._id);
						toaster.pop('success','An invitation has been sent');
					}).catch(function(err){
						debugger;
					});
				}else{
					toaster.pop('info','An invitation has already been sent to this profile');
				}
			};

			scope.$watch('userProfile.category',function(newCategory, oldCategory){
				if(newCategory !== oldCategory){
					refreshUsers(newCategory);
				}
			});

			var refreshUsers = function(category){
				scope.users = [];
            	API.searchUsers(category).then(function(people){
              		scope.users = people.data;
            	});
			}
		}
	};
}])
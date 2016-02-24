angular.module('discountdublin')
.directive('connection', ['$state','$timeout', 'API', 'toaster', 'User', function ($state,$timeout,API,toaster,User) {
	return {
		restrict: 'A',
		scope:{
			userProfile:'=',//connected user
			users:'=',//possible connections
			saveFct:'&',
			hasFilter:'&'
		},
		templateUrl:'scripts/directives/connection/connection.html',
		link: function (scope, iElement, iAttrs) {
			var maxElemByPage = 20;
			scope.page =1;
			scope.hasNext = (scope.users.length === maxElemByPage);
			scope.hasPrevious = (scope.page != 1);

			var friendsId = _.map(scope.userProfile.friends, function(friend){
				return friend.id;
			});

			scope.hasVisibleConnection = function(){
				var hasVisibleconnection = false;
				_.each(scope.users, function(user){
					if((!scope.isFriend(user) && !scope.userProfile.onlyShowSavedProfile) || (scope.isAlreadySaved(user) && !scope.isTrashed(user))){
						hasVisibleconnection = true;
						return false;//break the loop
					}
				});
				return hasVisibleconnection;
			}

			scope.isFriend = function(user){
				return friendsId.indexOf(user._id) !== -1;
			}

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

			scope.clearFilter = function(){
				if(scope.userProfile && scope.userProfile.category === 'looking_for_job'){
					var wants = scope.userProfile.wants;
					wants.companies  = [];
					wants.experience = [];
					wants.functions  = [];
					wants.industries = [];
					wants.languages  = [];
					wants.locations  = [scope.userProfile.location.name];
					
				}else if(scope.userProfile && scope.userProfile.category === 'referer'){
					var search =scope.userProfile.search;
					search.experience = [];
					search.functions  = [];
					search.industries = [];
					search.languages  = [];
					search.locations  = [scope.userProfile.location.name];
				}
				$timeout(function(){refreshUsers(null,scope.page)}, 500);//AWFUL
			};

			scope.$watch('userProfile.category',function(newCategory, oldCategory){
				if(newCategory !== oldCategory){
					refreshUsers(newCategory,1);
				}
			});

			scope.previousPage = function(){
				scope.page--;
				refreshUsers(null,scope.page);
			};

			scope.nextPage = function(){
				scope.page++;
				refreshUsers(null,scope.page);
			}

			var refreshUsers = function(category,page){
				scope.users = [];
            	API.searchUsers(category,page).then(function(people){
              		scope.users = people.data;
              		scope.hasNext = (scope.users.length === maxElemByPage);
              		scope.hasPrevious = (scope.page != 1);
            	});
			}
		}
	};
}])
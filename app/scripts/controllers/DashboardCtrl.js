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
	$scope.addExperience = function(){
		if($scope.experience && $scope.experience.length){
			if(!linkedinProfile.search.experience){
				linkedinProfile.search.experience = [];
			}
			if(linkedinProfile.search.experience.indexOf($scope.experience) === -1){
				linkedinProfile.search.experience.push($scope.experience);
			}
			$scope.experience = '';

			$scope.saveUserProfile($scope.linkedinProfile);
		}
	};

	$scope.removeExperience = function(experience){
		linkedinProfile.search.experience = _.without(linkedinProfile.search.experience, experience);
		$scope.saveUserProfile($scope.linkedinProfile);
	};

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

	$scope.addExperienceWish = function(){
		if($scope.wants_experience && $scope.wants_experience.length){
			if(!linkedinProfile.wants.experience){
				linkedinProfile.wants.experience = [];
			}
			if(linkedinProfile.wants.experience.indexOf($scope.wants_experience) === -1){
				linkedinProfile.wants.experience.push($scope.wants_experience);
			}
			$scope.wants_experience = '';

			$scope.saveUserProfile($scope.linkedinProfile);
		}
	};

	$scope.removeExperienceWish = function(experience){
		linkedinProfile.wants.experience = _.without(linkedinProfile.wants.experience, experience);
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


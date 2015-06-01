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
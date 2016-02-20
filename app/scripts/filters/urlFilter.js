var mod = angular.module('discountdublin');

mod.filter('urlFilter', function() {
	var returnedString ='';
  return function(input) {
     switch(input) {
      case "main.dashboard":
         returnedString = "Home &amp; Search";
         break;
      case "main.settings":
         returnedString = "Settings";
         break;
      case "main.friendsRequest":
         returnedString = "Connections";
         break;
      case "main.credit":
         returnedString = "Credit";
         break;
       case "main.filter":
         returnedString = "Filter By";
         break;
   }
   return returnedString;
  };
});




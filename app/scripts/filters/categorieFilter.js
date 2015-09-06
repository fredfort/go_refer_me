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

mod.filter('statusFilter', function() {
  var returnedString ='';
  return function(input) {
     switch(input) {
      case "cv_granted":
         returnedString = "CV Granted";
         break;
      case "cv_forwarded":
         returnedString = "CV Forwarded";
         break;
      case "hired":
         returnedString = "Hired";
         break;
      case "not_hired":
         returnedString = "Not hired";
         break;
      case "connected":
         returnedString = "Connected";
         break;
   }
   return returnedString;
  };
});

mod.filter('firstLetter', function() {
  var returnedString ='';
  return function(input) {
     if(input && input.length){
       returnedString = input.charAt(0)+".";
     }
     return returnedString;
   }
});


mod.filter('plurial', function() {
  return function(input) {
     if(input && input.length){
       return input+"s";
     }
    
   }
});

mod.filter('arrayToString', function() {
  return function(array) {
     if(array && array.length){
      var string = '';
      array.forEach(function(item,index){
        string += item;
        if(index < array.length -1){
          string +=', ';
        }else{
          string += '.';
        }
      });
      return string;
     }
   }
});


mod.filter('firstLetterUpperCase', function() {
  return function(input) {
     if(input && input.length){
       return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase()
     }
   }
});


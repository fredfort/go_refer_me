angular.module('discountdublin')
.factory('locations', function(){

var locations ={
	"Africa":[	"Algeria",
		"Cameroon",
		"Egypt",
		"Ghana",
		"Kenya",
		"Morocco",
		"Nigeria",
		"Tanzania",
		"Tunisia",
		"Uganda",
		"Zimbabwe",
		"South Africa"
	],
	"Asia":[
		"Bangladesh",
		"China",
		"Hong Kong",
		"India",
		"Indonesia",
		"Japan",
		"Korea",
		"Malaysia",
		"Nepal",
		"Philippines",
		"Singapore",
		"Sri Lanka",
		"Taiwan",
		"Thailand",
		"Vietnam"
	],
	"Europe":[
		"Austria",
		"Belgium",
		"Bulgaria",
		"Croatia",
		"Czech Republic",
		"Denmark",
		"Finland",
		"France",
		"Germany",
		"Greece",
		"Hungary",
		"Ireland",
		"Italy",
		"Lithuania",
		"Netherlands",
		"Norway",
		"Poland",
		"Portugal",
		"Romania",
		"Russian Federation",
		"Serbia",
		"Slovak Republic",
		"Spain",
		"Sweden",
		"Switzerland",
		"Turkey",
		"Ukraine",
		"United Kingdom"
	],
	"Latin America":[
		"Argentina",
		"Bolivia",
		"Brazil",
		"Chile",
	 	"Colombia",
	 	"Costa Rica",
	 	"Dominican Republic",
	 	"Ecuador",
	 	"Guatemala",
	 	"Mexico",
	 	"Panama",
	 	"Peru",
	 	"Puerto Rico",
	 	"Trinidad and Tobago",
	 	"Uruguay",
	 	"Venezuela"
	],
	"Middle East":[
		"Bahrain",
	 	"Iran",
	 	"Israel",
	 	"Jordan",
	 	"Kuwait",
	 	"Lebanon",
	 	"Pakistan",
	 	"Qatar",
	 	"Saudi Arabia",
	 	"Sultanate of Oman",
	 	"United Arab Emirates"
	],
	"North America":[
		"Canada",
	 	"United States"
	]
}

	return {
		getLocations: function(){
			return locations;
		}
	}

});

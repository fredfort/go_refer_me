angular.module('discountdublin')
.factory('industries', function(){

var industries = 
{
	"Agriculture":[
		"Dairy",
		"Farming",
		"Fishery",
		"Ranching"
	],
	"Arts":[
		"Arts and Crafts",
		"Design",
		"Fine Art",
		"Graphic Design",
		"Motion Pictures and Film",
		"Museums and Institutions",	
		"Music",
		"Performing Arts",
		"Photography"
	],
	"Construction":[
		"Architecture & Planning",
		"Building Materials",
		"Civil Engineering",
		"Construction"
	],
	"Consumer Goods":[
		"Apparel & Fashion",
		"Consumer Electronics", 
		"Consumer Goods", 
		"Cosmetics", 
		"Food Production", 
		"Furniture", 
		"Import and Export", 
		"Luxury Goods & Jewelry", 
		"Retail", 
		"Sporting Goods", 
		"Supermarkets", 
		"Tobacco", 
		"Wholesale", 
		"Wine and Spirits"
	],
	"Corporate":[
		"Business Supplies and Equipment",
		"Facilities Services" , 
		"Human Resources", 
		"Management Consulting", 
		"Market Research", 	
		"Marketing and Advertising", 
		"Outsourcing/Offshoring", 	
		"Professional Training & Coaching",
		"Public Relations and Communications",
		"Security and Investigations", 
		"Staffing and Recruiting"
	],
	"Educational":["E-Learning",
		"Education Management",
		"Higher Education",
		"Primary/Secondary Education",
		"Research"
	],
	"Finance Accounting":[
		"Banking",
		"Capital Markets",
		"Commercial Real Estate",
		"Financial Services",
		"Insurance",
		"Investment Banking",
		"Investment Management",
		"Real Estate",
		"Venture Capital & Private Equity"
	],
	"Government	Executive Office":[
		"Government Administration",
		"Government Relations",
		"International Affairs",
		"Judiciary",
		"Law Enforcement",
		"Legislative Office",
		"Military",
		"Political Organization",
		"Public Policy",
		"Public Safety"
	],
	"High Tech	Computer & Network Security":[
	 	"Computer Hardware",
	 	"Computer Networking",
	 	"Computer Software",
	 	"Defense & Space",
	 	"Information Technology and Services",
	 	"Internet",
	 	"Nanotechnology",
	 	"Semiconductors",
	 	"Telecommunications",
	 	"Wireless"
	 ],
	"Legal":[
		"Alternative Dispute Resolution",
		"Law Practice",
		"Legal Services"
	],
	"Manufacturing	Automotive":[
		"Aviation & Aerospace",
		"Chemicals",
		"Electrical/Electronic Manufacturing",
		"Glass, Ceramics & Concrete",
		"Industrial Automation",
		"Machinery",
		"Mechanical or Industrial Engineering",
		"Mining & Metals",
		"Oil & Energy",
		"Packaging and Containers",
		"Paper & Forest Products",
		"Plastics",
		"Railroad Manufacture",
		"Renewables & Environment",
		"Shipbuilding",
		"Textiles",
		"Utilities"
	],
	"Media	Animation":[
		"Broadcast Media",
		"Media Production",
		"Newspapers",
		"Online Media",
		"Printing",
		"Publishing",
		"Writing and Editing"
	],
	"Medical":[
		"Alternative Medicine",
		"Biotechnology",
		"Health, Wellness and Fitness",
		"Hospital & Health Care",
		"Medical Devices",
		"Medical Practice",
		"Mental Health Care",
		"Pharmaceuticals",
		"Veterinary"
	],
	"Non-profit":[	
		"Consumer Services",
		"Fund-Raising",
		"International Trade and Development",
		"Nonprofit Organization Management",
		"Philanthropy",
		"Program Development",
		"Think Tanks"
	],
	"Recreational":[
		"Computer Games",
		"Entertainment",
		"Events Services",
		"Food & Beverages",
		"Gambling & Casinos",
		"Hospitality",
		"Leisure, Travel & Tourism",
		"Recreational Facilities and Services",
		"Restaurants",
		"Sports"
	],
	"Service":[
		"Civic & Social Organization",
		"Environmental Services",
		"Individual & Family Services",
		"Information Services",
		"Libraries",
		"Religious Institutions",
		"Translation and Localization"
	],
	"Transportation	Airlines/Aviation":[
		"Logistics and Supply Chain",
		"Maritime",
		"Package/Freight Delivery",
		"Transportation/Trucking/Railroad",
		"Warehousing"
	]
}
	return {
		getIndustries: function(){
			return industries;
		}
	}

});

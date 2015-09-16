angular.module('discountdublin')
.factory('paypal',[ '$http','$window', 'API',function ($http,$window,API) {


  	var createPaymentReq = function(token,price,quantity){
  		var req  = {//Fecking put that on server side!
			method: 'POST',
			url: 'https://api.sandbox.paypal.com/v1/payments/payment',
			headers: {
				'Accept':'application/json',
				'Content-Type': 'application/json',
				'Accept-Language':'en_US',
				'Authorization': 'Bearer '+token
			},
			data: {
				"intent":"sale",
			 	"redirect_urls":{
				    "return_url":"http://goreferme.s3-website-eu-west-1.amazonaws.com/#/credit?qte="+quantity,
				    "cancel_url":"http://goreferme.s3-website-eu-west-1.amazonaws.com/#/credit"
				},
				"payer":{
					"payment_method":"paypal"
				},
				"transactions":[
				{
					"amount":{
						"total":price,
						"currency":"USD"
					}
				}]
			}
		};
		return $http(req);
  	};

  	var getToken = function(){
  		return API.getPaypalToken();
  	};

  	var executePayment = function(token,payerId,payementId){
  		var req = {
			method: 'POST',
			url: 'https://api.sandbox.paypal.com/v1/payments/payment/'+payementId+'/execute/ ',
			headers: {
				'Accept':'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('paypalToken'),
			},
			data: { "payer_id" : payerId }
		};
		return $http(req);
  	};

  	var getHistory = function(){
		var req = {
			method: 'GET',
			url: 'https://api.sandbox.paypal.com/v1/payments/payment?sort_order=asc&sort_by=update_time',
			headers: {
				'Accept':'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('paypalToken'),
			}
		};
		return $http(req);
  	};


	return {
		getToken:getToken,
		getHistory:getHistory,
		createPaymentReq:function(token,price,qte){return createPaymentReq(token,price,qte)},
		executePayment:function(token,payerId,payementId){return executePayment(token,payerId,payementId)}
	};
}])
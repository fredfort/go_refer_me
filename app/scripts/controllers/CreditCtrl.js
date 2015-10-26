angular.module('discountdublin')
.controller('CreditCtrl',['$scope','$state','$stateParams','$location','$window','paypal','toaster',
	function($scope,$state,$stateParams,$location,$window,paypal,toaster){

	//paypal.getHistory().then(function(data){
		//debugger;
	//});

	if($stateParams.paymentId && $stateParams.token && $stateParams.PayerID){
		$scope.isLoading = true;
		paypal
		.executePayment($stateParams.token,$stateParams.PayerID,$stateParams.paymentId)
		.then(function(data){
			$scope.transaction = data.data;
			$scope.user.credit += parseInt($stateParams.qte);
			$scope.isLoading = false;
			toaster.pop('success','Transaction '+data.data.state);
		})
	}else if($stateParams.token){
		toaster.pop('warning','Transaction canceled')
	}

	$scope.getPrice = function(){
		if($scope.newConnection){
			var price = $scope.newConnection ;
			return price.toFixed(2) 
		}else{
			return 0;
		}
	}

	$scope.buyToken = function(){
		var price = $scope.getPrice();
		if(price > 0){
			$scope.isLoading = true;
			paypal.getToken().then(function(data){
				var token = data.data.access_token;
				localStorage.setItem('paypalToken',token);
	  			paypal.createPaymentReq(token,price,$scope.newConnection).then(function(data2){
	  				var approvalUrl = data2.data.links[1].href;
	  				$window.location.href = approvalUrl;
	  			});
			});
		}else{
			toaster.info('Please specify the amount of tokens you need');
		}
	}

}])
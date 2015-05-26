angular.module('discountdublin')
.factory('functions', function(){
	var getFunctions = function(){
		return [
			'Academics',
			'Accounting',
			'Administrative',
			'Business development',
			'Buyer',
			'Consultant',
			'Creative',
			'Engineering',
			'Entrepreneur',
			'Finance',
			'Human resources',
			'Information technology',
			'Legal',
			'Marketing',
			'Medical',
			'Operations',
			'Product',
			'Public relations',
			'Real estate',
			'Sales',
			'Support'
		]
	}

	return {
		getFunctions : getFunctions
	}
});
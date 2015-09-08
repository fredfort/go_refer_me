angular.module('discountdublin')
.directive('menuIcon', [ function () {
	return {
		restrict: 'A',
		scope:{
            filters:'=',
            glyphiconClass:'@'
		},
		link: function (scope, ele, attrs) {
            
            scope.$watch('filters', function(newValue,oldValue){
                render(newValue);
            },true);

            var svg =
                d3.select(ele[0])
                .append('svg')
                .style('width', '40px')
                .style('height','20px');

            var render = function(filters){

                svg.selectAll('*').remove();

                svg
                .append("svg:foreignObject")
                .attr("width", 20)
                .attr("y", "5px")   
                .attr("x", "12px")
                .append("xhtml:span")
                .attr("class", "control glyphicon "+scope.glyphiconClass);

                if(filters){

                     var arc = d3.svg.arc()
                    .innerRadius(0)
                    .outerRadius(7)
                    .startAngle(0)
                    .endAngle(100);

                    svg
                    .append("path")
                    .attr("d", arc)
                    .style("fill","#009F21")
                    .attr("transform", "translate(33,8)");

                    svg
                    .append('text')
                    .attr('font-size','11px')
                    .attr('fill','#fff')
                    .attr('x','30')
                    .attr('y','12')
                    .text(filters);
                }
            }
        } 
    }
}])
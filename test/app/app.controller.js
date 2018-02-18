angular
	.module("ngSelectizeDemo")
	.controller("appController", appController);

appController.$inject = ["appService"];

function appController(appService) {
	var ctx = this;

	ctx.config = {
		valueField: "id",
		labelField: "text"
	};

	ctx.options = angular.copy(appService.data);

	ctx.singleValue = null;
	ctx.multipleValue = null;
}
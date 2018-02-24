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

	ctx.isValidateEmail = true;
	ctx.validateEmail = validateEmail;

	function validateEmail(email) {
		if (ctx.isValidateEmail) {
			var regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			return regExp.test(email);
		}

		return true;
	}

	ctx.singleValue = null;
	ctx.multipleValue = null;
	ctx.tagValue = "Option - Tag";
}
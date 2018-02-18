angular
	.module("ngSelectize", [])
	.directive("ngSelectize", ["$timeout", function ($timeout) {
		return {
			restrict: "EA",
			require: "^ngModel",
			scope: {
				config: "=?",
				options: "=?",
				ngModel: "=",

				ngDisabled: "<",
				ngRequired: "<",

				onChange: "&?",

				isMultiple: "<",
				isRemovable: "<",
				isTag: "<",
				isNoDefault: "<",

				tagText: "@"
			},
			link: function (scope, element, attrs, modelCtrl) {
				var selectize;

				scope.config = scope.config || {};

				var config = angular.extend({}, Selectize.defaults, scope.config);

				var additionalConfig = {
					maxItems: 1,

					render: {},
					plugins: []
				}

				if (scope.isMultiple) {
					additionalConfig.maxItems = null;
				}

				if ((scope.isMultiple || config.maxItems > 1) && scope.isRemovable) {
					additionalConfig.plugins.push("remove_button");
				}

				if (scope.isTag) {
					additionalConfig.create = function (input) {
						var newOption = {};

						newOption[config.valueField] = newOption[config.labelField] = input;

						return newOption;
					}

					if (scope.tagText) {
						additionalConfig.render.option_create = function (data, escape) {
							return '<div class="create">' + scope.tagText + " <strong>" + escape(data.input) + "</strong>&hellip;</div>";
						}
					}
				}

				config = angular.extend({}, config, additionalConfig);

				scope.options = scope.options || [];

				function isEmpty(val) {
					if (!val) {
						return true;
					}

					if (angular.isArray(val)) {
						return !val.length;
					}

					return false;
				};

				function isDisabled(is) {
					is
						? selectize.disable()
						: selectize.enable();
				}

				function isRequired() {
					var isInvalid = (scope.ngRequired && isEmpty(scope.ngModel)) || false;

					modelCtrl.$setValidity("required", !isInvalid);

					selectize.$control.toggleClass("ng-valid", modelCtrl.$valid);
					selectize.$control.toggleClass("ng-invalid", modelCtrl.$invalid);
				};

				function setPluginValue() {
					var value = angular.copy(selectize.items);

					if (config.maxItems == 1) {
						value = value[0];
					}

					if (!angular.equals(value, scope.ngModel)) {
						selectize.setValue(scope.ngModel, true);
					}
				}

				function setValue(value) {
					modelCtrl.$setViewValue(value);

					if (scope.config.onChange) {
						scope.config.onChange.apply(this, arguments);
					}
				}

				function setDefaultValue() {
					if (!scope.isNoDefault) {
						if (config.maxItems == 1) {
							if (!scope.ngModel) {
								var option = scope.options[0];

								if (option) {
									setValue(option[config.valueField].toString());
								}
							}
						}
					}
				}

				function setOptions(curr, prev) {
					angular.forEach(prev, function (opt) {
						if (curr.indexOf(opt) === -1) {
							var value = opt[config.valueField];

							selectize.removeOption(value, true);
						}
					});

					selectize.addOption(curr, true);

					setPluginValue();
				}

				function setDefaultOptions() {
					var options = element.find("option");

					if (options.length) {
						angular.forEach(options, function (value) {
							var newOption = {};

							newOption[config.valueField] = value.value;
							newOption[config.labelField] = value.text;

							scope.options.push(newOption);
						});
					}
				}

				function onChange() {
					var value = angular.copy(selectize.items);

					if (config.maxItems == 1) {
						value = value[0];
					}

					setValue(value);

					if (scope.onChange) {
						scope.onChange({ val: value });
					}
				};

				function onOptionAdd(value, data) {
					if (scope.options.indexOf(data) === -1) {
						scope.options.push(data);

						if (scope.config.onOptionAdd) {
							scope.config.onOptionAdd.apply(this, arguments);
						}
					}
				};

				function onInitialize() {
					selectize = element[0].selectize;

					setOptions(scope.options);

					if (scope.config.onInitialize) {
						scope.config.onInitialize(selectize);
					}

					setDefaultValue();

					scope.$watch("ngModel", setPluginValue, true);

					scope.$watch("ngDisabled", isDisabled, true);
					scope.$watch("ngRequired", isRequired, true);

					scope.$watchCollection("options", setOptions);
				};

				function initialize() {
					config.onChange = onChange;
					config.onOptionAdd = onOptionAdd;
					config.onInitialize = onInitialize;

					element.on("$destroy", function () {
						if (selectize) {
							selectize.destroy();

							element = null;
						}
					});

					$timeout(function () {
						setDefaultOptions();

						$timeout(function () {
							element.selectize(config);
						});
					});
				}

				initialize();
			}
		};
	}]);
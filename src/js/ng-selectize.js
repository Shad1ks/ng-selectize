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

				isTag: "<",
				isTagValid: "=?",

				isNoDefault: "<",
				isTagNoDefault: "<",

				isInt: "<",
				isBool: "<",

				useAutoWidth: "<",

				tagText: "@"
			},
			link: function (scope, element, attrs, modelCtrl) {
				var selectize;

				scope.config = scope.config || {};

				var config = angular.extend({}, Selectize.defaults, scope.config);

				var additionalConfig = {
					maxItems: 1,
					highlight: false,
					copyClassesToDropdown: true,

					render: {},

					plugins: []
				}

				if (scope.isMultiple) {
					additionalConfig.maxItems = null;
				}

				if (scope.isMultiple || config.maxItems > 1) {
					additionalConfig.plugins.push("remove_button");
				}

				if (scope.isTag) {
					additionalConfig.create = function (input) {
						if (scope.isTagValid) {
							if (!scope.isTagValid(input)) {
								return false;
							}
						}

						var newOption = {};

						newOption[config.valueField] = newOption[config.labelField] = input;

						return newOption;
					}

					if (scope.tagText) {
						additionalConfig.render.option_create = function (data, escape) {
							return '<div class="create">' + scope.tagText + " <strong>" + escape(data.input) + "</strong>&hellip;</div>";
						}
					}

					additionalConfig.plugins.push("restore_on_backspace");
				}

				config = angular.extend({}, config, additionalConfig);

				scope.options = scope.options || [];

				function isEmpty(val) {
					if (val == null) {
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
					var value = angular.copy(scope.ngModel);

					if (!angular.isArray(value)) {
						value = ((scope.ngModel != null && scope.ngModel != undefined) ? [scope.ngModel.toString()] : []);
					}

					if (!angular.equals(selectize.items, value)) {
						selectize.setValue(value);
					}
				}

				function setValue(value) {
					if (value) {
						if (scope.isInt) {
							value = parseInt(value) || 0;
						}

						if (scope.isBool) {
							value = (value == "true");
						}
					}

					modelCtrl.$setViewValue(value);

					if (scope.config.onChange) {
						scope.config.onChange(value);
					}
				}

				function setDefaultValue() {
					if (!scope.isNoDefault) {
						if (config.maxItems == 1) {
							if (!scope.ngModel) {
								var option = scope.options[0];

								if (option) {
									setValue(option[config.valueField]);
								}
							}
						}
					}
				}

				function setOptions(curr, prev) {
					angular.forEach(prev, function (opt) {
						if (curr.indexOf(opt) === -1) {
							var value = opt[config.valueField];

							selectize.removeOption(value);
						}
					});

					selectize.addOption(curr);

					selectize.refreshOptions(false);
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

				function setTaggedDefaultValue() {
					if (scope.isTag && !scope.isTagNoDefault) {
						if (config.maxItems == 1) {
							if (scope.ngModel) {
								var option = scope.options.find(function (opt) {
									return opt[config.valueField] == scope.ngModel;
								});

								if (!option) {
									var newOption = {};

									newOption[config.valueField] = newOption[config.labelField] = scope.ngModel;

									scope.options.push(newOption);
								}
							}
						}
					}
				}

				var useAutoWidth = function () {
					var noAutoWidthClass = "selectize-no-auto";

					if (scope.useAutoWidth) {
						var control = angular.element(selectize.$control);
						var controlWidht = control[0].clientWidth;

						var dropdown = angular.element(selectize.$dropdown);

						var options = dropdown.find(".option");

						if (options.length) {
							var option = angular.element(options[0]);
							var optionWidth = option[0].clientWidth;

							if (controlWidht >= optionWidth) {
								dropdown.addClass(noAutoWidthClass);
							} else {
								dropdown.removeClass(noAutoWidthClass);
							}
						}
					} else {
						var dropdown = angular.element(selectize.$dropdown);

						dropdown.addClass(noAutoWidthClass);
					}
				}

				function onDropdownOpen() {
					useAutoWidth();

					if (scope.config.onDropdownOpen) {
						scope.config.onDropdownOpen();
					}
				};

				function onChange() {
					var oldValue = angular.copy(scope.ngModel);
					var value = angular.copy(selectize.items);

					if (config.maxItems == 1) {
						value = value[0];
					}

					setValue(value);

					if (scope.onChange) {
						scope.onChange({ val: value, oldVal: oldValue });
					}
				};

				function onOptionAdd(value, data) {
					if (scope.options.indexOf(data) === -1) {
						scope.options.push(data);

						if (scope.config.onOptionAdd) {
							scope.config.onOptionAdd(value, data);
						}
					}
				};

				function onInitialize() {
					selectize = element[0].selectize;

					setOptions(scope.options);

					setDefaultValue();
					setTaggedDefaultValue();

					scope.$watch("ngModel", setPluginValue, true);

					scope.$watch("ngDisabled", isDisabled, true);
					scope.$watch("ngRequired", isRequired, true);

					scope.$watchCollection("options", setOptions);

					if (scope.config.onInitialize) {
						scope.config.onInitialize();
					}
				};

				function initialize() {
					config.onDropdownOpen = onDropdownOpen;
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
angular
	.module("ngSelectizeDemo")
	.service("appService", appService);

function appService() {
	return {
		data: [
			{ id: "1", text: "Option - 1" },
			{ id: "2", text: "Option - 2" },
			{ id: "3", text: "Option - 3" },
			{ id: "4", text: "Option - 4" },
			{ id: "5", text: "Option - 5" }
		]
	}
}

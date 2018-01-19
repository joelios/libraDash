frappe.pages['libradashboard'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: __('libraDashboard'),
		single_column: true
	});

	frappe.libradashboard.make(page)
	frappe.libradashboard.getStandardChartType(page);
	frappe.breadcrumbs.add("libraDash");
}

frappe.libradashboard = {
	start: 0,
	make: function(page) {
		var me = frappe.libradashboard;
		me.page = page;
		me.body = $('<div></div>').appendTo(me.page.main);
		var data = "";
		$(frappe.render_template('libradashboard', data)).appendTo(me.body);
		
		// add menu button
        this.page.add_menu_item(__("Change Standard Settings"), function() {
            // navigate to bank import tool
            window.location.href="#Form/Standard Settings";
		});
		this.page.add_menu_item(__("Reload"), function() {
            // navigate to bank import tool
            location.reload();
		});
		
		// attach button handlers
		this.page.main.find(".btn-bar").on('click', function() {
			frappe.libradashboard.newChart(page, "bar");
		});
		this.page.main.find(".btn-line").on('click', function() {
			frappe.libradashboard.newChart(page, "line");
		});
		this.page.main.find(".btn-scatter").on('click', function() {
			frappe.libradashboard.newChart(page, "scatter");
		});
		this.page.main.find(".btn-pie").on('click', function() {
			frappe.libradashboard.newChart(page, "pie");
		});
		this.page.main.find(".btn-percentage").on('click', function() {
			frappe.libradashboard.newChart(page, "percentage");
		});
	},
	newChart: function(page, style) {
		var data = {
			labels: ["12am-3am", "3am-6am", "6am-9am", "9am-12pm",
			  "12pm-3pm", "3pm-6pm", "6pm-9pm", "9pm-12am"],

			datasets: [
			  {
				title: "Some Data",
				values: [25, 40, 30, 35, 8, 52, 17, -4]
			  },
			  {
				title: "Another Set",
				values: [25, 50, -10, 15, 18, 32, 27, 14]
			  },
			  {
				title: "Yet Another",
				values: [15, 20, -3, -15, 58, 12, -17, 37]
			  }
			]
		};
		var chart = new Chart({
			parent: "#BarChart", // or a DOM element
			title: "Bar Chart",
			data: data,
			type: style, // or 'line', 'scatter', 'pie', 'percentage'
			height: 250,

			colors: ['#7cd6fd', 'violet', 'blue'],
			// hex-codes or these preset colors;
			// defaults (in order):
			// ['light-blue', 'blue', 'violet', 'red',
			// 'orange', 'yellow', 'green', 'light-green',
			// 'purple', 'magenta', 'grey', 'dark-grey']

			format_tooltip_x: d => (d + '').toUpperCase(),
			format_tooltip_y: d => d + ' pts'
		});
	},
	getStandardChartType: function(page) {
		frappe.model.get_value('Standard Settings', {'name': 'Standard Settings'}, 'chart_type', function(d) {
			console.log(d.chart_type)
			frappe.libradashboard.newChart(page, d.chart_type);
		 });
	}
}




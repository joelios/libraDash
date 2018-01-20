frappe.pages['libradashboard'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: __('libraDashboard'),
		single_column: true
	});

	frappe.libradashboard.make(page);
	
	frappe.libradashboard.getStandardSettings("Customer");
	frappe.libradashboard.getStandardChartType(page, "Customer");
	
	frappe.libradashboard.getStandardSettings("Sales");
	frappe.libradashboard.getStandardChartType(page, "Sales");
	
	frappe.breadcrumbs.add("libraDash");
}

frappe.libradashboard = {
	//start: 0,
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
		
		// attach button handlers for Customer Area
		this.page.main.find(".btn-bar-customer").on('click', function() {
			frappe.libradashboard.newChart(page, "bar", "Customer");
		});
		this.page.main.find(".btn-line-customer").on('click', function() {
			frappe.libradashboard.newChart(page, "line", "Customer");
		});
		this.page.main.find(".btn-scatter-customer").on('click', function() {
			frappe.libradashboard.newChart(page, "scatter", "Customer");
		});
		this.page.main.find(".btn-pie-customer").on('click', function() {
			frappe.libradashboard.newChart(page, "pie", "Customer");
		});
		this.page.main.find(".btn-percentage-customer").on('click', function() {
			frappe.libradashboard.newChart(page, "percentage", "Customer");
		});
		this.page.main.find(".collapse-customer").on('click', function() {
			frappe.libradashboard.newChart(page, frappe.libradashboard.getStandardChartType(page, "Customer"), "Customer");
		});
		
		// attach button handlers for Sales Area
		this.page.main.find(".btn-bar-sales").on('click', function() {
			frappe.libradashboard.newChart(page, "bar", "Sales");
		});
		this.page.main.find(".btn-line-sales").on('click', function() {
			frappe.libradashboard.newChart(page, "line", "Sales");
		});
		this.page.main.find(".btn-scatter-sales").on('click', function() {
			frappe.libradashboard.newChart(page, "scatter", "Sales");
		});
		this.page.main.find(".btn-pie-sales").on('click', function() {
			frappe.libradashboard.newChart(page, "pie", "Sales");
		});
		this.page.main.find(".btn-percentage-sales").on('click', function() {
			frappe.libradashboard.newChart(page, "percentage", "Sales");
		});
		this.page.main.find(".collapse-sales").on('click', function() {
			frappe.libradashboard.newChart(page, frappe.libradashboard.getStandardChartType(page, "Sales"), "Sales");
		});
	},
	newChart: function(page, style, type) {
		if (type == "Customer") {
			var refID = "#CustomerChart";
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
				parent: refID, // or a DOM element
				title: "Lead / Customer overview",
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
		}
		if (type == "Sales") {
			var refID = "#SalesChart";
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
				parent: refID, // or a DOM element
				title: "Sales overview",
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
		}
	},
	getStandardChartType: function(page, type) {
		if (type == "Customer") {
			frappe.model.get_value('Standard Settings', {'name': 'Standard Settings'}, 'customer_chart_type', function(d) {
				frappe.libradashboard.newChart(page, d.customer_chart_type, type);
			 });
		}
		if (type == "Sales") {
			frappe.model.get_value('Standard Settings', {'name': 'Standard Settings'}, 'sales_chart_type', function(d) {
				frappe.libradashboard.newChart(page, d.sales_chart_type, type);
			 });
		}
	},
	getStandardSettings: function(type) {
		var doctype = "Standard Settings";
		frappe.model.with_doc(doctype, doctype, function() {
			var values = frappe.model.get_list(doctype);			
			// Customer Area
			if (type == "Customer") {
				if (values[0].customer_show == "0") {
					$("#CustomerAreaBTN").click();
				}
			}
			// Sales Area
			if (type == "Sales") {
				if (values[0].customer_show == "0") {
					$("#SalesAreaBTN").click();
				}
			}
		});
	}
}






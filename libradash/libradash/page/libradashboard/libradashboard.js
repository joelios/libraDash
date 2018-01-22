frappe.pages['libradashboard'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: __('libraDashboard'),
		single_column: true
	});

	frappe.libradashboard.make(page);
	
	//Customer Section
	frappe.libradashboard.setVisabilityOfSection(page, "Customer");
	frappe.libradashboard.getStandardSettings(page, "Customer", "");
	
	//Sales Section
	frappe.libradashboard.setVisabilityOfSection(page, "Sales");
	frappe.libradashboard.getStandardSettings(page, "Sales");
	
}

frappe.libradashboard = {
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
			if (page.main.find("#customer_ignore")[0].checked) {
				frappe.libradashboard.getStandardSettings(page,"Customer", "bar");
			} else {
				frappe.msgprint("to be programmed - for testing, do ignore standards");
			}
		});
		this.page.main.find(".btn-line-customer").on('click', function() {
			if (page.main.find("#customer_ignore")[0].checked) {
				frappe.libradashboard.getStandardSettings(page,"Customer", "line");
			} else {
				frappe.msgprint("to be programmed - for testing, do ignore standards");
			}
		});
		this.page.main.find(".btn-scatter-customer").on('click', function() {
			if (page.main.find("#customer_ignore")[0].checked) {
				frappe.libradashboard.getStandardSettings(page,"Customer", "scatter");
			} else {
				frappe.msgprint("to be programmed - for testing, do ignore standards");
			}
		});
		this.page.main.find(".btn-pie-customer").on('click', function() {
			if (page.main.find("#customer_ignore")[0].checked) {
				frappe.libradashboard.getStandardSettings(page,"Customer", "pie");
			} else {
				frappe.msgprint("to be programmed - for testing, do ignore standards");
			}
		});
		this.page.main.find(".btn-percentage-customer").on('click', function() {
			if (page.main.find("#customer_ignore")[0].checked) {
				frappe.libradashboard.getStandardSettings(page,"Customer", "percentage");
			} else {
				frappe.msgprint("to be programmed - for testing, do ignore standards");
			}
		});
		this.page.main.find(".collapse-customer").on('click', function() {
			page.main.find("#customer_ignore")[0].checked = false;
			frappe.libradashboard.getStandardSettings(page, "Customer");
		});
		
		// attach button handlers for Sales Area
		this.page.main.find(".btn-bar-sales").on('click', function() {
			if (page.main.find("#sales_ignore")[0].checked) {
				frappe.libradashboard.getStandardSettings(page,"Sales", "bar");
			} else {
				frappe.msgprint("to be programmed - for testing, do ignore standards");
			}
		});
		this.page.main.find(".btn-line-sales").on('click', function() {
			if (page.main.find("#sales_ignore")[0].checked) {
				frappe.libradashboard.getStandardSettings(page,"Sales", "line");
			} else {
				frappe.msgprint("to be programmed - for testing, do ignore standards");
			}
		});
		this.page.main.find(".btn-scatter-sales").on('click', function() {
			if (page.main.find("#sales_ignore")[0].checked) {
				frappe.libradashboard.getStandardSettings(page,"Sales", "scatter");
			} else {
				frappe.msgprint("to be programmed - for testing, do ignore standards");
			}
		});
		this.page.main.find(".btn-pie-sales").on('click', function() {
			if (page.main.find("#sales_ignore")[0].checked) {
				frappe.libradashboard.getStandardSettings(page,"Sales", "pie");
			} else {
				frappe.msgprint("to be programmed - for testing, do ignore standards");
			}
		});
		this.page.main.find(".btn-percentage-sales").on('click', function() {
			if (page.main.find("#sales_ignore")[0].checked) {
				frappe.libradashboard.getStandardSettings(page,"Sales", "percentage");
			} else {
				frappe.msgprint("to be programmed - for testing, do ignore standards");
			}
		});
		this.page.main.find(".collapse-sales").on('click', function() {
			page.main.find("#sales_ignore")[0].checked = false;
			frappe.libradashboard.getStandardSettings(page, "Sales");;
		});
	},
	setVisabilityOfSection: function(page, type) {
		var doctype = "Standard Settings";
		frappe.model.with_doc(doctype, doctype, function() {
			var values = frappe.model.get_list(doctype);			
			// Customer Area
			if (type == "Customer") {
				if (values[0].customer_show == "1") {
					page.main.find("#CustomerArea").addClass("in");
				}
			}
			// Sales Area
			if (type == "Sales") {
				if (values[0].sales_show == "1") {
					//alternative function
					//$("#SalesAreaBTN").click();
					page.main.find("#SalesArea").addClass("in");
				}
			}
		});
	},
	getStandardSettings: function(page, section, custom_chart_type="") {
		frappe.model.get_value('Standard Settings', {'name': 'Standard Settings'}, '', function(d) {
			//console.log(d);
			//return d;
			if (custom_chart_type!="") {
				frappe.libradashboard.defineMonthFromInt(2,3, d, page, section, custom_chart_type);
				//INFO(!): Die ersten beiden Parameter (2,3) sind erster und letzter monat aus den standard einstellungen als int. Das Auslesen dieser int muss noch programmiert werden.
			} else {
				frappe.libradashboard.defineMonthFromInt(2,3, d, page, section);
				//INFO(!): Die ersten beiden Parameter (2,3) sind erster und letzter monat aus den standard einstellungen als int. Das Auslesen dieser int muss noch programmiert werden.
			}			
		 });
	},
	defineMonthFromInt: function(start, end, Standard_settings, page, section, custom_chart_type="") {
		var months = [];
		for (var i = start; i <= end; i++) {
			if (i == 1){
				months.push("Jan");
			}
			if (i == 2){
				months.push("Feb");
			}
			if (i == 3){
				months.push("Mar");
			}
			if (i == 4){
				months.push("Apr");
			}
			if (i == 5){
				months.push("May");
			}
			if (i == 6){
				months.push("Jun");
			}
			if (i == 7){
				months.push("Jul");
			}
			if (i == 8){
				months.push("Aug");
			}
			if (i == 9){
				months.push("Sep");
			}
			if (i == 10){
				months.push("Oct");
			}
			if (i == 11){
				months.push("Nov");
			}
			if (i == 12){
				months.push("Dec");
			}
		}
		//return months;
		if (custom_chart_type!="") {
			frappe.libradashboard.getCustomerQTY(2,3, months, Standard_settings, page, section, custom_chart_type);
			//INFO(!): Die ersten beiden Parameter (2,3) sind erster und letzter monat aus den standard einstellungen als int. Das Auslesen dieser int muss noch programmiert werden.
		} else {
			frappe.libradashboard.getCustomerQTY(2,3, months, Standard_settings, page, section);
			//INFO(!): Die ersten beiden Parameter (2,3) sind erster und letzter monat aus den standard einstellungen als int. Das Auslesen dieser int muss noch programmiert werden.
		}
	},
	getCustomerQTY: function(start, end, months, Standard_settings, page, section, custom_chart_type="") {
		frappe.call({
			method: 'libradash.libradash.page.libradashboard.libradashboard.get_customer_qty',
			args: {
				'start': start,
				'end': end
			},
			callback: function(r) {
				if (r.message) {
					//console.log(r.message.qty);
					//return r.message.qty;
					if (custom_chart_type!="") {
						frappe.libradashboard.newCustomerChart(page, Standard_settings, months, section, r.message.qty, custom_chart_type);
					} else {
						frappe.libradashboard.newCustomerChart(page, Standard_settings, months, section, r.message.qty);
					}
				}
			}
		});
	},
	newCustomerChart: function(page, Standard_settings, months, section, input_daten, custom_chart_type="") {
		if (custom_chart_type!="") {
			chart_type = custom_chart_type;
		} else {
			if (section == "Customer") {
				chart_type = Standard_settings.customer_chart_type;
			}
			if (section == "Sales") {
				chart_type = Standard_settings.sales_chart_type;
			}
		}
		if (section == "Customer") {
			var refID = "#CustomerChart";
			var data = {
				labels: months,

				datasets: [
				  {
					title: "New Leads",
					values: [1, 2]
				  },
				  {
					title: "Active Customer",
					values: input_daten
				  },
				  {
					title: "Inactive Customers",
					values: [0, 0]
				  }
				]
			};

			var chart = new Chart({
				parent: refID, // or a DOM element
				title: "Lead / Customer overview",
				data: data,
				type: chart_type, // or 'line', 'scatter', 'pie', 'percentage'
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
		if (section == "Sales") {
			var refID = "#SalesChart";
			var data = {
				labels: months,

				datasets: [
				  {
					title: "Some Data",
					values: [25, 40]
				  },
				  {
					title: "Another Set",
					values: [25, 50]
				  },
				  {
					title: "Yet Another",
					values: [15, 20]
				  }
				]
			};
			var chart = new Chart({
				parent: refID, // or a DOM element
				title: "Sales overview",
				data: data,
				type: chart_type, // or 'line', 'scatter', 'pie', 'percentage'
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
	
}
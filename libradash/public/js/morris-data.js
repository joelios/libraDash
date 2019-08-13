$(function() {
	//line charts
	frappe.call({
		method: 'libradash.www.libradash.get_line_charts',
		args: {},
		callback: function(r) {
			if (r.message) {
				var charts = r.message;
				for (i=0; i<charts.length;i++){
					var items = charts[i].line_chart_values;
					var ykeys_values = JSON.parse(charts[i].line_chart_y_keys);
					var colors = JSON.parse(charts[i].line_chart_colors) || ["#5cb85c", "#5e64ff", "#d9534f"];
					var label_values = JSON.parse(charts[i].line_chart_y_labels);
					var data_arr = []
					Morris.Area({
						element: charts[i].name + '-line-chart',
						data: items,
						xkey: 'period',
						ykeys: ykeys_values,
						xLabels: 'month',
						labels: label_values,
						/* xLabelFormat: function (d) {
							var month = new Array(7);
							month[0] = "Januar";
							month[1] = "Februar";
							month[2] = "März";
							month[3] = "April";
							month[4] = "Mai";
							month[5] = "Juni";
							month[6] = "Juli";
							month[7] = "August";
							month[8] = "September";
							month[9] = "Oktober";
							month[10] = "November";
							month[11] = "Dezember";

							return month[d.getMonth()]
						}, */
						xLabelAngle: parseInt(charts[i].line_chart_x_label_angle),
						pointSize: parseInt(charts[i].line_chart_point_size),
						hideHover: 'auto',
						resize: true,
						lineColors: colors,
						fillOpacity: parseFloat(charts[i].line_chart_fill_opacity)
					});
				}
			}
		}
	});
	
	//Pie charts
	frappe.call({
		method: 'libradash.www.libradash.get_pie_charts',
		args: {},
		callback: function(r) {
			if (r.message) {
				var charts = r.message;
				for (i=0; i<charts.length;i++){
					var items = charts[i].pie_chart_values;
					var pie_colors = JSON.parse(charts[i].pie_chart_colors) || ["#5cb85c", "#5e64ff", "#d9534f"];
					Morris.Donut({
						element: charts[i].name + '-pie-chart',
						data: items,
						resize: true,
						colors: pie_colors
					});
				}
			}
		}
	});
});
/* $(function() {
	// current year monetary
	frappe.call({
		method: 'libradash.www.libradash.get_monetary_datas',
		args: {},
		callback: function(r) {
			var sinv_total_jan = 0;
			var sinv_total_feb = 0;
			var sinv_total_mar = 0;
			var sinv_total_apr = 0;
			var sinv_total_may = 0;
			var sinv_total_jun = 0;
			var sinv_total_jul = 0;
			var sinv_total_aug = 0;
			var sinv_total_sept = 0;
			var sinv_total_oct = 0;
			var sinv_total_nov = 0;
			var sinv_total_dec = 0;
			
			var so_total_jan = 0;
			var so_total_feb = 0;
			var so_total_mar = 0;
			var so_total_apr = 0;
			var so_total_may = 0;
			var so_total_jun = 0;
			var so_total_jul = 0;
			var so_total_aug = 0;
			var so_total_sept = 0;
			var so_total_oct = 0;
			var so_total_nov = 0;
			var so_total_dec = 0;
			
			var dn_total_jan = 0;
			var dn_total_feb = 0;
			var dn_total_mar = 0;
			var dn_total_apr = 0;
			var dn_total_may = 0;
			var dn_total_jun = 0;
			var dn_total_jul = 0;
			var dn_total_aug = 0;
			var dn_total_sept = 0;
			var dn_total_oct = 0;
			var dn_total_nov = 0;
			var dn_total_dec = 0;
			
			var verkauft = 0;
			var verrechnet = 0;
			var ausstehend = 0;
			
			if(r.message.sinv_total.jan) {
				sinv_total_jan = r.message.sinv_total.jan;
			}
			if (r.message.sinv_total.feb) {
				sinv_total_feb = r.message.sinv_total.feb;
			}
			if (r.message.sinv_total.mar) {
				sinv_total_mar = r.message.sinv_total.mar;
			}
			if (r.message.sinv_total.apr) {
				sinv_total_apr = r.message.sinv_total.apr;
			}
			if (r.message.sinv_total.may) {
				sinv_total_may = r.message.sinv_total.may;
			}
			if (r.message.sinv_total.jun) {
				sinv_total_jun = r.message.sinv_total.jun;
			}
			if (r.message.sinv_total.jul) {
				sinv_total_jul = r.message.sinv_total.jul;
			}
			if (r.message.sinv_total.aug) {
				sinv_total_aug = r.message.sinv_total.aug;
			}
			if (r.message.sinv_total.sept) {
				sinv_total_sept = r.message.sinv_total.sept;
			}
			if (r.message.sinv_total.oct) {
				sinv_total_oct = r.message.sinv_total.oct;
			}
			if (r.message.sinv_total.nov) {
				sinv_total_nov = r.message.sinv_total.nov;
			}
			if (r.message.sinv_total.dec) {
				sinv_total_dec = r.message.sinv_total.dec;
			}
			
			if(r.message.sales_orders.jan) {
				so_total_jan = r.message.sales_orders.jan;
			}
			if (r.message.sales_orders.feb) {
				so_total_feb = r.message.sales_orders.feb;
			}
			if (r.message.sales_orders.mar) {
				so_total_mar = r.message.sales_orders.mar;
			}
			if (r.message.sales_orders.apr) {
				so_total_apr = r.message.sales_orders.apr;
			}
			if (r.message.sales_orders.may) {
				so_total_may = r.message.sales_orders.may;
			}
			if (r.message.sales_orders.jun) {
				so_total_jun = r.message.sales_orders.jun;
			}
			if (r.message.sales_orders.jul) {
				so_total_jul = r.message.sales_orders.jul;
			}
			if (r.message.sales_orders.aug) {
				so_total_aug = r.message.sales_orders.aug;
			}
			if (r.message.sales_orders.sept) {
				so_total_sept = r.message.sales_orders.sept;
			}
			if (r.message.sales_orders.oct) {
				so_total_oct = r.message.sales_orders.oct;
			}
			if (r.message.sales_orders.nov) {
				so_total_nov = r.message.sales_orders.nov;
			}
			if (r.message.sales_orders.dec) {
				so_total_dec = r.message.sales_orders.dec;
			}
			
			if(r.message.delivery_notes.jan) {
				dn_total_jan = r.message.delivery_notes.jan;
			}
			if (r.message.delivery_notes.feb) {
				dn_total_feb = r.message.delivery_notes.feb;
			}
			if (r.message.delivery_notes.mar) {
				dn_total_mar = r.message.delivery_notes.mar;
			}
			if (r.message.delivery_notes.apr) {
				dn_total_apr = r.message.delivery_notes.apr;
			}
			if (r.message.delivery_notes.may) {
				dn_total_may = r.message.delivery_notes.may;
			}
			if (r.message.delivery_notes.jun) {
				dn_total_jun = r.message.delivery_notes.jun;
			}
			if (r.message.delivery_notes.jul) {
				dn_total_jul = r.message.delivery_notes.jul;
			}
			if (r.message.delivery_notes.aug) {
				dn_total_aug = r.message.delivery_notes.aug;
			}
			if (r.message.delivery_notes.sept) {
				dn_total_sept = r.message.delivery_notes.sept;
			}
			if (r.message.delivery_notes.oct) {
				dn_total_oct = r.message.delivery_notes.oct;
			}
			if (r.message.delivery_notes.nov) {
				dn_total_nov = r.message.delivery_notes.nov;
			}
			if (r.message.delivery_notes.dec) {
				dn_total_dec = r.message.delivery_notes.dec;
			}
			
			if (r.message.verkauft) {
				verkauft = r.message.verkauft;
			}
			if (r.message.verrechnet) {
				verrechnet = r.message.verrechnet;
			}
			if (r.message.ausstehend) {
				ausstehend = r.message.ausstehend;
			}
		
			var year = new Date().getFullYear();
			
			Morris.Area({
				element: 'morris-area-chart-current-year-monetary',
				data: [{
					period: year + '-01',
					sales_orders: parseInt(dn_total_jan),
					delivery_notes: parseInt(so_total_jan),
					sales_invoices: parseInt(sinv_total_jan)
				}, {
					period: year + '-02',
					sales_orders: parseInt(so_total_feb),
					delivery_notes: parseInt(dn_total_feb),
					sales_invoices: parseInt(sinv_total_feb)
				}, {
					period: year + '-03',
					sales_orders: parseInt(so_total_mar),
					delivery_notes: parseInt(dn_total_mar),
					sales_invoices: parseInt(sinv_total_mar)
				}, {
					period: year + '-04',
					sales_orders: parseInt(so_total_apr),
					delivery_notes: parseInt(dn_total_apr),
					sales_invoices: parseInt(sinv_total_apr)
				}, {
					period: year + '-05',
					sales_orders: parseInt(so_total_may),
					delivery_notes: parseInt(dn_total_may),
					sales_invoices: parseInt(sinv_total_may)
				}, {
					period: year + '-06',
					sales_orders: parseInt(so_total_jun),
					delivery_notes: parseInt(dn_total_jun),
					sales_invoices: parseInt(sinv_total_jun)
				}, {
					period: year + '-07',
					sales_orders: parseInt(so_total_jul),
					delivery_notes: parseInt(dn_total_jul),
					sales_invoices: parseInt(sinv_total_jul)
				}, {
					period: year + '-08',
					sales_orders: parseInt(so_total_aug),
					delivery_notes: parseInt(dn_total_aug),
					sales_invoices: parseInt(sinv_total_aug)
				}, {
					period: year + '-09',
					sales_orders: parseInt(so_total_sept),
					delivery_notes: parseInt(dn_total_sept),
					sales_invoices: parseInt(sinv_total_sept)
				}, {
					period: year + '-10',
					sales_orders: parseInt(so_total_oct),
					delivery_notes: parseInt(dn_total_oct),
					sales_invoices: parseInt(sinv_total_oct)
				}, {
					period: year + '-11',
					sales_orders: parseInt(so_total_nov),
					delivery_notes: parseInt(dn_total_nov),
					sales_invoices: parseInt(sinv_total_nov)
				}, {
					period: year + '-12',
					sales_orders: parseInt(so_total_dec),
					delivery_notes: parseInt(dn_total_dec),
					sales_invoices: parseInt(sinv_total_dec)
				}],
				xkey: 'period',
				ykeys: ['sales_orders', 'delivery_notes', 'sales_invoices'],
				xLabels: 'month',
				labels: ['Sales Orders', 'Delivery Notes', 'Sales Invoices'],
				xLabelFormat: function (d) {
					var month = new Array(7);
					month[0] = "Januar";
					month[1] = "Februar";
					month[2] = "März";
					month[3] = "April";
					month[4] = "Mai";
					month[5] = "Juni";
					month[6] = "Juli";
					month[7] = "August";
					month[8] = "September";
					month[9] = "Oktober";
					month[10] = "November";
					month[11] = "Dezember";

					return month[d.getMonth()]
				},
				xLabelAngle: 45,
				pointSize: 2,
				hideHover: 'auto',
				resize: true,
				lineColors: ['#f0ad4e', '#5cb85c', '#5e64ff'],
				fillOpacity: 0.0
			});
			
			Morris.Donut({
				element: 'morris-donut-chart',
				data: [{
					label: "Verkauft",
					value: verkauft
				}, {
					label: "Verrechnet",
					value: verrechnet
				}, {
					label: "Ausstehend",
					value: ausstehend
				}],
				resize: true,
				colors: ['#5cb85c', '#5e64ff', '#d9534f']
			});
		}
	});
	
	// current year qty based
	frappe.call({
		method: 'libradash.www.libradash.get_qty_based_datas',
		args: {},
		callback: function(r) {
			var sinv_total_jan = 0;
			var sinv_total_feb = 0;
			var sinv_total_mar = 0;
			var sinv_total_apr = 0;
			var sinv_total_may = 0;
			var sinv_total_jun = 0;
			var sinv_total_jul = 0;
			var sinv_total_aug = 0;
			var sinv_total_sept = 0;
			var sinv_total_oct = 0;
			var sinv_total_nov = 0;
			var sinv_total_dec = 0;
			
			var so_total_jan = 0;
			var so_total_feb = 0;
			var so_total_mar = 0;
			var so_total_apr = 0;
			var so_total_may = 0;
			var so_total_jun = 0;
			var so_total_jul = 0;
			var so_total_aug = 0;
			var so_total_sept = 0;
			var so_total_oct = 0;
			var so_total_nov = 0;
			var so_total_dec = 0;
			
			var dn_total_jan = 0;
			var dn_total_feb = 0;
			var dn_total_mar = 0;
			var dn_total_apr = 0;
			var dn_total_may = 0;
			var dn_total_jun = 0;
			var dn_total_jul = 0;
			var dn_total_aug = 0;
			var dn_total_sept = 0;
			var dn_total_oct = 0;
			var dn_total_nov = 0;
			var dn_total_dec = 0;
			
			var iss_total_jan = 0;
			var iss_total_feb = 0;
			var iss_total_mar = 0;
			var iss_total_apr = 0;
			var iss_total_may = 0;
			var iss_total_jun = 0;
			var iss_total_jul = 0;
			var iss_total_aug = 0;
			var iss_total_sept = 0;
			var iss_total_oct = 0;
			var iss_total_nov = 0;
			var iss_total_dec = 0;
			
			if(r.message.sinv_total.jan) {
				sinv_total_jan = r.message.sinv_total.jan;
			}
			if (r.message.sinv_total.feb) {
				sinv_total_feb = r.message.sinv_total.feb;
			}
			if (r.message.sinv_total.mar) {
				sinv_total_mar = r.message.sinv_total.mar;
			}
			if (r.message.sinv_total.apr) {
				sinv_total_apr = r.message.sinv_total.apr;
			}
			if (r.message.sinv_total.may) {
				sinv_total_may = r.message.sinv_total.may;
			}
			if (r.message.sinv_total.jun) {
				sinv_total_jun = r.message.sinv_total.jun;
			}
			if (r.message.sinv_total.jul) {
				sinv_total_jul = r.message.sinv_total.jul;
			}
			if (r.message.sinv_total.aug) {
				sinv_total_aug = r.message.sinv_total.aug;
			}
			if (r.message.sinv_total.sept) {
				sinv_total_sept = r.message.sinv_total.sept;
			}
			if (r.message.sinv_total.oct) {
				sinv_total_oct = r.message.sinv_total.oct;
			}
			if (r.message.sinv_total.nov) {
				sinv_total_nov = r.message.sinv_total.nov;
			}
			if (r.message.sinv_total.dec) {
				sinv_total_dec = r.message.sinv_total.dec;
			}
			
			if(r.message.sales_orders.jan) {
				so_total_jan = r.message.sales_orders.jan;
			}
			if (r.message.sales_orders.feb) {
				so_total_feb = r.message.sales_orders.feb;
			}
			if (r.message.sales_orders.mar) {
				so_total_mar = r.message.sales_orders.mar;
			}
			if (r.message.sales_orders.apr) {
				so_total_apr = r.message.sales_orders.apr;
			}
			if (r.message.sales_orders.may) {
				so_total_may = r.message.sales_orders.may;
			}
			if (r.message.sales_orders.jun) {
				so_total_jun = r.message.sales_orders.jun;
			}
			if (r.message.sales_orders.jul) {
				so_total_jul = r.message.sales_orders.jul;
			}
			if (r.message.sales_orders.aug) {
				so_total_aug = r.message.sales_orders.aug;
			}
			if (r.message.sales_orders.sept) {
				so_total_sept = r.message.sales_orders.sept;
			}
			if (r.message.sales_orders.oct) {
				so_total_oct = r.message.sales_orders.oct;
			}
			if (r.message.sales_orders.nov) {
				so_total_nov = r.message.sales_orders.nov;
			}
			if (r.message.sales_orders.dec) {
				so_total_dec = r.message.sales_orders.dec;
			}
			
			if(r.message.delivery_notes.jan) {
				dn_total_jan = r.message.delivery_notes.jan;
			}
			if (r.message.delivery_notes.feb) {
				dn_total_feb = r.message.delivery_notes.feb;
			}
			if (r.message.delivery_notes.mar) {
				dn_total_mar = r.message.delivery_notes.mar;
			}
			if (r.message.delivery_notes.apr) {
				dn_total_apr = r.message.delivery_notes.apr;
			}
			if (r.message.delivery_notes.may) {
				dn_total_may = r.message.delivery_notes.may;
			}
			if (r.message.delivery_notes.jun) {
				dn_total_jun = r.message.delivery_notes.jun;
			}
			if (r.message.delivery_notes.jul) {
				dn_total_jul = r.message.delivery_notes.jul;
			}
			if (r.message.delivery_notes.aug) {
				dn_total_aug = r.message.delivery_notes.aug;
			}
			if (r.message.delivery_notes.sept) {
				dn_total_sept = r.message.delivery_notes.sept;
			}
			if (r.message.delivery_notes.oct) {
				dn_total_oct = r.message.delivery_notes.oct;
			}
			if (r.message.delivery_notes.nov) {
				dn_total_nov = r.message.delivery_notes.nov;
			}
			if (r.message.delivery_notes.dec) {
				dn_total_dec = r.message.delivery_notes.dec;
			}
			
			if(r.message.issues.jan) {
				iss_total_jan = r.message.issues.jan;
			}
			if (r.message.issues.feb) {
				iss_total_feb = r.message.issues.feb;
			}
			if (r.message.issues.mar) {
				iss_total_mar = r.message.issues.mar;
			}
			if (r.message.issues.apr) {
				iss_total_apr = r.message.issues.apr;
			}
			if (r.message.issues.may) {
				iss_total_may = r.message.issues.may;
			}
			if (r.message.issues.jun) {
				iss_total_jun = r.message.issues.jun;
			}
			if (r.message.issues.jul) {
				iss_total_jul = r.message.issues.jul;
			}
			if (r.message.issues.aug) {
				iss_total_aug = r.message.issues.aug;
			}
			if (r.message.issues.sept) {
				iss_total_sept = r.message.issues.sept;
			}
			if (r.message.issues.oct) {
				iss_total_oct = r.message.issues.oct;
			}
			if (r.message.issues.nov) {
				iss_total_nov = r.message.issues.nov;
			}
			if (r.message.issues.dec) {
				iss_total_dec = r.message.issues.dec;
			}
			
			if (r.message.verkauft) {
				verkauft = r.message.verkauft;
			}
			if (r.message.verrechnet) {
				verrechnet = r.message.verrechnet;
			}
			if (r.message.ausstehend) {
				ausstehend = r.message.ausstehend;
			}
		
			var year = new Date().getFullYear();
			
			Morris.Area({
				element: 'morris-area-chart-current-year-qty-based',
				data: [{
					period: year + '-01',
					sales_orders: parseInt(dn_total_jan),
					delivery_notes: parseInt(so_total_jan),
					sales_invoices: parseInt(sinv_total_jan),
					issues: parseInt(iss_total_jan)
				}, {
					period: year + '-02',
					sales_orders: parseInt(so_total_feb),
					delivery_notes: parseInt(dn_total_feb),
					sales_invoices: parseInt(sinv_total_feb),
					issues: parseInt(iss_total_feb)
				}, {
					period: year + '-03',
					sales_orders: parseInt(so_total_mar),
					delivery_notes: parseInt(dn_total_mar),
					sales_invoices: parseInt(sinv_total_mar),
					issues: parseInt(iss_total_mar)
				}, {
					period: year + '-04',
					sales_orders: parseInt(so_total_apr),
					delivery_notes: parseInt(dn_total_apr),
					sales_invoices: parseInt(sinv_total_apr),
					issues: parseInt(iss_total_apr)
				}, {
					period: year + '-05',
					sales_orders: parseInt(so_total_may),
					delivery_notes: parseInt(dn_total_may),
					sales_invoices: parseInt(sinv_total_may),
					issues: parseInt(iss_total_may)
				}, {
					period: year + '-06',
					sales_orders: parseInt(so_total_jun),
					delivery_notes: parseInt(dn_total_jun),
					sales_invoices: parseInt(sinv_total_jun),
					issues: parseInt(iss_total_jun)
				}, {
					period: year + '-07',
					sales_orders: parseInt(so_total_jul),
					delivery_notes: parseInt(dn_total_jul),
					sales_invoices: parseInt(sinv_total_jul),
					issues: parseInt(iss_total_jul)
				}, {
					period: year + '-08',
					sales_orders: parseInt(so_total_aug),
					delivery_notes: parseInt(dn_total_aug),
					sales_invoices: parseInt(sinv_total_aug),
					issues: parseInt(iss_total_aug)
				}, {
					period: year + '-09',
					sales_orders: parseInt(so_total_sept),
					delivery_notes: parseInt(dn_total_sept),
					sales_invoices: parseInt(sinv_total_sept),
					issues: parseInt(iss_total_sept)
				}, {
					period: year + '-10',
					sales_orders: parseInt(so_total_oct),
					delivery_notes: parseInt(dn_total_oct),
					sales_invoices: parseInt(sinv_total_oct),
					issues: parseInt(iss_total_oct)
				}, {
					period: year + '-11',
					sales_orders: parseInt(so_total_nov),
					delivery_notes: parseInt(dn_total_nov),
					sales_invoices: parseInt(sinv_total_nov),
					issues: parseInt(iss_total_nov)
				}, {
					period: year + '-12',
					sales_orders: parseInt(so_total_dec),
					delivery_notes: parseInt(dn_total_dec),
					sales_invoices: parseInt(sinv_total_dec),
					issues: parseInt(iss_total_dec)
				}],
				xkey: 'period',
				ykeys: ['sales_orders', 'delivery_notes', 'sales_invoices', 'issues'],
				xLabels: 'month',
				labels: ['Sales Orders', 'Delivery Notes', 'Sales Invoices', 'Issues'],
				xLabelFormat: function (d) {
					var month = new Array(7);
					month[0] = "Januar";
					month[1] = "Februar";
					month[2] = "März";
					month[3] = "April";
					month[4] = "Mai";
					month[5] = "Juni";
					month[6] = "Juli";
					month[7] = "August";
					month[8] = "September";
					month[9] = "Oktober";
					month[10] = "November";
					month[11] = "Dezember";

					return month[d.getMonth()]
				},
				xLabelAngle: 45,
				pointSize: 2,
				hideHover: 'auto',
				resize: true,
				lineColors: ['#f0ad4e', '#5cb85c', '#5e64ff', '#d9534f'],
				fillOpacity: 0.0
			});
			
			document.getElementById("current_year_overview_qty_based").classList.add("hidden");
		}
	});
	
	// prior year monetary
	frappe.call({
		method: 'libradash.www.libradash.get_prior_monetary_datas',
		args: {},
		callback: function(r) {
			var sinv_total_jan = 0;
			var sinv_total_feb = 0;
			var sinv_total_mar = 0;
			var sinv_total_apr = 0;
			var sinv_total_may = 0;
			var sinv_total_jun = 0;
			var sinv_total_jul = 0;
			var sinv_total_aug = 0;
			var sinv_total_sept = 0;
			var sinv_total_oct = 0;
			var sinv_total_nov = 0;
			var sinv_total_dec = 0;
			
			var so_total_jan = 0;
			var so_total_feb = 0;
			var so_total_mar = 0;
			var so_total_apr = 0;
			var so_total_may = 0;
			var so_total_jun = 0;
			var so_total_jul = 0;
			var so_total_aug = 0;
			var so_total_sept = 0;
			var so_total_oct = 0;
			var so_total_nov = 0;
			var so_total_dec = 0;
			
			var dn_total_jan = 0;
			var dn_total_feb = 0;
			var dn_total_mar = 0;
			var dn_total_apr = 0;
			var dn_total_may = 0;
			var dn_total_jun = 0;
			var dn_total_jul = 0;
			var dn_total_aug = 0;
			var dn_total_sept = 0;
			var dn_total_oct = 0;
			var dn_total_nov = 0;
			var dn_total_dec = 0;
			
			if(r.message.sinv_total.jan) {
				sinv_total_jan = r.message.sinv_total.jan;
			}
			if (r.message.sinv_total.feb) {
				sinv_total_feb = r.message.sinv_total.feb;
			}
			if (r.message.sinv_total.mar) {
				sinv_total_mar = r.message.sinv_total.mar;
			}
			if (r.message.sinv_total.apr) {
				sinv_total_apr = r.message.sinv_total.apr;
			}
			if (r.message.sinv_total.may) {
				sinv_total_may = r.message.sinv_total.may;
			}
			if (r.message.sinv_total.jun) {
				sinv_total_jun = r.message.sinv_total.jun;
			}
			if (r.message.sinv_total.jul) {
				sinv_total_jul = r.message.sinv_total.jul;
			}
			if (r.message.sinv_total.aug) {
				sinv_total_aug = r.message.sinv_total.aug;
			}
			if (r.message.sinv_total.sept) {
				sinv_total_sept = r.message.sinv_total.sept;
			}
			if (r.message.sinv_total.oct) {
				sinv_total_oct = r.message.sinv_total.oct;
			}
			if (r.message.sinv_total.nov) {
				sinv_total_nov = r.message.sinv_total.nov;
			}
			if (r.message.sinv_total.dec) {
				sinv_total_dec = r.message.sinv_total.dec;
			}
			
			if(r.message.sales_orders.jan) {
				so_total_jan = r.message.sales_orders.jan;
			}
			if (r.message.sales_orders.feb) {
				so_total_feb = r.message.sales_orders.feb;
			}
			if (r.message.sales_orders.mar) {
				so_total_mar = r.message.sales_orders.mar;
			}
			if (r.message.sales_orders.apr) {
				so_total_apr = r.message.sales_orders.apr;
			}
			if (r.message.sales_orders.may) {
				so_total_may = r.message.sales_orders.may;
			}
			if (r.message.sales_orders.jun) {
				so_total_jun = r.message.sales_orders.jun;
			}
			if (r.message.sales_orders.jul) {
				so_total_jul = r.message.sales_orders.jul;
			}
			if (r.message.sales_orders.aug) {
				so_total_aug = r.message.sales_orders.aug;
			}
			if (r.message.sales_orders.sept) {
				so_total_sept = r.message.sales_orders.sept;
			}
			if (r.message.sales_orders.oct) {
				so_total_oct = r.message.sales_orders.oct;
			}
			if (r.message.sales_orders.nov) {
				so_total_nov = r.message.sales_orders.nov;
			}
			if (r.message.sales_orders.dec) {
				so_total_dec = r.message.sales_orders.dec;
			}
			
			if(r.message.delivery_notes.jan) {
				dn_total_jan = r.message.delivery_notes.jan;
			}
			if (r.message.delivery_notes.feb) {
				dn_total_feb = r.message.delivery_notes.feb;
			}
			if (r.message.delivery_notes.mar) {
				dn_total_mar = r.message.delivery_notes.mar;
			}
			if (r.message.delivery_notes.apr) {
				dn_total_apr = r.message.delivery_notes.apr;
			}
			if (r.message.delivery_notes.may) {
				dn_total_may = r.message.delivery_notes.may;
			}
			if (r.message.delivery_notes.jun) {
				dn_total_jun = r.message.delivery_notes.jun;
			}
			if (r.message.delivery_notes.jul) {
				dn_total_jul = r.message.delivery_notes.jul;
			}
			if (r.message.delivery_notes.aug) {
				dn_total_aug = r.message.delivery_notes.aug;
			}
			if (r.message.delivery_notes.sept) {
				dn_total_sept = r.message.delivery_notes.sept;
			}
			if (r.message.delivery_notes.oct) {
				dn_total_oct = r.message.delivery_notes.oct;
			}
			if (r.message.delivery_notes.nov) {
				dn_total_nov = r.message.delivery_notes.nov;
			}
			if (r.message.delivery_notes.dec) {
				dn_total_dec = r.message.delivery_notes.dec;
			}
		
			var year = new Date().getFullYear() - 1;
			
			Morris.Area({
				element: 'morris-area-chart-prior-year-monetary',
				data: [{
					period: year + '-01',
					sales_orders: parseInt(dn_total_jan),
					delivery_notes: parseInt(so_total_jan),
					sales_invoices: parseInt(sinv_total_jan)
				}, {
					period: year + '-02',
					sales_orders: parseInt(so_total_feb),
					delivery_notes: parseInt(dn_total_feb),
					sales_invoices: parseInt(sinv_total_feb)
				}, {
					period: year + '-03',
					sales_orders: parseInt(so_total_mar),
					delivery_notes: parseInt(dn_total_mar),
					sales_invoices: parseInt(sinv_total_mar)
				}, {
					period: year + '-04',
					sales_orders: parseInt(so_total_apr),
					delivery_notes: parseInt(dn_total_apr),
					sales_invoices: parseInt(sinv_total_apr)
				}, {
					period: year + '-05',
					sales_orders: parseInt(so_total_may),
					delivery_notes: parseInt(dn_total_may),
					sales_invoices: parseInt(sinv_total_may)
				}, {
					period: year + '-06',
					sales_orders: parseInt(so_total_jun),
					delivery_notes: parseInt(dn_total_jun),
					sales_invoices: parseInt(sinv_total_jun)
				}, {
					period: year + '-07',
					sales_orders: parseInt(so_total_jul),
					delivery_notes: parseInt(dn_total_jul),
					sales_invoices: parseInt(sinv_total_jul)
				}, {
					period: year + '-08',
					sales_orders: parseInt(so_total_aug),
					delivery_notes: parseInt(dn_total_aug),
					sales_invoices: parseInt(sinv_total_aug)
				}, {
					period: year + '-09',
					sales_orders: parseInt(so_total_sept),
					delivery_notes: parseInt(dn_total_sept),
					sales_invoices: parseInt(sinv_total_sept)
				}, {
					period: year + '-10',
					sales_orders: parseInt(so_total_oct),
					delivery_notes: parseInt(dn_total_oct),
					sales_invoices: parseInt(sinv_total_oct)
				}, {
					period: year + '-11',
					sales_orders: parseInt(so_total_nov),
					delivery_notes: parseInt(dn_total_nov),
					sales_invoices: parseInt(sinv_total_nov)
				}, {
					period: year + '-12',
					sales_orders: parseInt(so_total_dec),
					delivery_notes: parseInt(dn_total_dec),
					sales_invoices: parseInt(sinv_total_dec)
				}],
				xkey: 'period',
				ykeys: ['sales_orders', 'delivery_notes', 'sales_invoices'],
				xLabels: 'month',
				labels: ['Sales Orders', 'Delivery Notes', 'Sales Invoices'],
				xLabelFormat: function (d) {
					var month = new Array(7);
					month[0] = "Januar";
					month[1] = "Februar";
					month[2] = "März";
					month[3] = "April";
					month[4] = "Mai";
					month[5] = "Juni";
					month[6] = "Juli";
					month[7] = "August";
					month[8] = "September";
					month[9] = "Oktober";
					month[10] = "November";
					month[11] = "Dezember";

					return month[d.getMonth()]
				},
				xLabelAngle: 45,
				pointSize: 2,
				hideHover: 'auto',
				resize: true,
				lineColors: ['#f0ad4e', '#5cb85c', '#5e64ff'],
				fillOpacity: 0.0
			});
			
			document.getElementById("prior_year_monetary").classList.add("hidden");
		}
	});
	
	// prior year qty
	frappe.call({
		method: 'libradash.www.libradash.get_prior_qty_based_datas',
		args: {},
		callback: function(r) {
			var sinv_total_jan = 0;
			var sinv_total_feb = 0;
			var sinv_total_mar = 0;
			var sinv_total_apr = 0;
			var sinv_total_may = 0;
			var sinv_total_jun = 0;
			var sinv_total_jul = 0;
			var sinv_total_aug = 0;
			var sinv_total_sept = 0;
			var sinv_total_oct = 0;
			var sinv_total_nov = 0;
			var sinv_total_dec = 0;
			
			var so_total_jan = 0;
			var so_total_feb = 0;
			var so_total_mar = 0;
			var so_total_apr = 0;
			var so_total_may = 0;
			var so_total_jun = 0;
			var so_total_jul = 0;
			var so_total_aug = 0;
			var so_total_sept = 0;
			var so_total_oct = 0;
			var so_total_nov = 0;
			var so_total_dec = 0;
			
			var dn_total_jan = 0;
			var dn_total_feb = 0;
			var dn_total_mar = 0;
			var dn_total_apr = 0;
			var dn_total_may = 0;
			var dn_total_jun = 0;
			var dn_total_jul = 0;
			var dn_total_aug = 0;
			var dn_total_sept = 0;
			var dn_total_oct = 0;
			var dn_total_nov = 0;
			var dn_total_dec = 0;
			
			var iss_total_jan = 0;
			var iss_total_feb = 0;
			var iss_total_mar = 0;
			var iss_total_apr = 0;
			var iss_total_may = 0;
			var iss_total_jun = 0;
			var iss_total_jul = 0;
			var iss_total_aug = 0;
			var iss_total_sept = 0;
			var iss_total_oct = 0;
			var iss_total_nov = 0;
			var iss_total_dec = 0;
			
			if(r.message.sinv_total.jan) {
				sinv_total_jan = r.message.sinv_total.jan;
			}
			if (r.message.sinv_total.feb) {
				sinv_total_feb = r.message.sinv_total.feb;
			}
			if (r.message.sinv_total.mar) {
				sinv_total_mar = r.message.sinv_total.mar;
			}
			if (r.message.sinv_total.apr) {
				sinv_total_apr = r.message.sinv_total.apr;
			}
			if (r.message.sinv_total.may) {
				sinv_total_may = r.message.sinv_total.may;
			}
			if (r.message.sinv_total.jun) {
				sinv_total_jun = r.message.sinv_total.jun;
			}
			if (r.message.sinv_total.jul) {
				sinv_total_jul = r.message.sinv_total.jul;
			}
			if (r.message.sinv_total.aug) {
				sinv_total_aug = r.message.sinv_total.aug;
			}
			if (r.message.sinv_total.sept) {
				sinv_total_sept = r.message.sinv_total.sept;
			}
			if (r.message.sinv_total.oct) {
				sinv_total_oct = r.message.sinv_total.oct;
			}
			if (r.message.sinv_total.nov) {
				sinv_total_nov = r.message.sinv_total.nov;
			}
			if (r.message.sinv_total.dec) {
				sinv_total_dec = r.message.sinv_total.dec;
			}
			
			if(r.message.sales_orders.jan) {
				so_total_jan = r.message.sales_orders.jan;
			}
			if (r.message.sales_orders.feb) {
				so_total_feb = r.message.sales_orders.feb;
			}
			if (r.message.sales_orders.mar) {
				so_total_mar = r.message.sales_orders.mar;
			}
			if (r.message.sales_orders.apr) {
				so_total_apr = r.message.sales_orders.apr;
			}
			if (r.message.sales_orders.may) {
				so_total_may = r.message.sales_orders.may;
			}
			if (r.message.sales_orders.jun) {
				so_total_jun = r.message.sales_orders.jun;
			}
			if (r.message.sales_orders.jul) {
				so_total_jul = r.message.sales_orders.jul;
			}
			if (r.message.sales_orders.aug) {
				so_total_aug = r.message.sales_orders.aug;
			}
			if (r.message.sales_orders.sept) {
				so_total_sept = r.message.sales_orders.sept;
			}
			if (r.message.sales_orders.oct) {
				so_total_oct = r.message.sales_orders.oct;
			}
			if (r.message.sales_orders.nov) {
				so_total_nov = r.message.sales_orders.nov;
			}
			if (r.message.sales_orders.dec) {
				so_total_dec = r.message.sales_orders.dec;
			}
			
			if(r.message.delivery_notes.jan) {
				dn_total_jan = r.message.delivery_notes.jan;
			}
			if (r.message.delivery_notes.feb) {
				dn_total_feb = r.message.delivery_notes.feb;
			}
			if (r.message.delivery_notes.mar) {
				dn_total_mar = r.message.delivery_notes.mar;
			}
			if (r.message.delivery_notes.apr) {
				dn_total_apr = r.message.delivery_notes.apr;
			}
			if (r.message.delivery_notes.may) {
				dn_total_may = r.message.delivery_notes.may;
			}
			if (r.message.delivery_notes.jun) {
				dn_total_jun = r.message.delivery_notes.jun;
			}
			if (r.message.delivery_notes.jul) {
				dn_total_jul = r.message.delivery_notes.jul;
			}
			if (r.message.delivery_notes.aug) {
				dn_total_aug = r.message.delivery_notes.aug;
			}
			if (r.message.delivery_notes.sept) {
				dn_total_sept = r.message.delivery_notes.sept;
			}
			if (r.message.delivery_notes.oct) {
				dn_total_oct = r.message.delivery_notes.oct;
			}
			if (r.message.delivery_notes.nov) {
				dn_total_nov = r.message.delivery_notes.nov;
			}
			if (r.message.delivery_notes.dec) {
				dn_total_dec = r.message.delivery_notes.dec;
			}
			
			if(r.message.issues.jan) {
				iss_total_jan = r.message.issues.jan;
			}
			if (r.message.issues.feb) {
				iss_total_feb = r.message.issues.feb;
			}
			if (r.message.issues.mar) {
				iss_total_mar = r.message.issues.mar;
			}
			if (r.message.issues.apr) {
				iss_total_apr = r.message.issues.apr;
			}
			if (r.message.issues.may) {
				iss_total_may = r.message.issues.may;
			}
			if (r.message.issues.jun) {
				iss_total_jun = r.message.issues.jun;
			}
			if (r.message.issues.jul) {
				iss_total_jul = r.message.issues.jul;
			}
			if (r.message.issues.aug) {
				iss_total_aug = r.message.issues.aug;
			}
			if (r.message.issues.sept) {
				iss_total_sept = r.message.issues.sept;
			}
			if (r.message.issues.oct) {
				iss_total_oct = r.message.issues.oct;
			}
			if (r.message.issues.nov) {
				iss_total_nov = r.message.issues.nov;
			}
			if (r.message.issues.dec) {
				iss_total_dec = r.message.issues.dec;
			}
			
			if (r.message.verkauft) {
				verkauft = r.message.verkauft;
			}
			if (r.message.verrechnet) {
				verrechnet = r.message.verrechnet;
			}
			if (r.message.ausstehend) {
				ausstehend = r.message.ausstehend;
			}
		
			var year = new Date().getFullYear() - 1;
			
			Morris.Area({
				element: 'morris-area-chart-prior-year-qty-based',
				data: [{
					period: year + '-01',
					sales_orders: parseInt(dn_total_jan),
					delivery_notes: parseInt(so_total_jan),
					sales_invoices: parseInt(sinv_total_jan),
					issues: parseInt(iss_total_jan)
				}, {
					period: year + '-02',
					sales_orders: parseInt(so_total_feb),
					delivery_notes: parseInt(dn_total_feb),
					sales_invoices: parseInt(sinv_total_feb),
					issues: parseInt(iss_total_feb)
				}, {
					period: year + '-03',
					sales_orders: parseInt(so_total_mar),
					delivery_notes: parseInt(dn_total_mar),
					sales_invoices: parseInt(sinv_total_mar),
					issues: parseInt(iss_total_mar)
				}, {
					period: year + '-04',
					sales_orders: parseInt(so_total_apr),
					delivery_notes: parseInt(dn_total_apr),
					sales_invoices: parseInt(sinv_total_apr),
					issues: parseInt(iss_total_apr)
				}, {
					period: year + '-05',
					sales_orders: parseInt(so_total_may),
					delivery_notes: parseInt(dn_total_may),
					sales_invoices: parseInt(sinv_total_may),
					issues: parseInt(iss_total_may)
				}, {
					period: year + '-06',
					sales_orders: parseInt(so_total_jun),
					delivery_notes: parseInt(dn_total_jun),
					sales_invoices: parseInt(sinv_total_jun),
					issues: parseInt(iss_total_jun)
				}, {
					period: year + '-07',
					sales_orders: parseInt(so_total_jul),
					delivery_notes: parseInt(dn_total_jul),
					sales_invoices: parseInt(sinv_total_jul),
					issues: parseInt(iss_total_jul)
				}, {
					period: year + '-08',
					sales_orders: parseInt(so_total_aug),
					delivery_notes: parseInt(dn_total_aug),
					sales_invoices: parseInt(sinv_total_aug),
					issues: parseInt(iss_total_aug)
				}, {
					period: year + '-09',
					sales_orders: parseInt(so_total_sept),
					delivery_notes: parseInt(dn_total_sept),
					sales_invoices: parseInt(sinv_total_sept),
					issues: parseInt(iss_total_sept)
				}, {
					period: year + '-10',
					sales_orders: parseInt(so_total_oct),
					delivery_notes: parseInt(dn_total_oct),
					sales_invoices: parseInt(sinv_total_oct),
					issues: parseInt(iss_total_oct)
				}, {
					period: year + '-11',
					sales_orders: parseInt(so_total_nov),
					delivery_notes: parseInt(dn_total_nov),
					sales_invoices: parseInt(sinv_total_nov),
					issues: parseInt(iss_total_nov)
				}, {
					period: year + '-12',
					sales_orders: parseInt(so_total_dec),
					delivery_notes: parseInt(dn_total_dec),
					sales_invoices: parseInt(sinv_total_dec),
					issues: parseInt(iss_total_dec)
				}],
				xkey: 'period',
				ykeys: ['sales_orders', 'delivery_notes', 'sales_invoices', 'issues'],
				xLabels: 'month',
				labels: ['Sales Orders', 'Delivery Notes', 'Sales Invoices', 'Issues'],
				xLabelFormat: function (d) {
					var month = new Array(7);
					month[0] = "Januar";
					month[1] = "Februar";
					month[2] = "März";
					month[3] = "April";
					month[4] = "Mai";
					month[5] = "Juni";
					month[6] = "Juli";
					month[7] = "August";
					month[8] = "September";
					month[9] = "Oktober";
					month[10] = "November";
					month[11] = "Dezember";

					return month[d.getMonth()]
				},
				xLabelAngle: 45,
				pointSize: 2,
				hideHover: 'auto',
				resize: true,
				lineColors: ['#f0ad4e', '#5cb85c', '#5e64ff', '#d9534f'],
				fillOpacity: 0.0
			});
			
			document.getElementById("prior_year_qty_based").classList.add("hidden");
		}
	});
	
	// comparative monetary
	frappe.call({
		method: 'libradash.www.libradash.get_comparative_monetary_datas',
		args: {},
		callback: function(r) {
			var sinv_prior = 0;
			var sinv_current = 0;
			var dn_prior = 0;
			var dn_current = 0;
			var so_prior = 0;
			var so_current = 0;
			
			if(r.message.sinv_total.prior) {
				sinv_prior = r.message.sinv_total.prior;
			}
			if(r.message.sinv_total.current) {
				sinv_current = r.message.sinv_total.current;
			}
			
			if(r.message.dn_total.prior) {
				dn_prior = r.message.dn_total.prior;
			}
			if(r.message.dn_total.current) {
				dn_current = r.message.dn_total.current;
			}
			
			if(r.message.so_total.prior) {
				so_prior = r.message.so_total.prior;
			}
			if(r.message.so_total.current) {
				so_current = r.message.so_total.current;
			}
		
			var prior_year = new Date().getFullYear() - 1;
			var current_year = new Date().getFullYear();
			
			Morris.Bar({
				element: 'morris-bar-chart-prior-year-comparative-monetary',
				data: [{
					y: 'Sales Order',
					prior: so_prior,
					current: so_current
				}, {
					y: 'Delivery Note',
					prior: dn_prior,
					current: dn_current
				}, {
					y: 'Sales Invoice',
					prior: sinv_prior,
					current: sinv_current
				}],
				xkey: 'y',
				ykeys: ['prior', 'current'],
				labels: [prior_year, current_year],
				hideHover: 'auto',
				resize: true
			});
			
			document.getElementById("prior_year_comparative_monetary").classList.add("hidden");
		}
	});
	
	// comparative qty
	frappe.call({
		method: 'libradash.www.libradash.get_comparative_qty_based_datas',
		args: {},
		callback: function(r) {
			var sinv_prior = 0;
			var sinv_current = 0;
			var dn_prior = 0;
			var dn_current = 0;
			var so_prior = 0;
			var so_current = 0;
			var iss_prior = 0;
			var iss_current = 0;
			
			if(r.message.sinv_total.prior) {
				sinv_prior = r.message.sinv_total.prior;
			}
			if(r.message.sinv_total.current) {
				sinv_current = r.message.sinv_total.current;
			}
			
			if(r.message.dn_total.prior) {
				dn_prior = r.message.dn_total.prior;
			}
			if(r.message.dn_total.current) {
				dn_current = r.message.dn_total.current;
			}
			
			if(r.message.so_total.prior) {
				so_prior = r.message.so_total.prior;
			}
			if(r.message.so_total.current) {
				so_current = r.message.so_total.current;
			}
			
			if(r.message.iss_total.prior) {
				iss_prior = r.message.iss_total.prior;
			}
			if(r.message.iss_total.current) {
				iss_current = r.message.iss_total.current;
			}
		
			var prior_year = new Date().getFullYear() - 1;
			var current_year = new Date().getFullYear();
			
			Morris.Bar({
				element: 'morris-bar-chart-prior-year-comparative-qty-based',
				data: [{
					y: 'Sales Order',
					prior: so_prior,
					current: so_current
				}, {
					y: 'Delivery Note',
					prior: dn_prior,
					current: dn_current
				}, {
					y: 'Sales Invoice',
					prior: sinv_prior,
					current: sinv_current
				}, {
					y: 'Issue',
					prior: iss_prior,
					current: iss_current
				}],
				xkey: 'y',
				ykeys: ['prior', 'current'],
				labels: [prior_year, current_year],
				hideHover: 'auto',
				resize: true
			});
			
			document.getElementById("prior_year_comparative_qty_based").classList.add("hidden");
		}
	});

    

});
 */
$(function() {

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
	
	var verkauft = 0;
	var verrechnet = 0;
	var ausstehend = 0;
	
	frappe.call({
		method: 'libradash.www.libradash.get_datas',
		args: {},
		callback: function(r) {
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
		
	
			Morris.Area({
				element: 'morris-area-chart',
				data: [{
					period: '2019-01',
					sales_orders: parseInt(dn_total_jan),
					delivery_notes: parseInt(so_total_jan),
					sales_invoices: parseInt(sinv_total_jan),
					issues: parseInt(iss_total_jan)
				}, {
					period: '2019-02',
					sales_orders: parseInt(so_total_feb),
					delivery_notes: parseInt(dn_total_feb),
					sales_invoices: parseInt(sinv_total_feb),
					issues: parseInt(iss_total_feb)
				}, {
					period: '2019-03',
					sales_orders: parseInt(so_total_mar),
					delivery_notes: parseInt(dn_total_mar),
					sales_invoices: parseInt(sinv_total_mar),
					issues: parseInt(iss_total_mar)
				}, {
					period: '2019-04',
					sales_orders: parseInt(so_total_apr),
					delivery_notes: parseInt(dn_total_apr),
					sales_invoices: parseInt(sinv_total_apr),
					issues: parseInt(iss_total_apr)
				}, {
					period: '2019-05',
					sales_orders: parseInt(so_total_may),
					delivery_notes: parseInt(dn_total_may),
					sales_invoices: parseInt(sinv_total_may),
					issues: parseInt(iss_total_may)
				}, {
					period: '2019-06',
					sales_orders: parseInt(so_total_jun),
					delivery_notes: parseInt(dn_total_jun),
					sales_invoices: parseInt(sinv_total_jun),
					issues: parseInt(iss_total_jun)
				}, {
					period: '2019-07',
					sales_orders: parseInt(so_total_jul),
					delivery_notes: parseInt(dn_total_jul),
					sales_invoices: parseInt(sinv_total_jul),
					issues: parseInt(iss_total_jul)
				}, {
					period: '2019-08',
					sales_orders: parseInt(so_total_aug),
					delivery_notes: parseInt(dn_total_aug),
					sales_invoices: parseInt(sinv_total_aug),
					issues: parseInt(iss_total_aug)
				}, {
					period: '2019-09',
					sales_orders: parseInt(so_total_sept),
					delivery_notes: parseInt(dn_total_sept),
					sales_invoices: parseInt(sinv_total_sept),
					issues: parseInt(iss_total_sept)
				}, {
					period: '2019-10',
					sales_orders: parseInt(so_total_oct),
					delivery_notes: parseInt(dn_total_oct),
					sales_invoices: parseInt(sinv_total_oct),
					issues: parseInt(iss_total_oct)
				}, {
					period: '2019-11',
					sales_orders: parseInt(so_total_nov),
					delivery_notes: parseInt(dn_total_nov),
					sales_invoices: parseInt(sinv_total_nov),
					issues: parseInt(iss_total_nov)
				}, {
					period: '2019-12',
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
				resize: true
			});
		}
	});

    Morris.Bar({
        element: 'morris-bar-chart',
        data: [{
            y: '2006',
            a: 100,
            b: 90
        }, {
            y: '2007',
            a: 75,
            b: 65
        }, {
            y: '2008',
            a: 50,
            b: 40
        }, {
            y: '2009',
            a: 75,
            b: 65
        }, {
            y: '2010',
            a: 50,
            b: 40
        }, {
            y: '2011',
            a: 75,
            b: 65
        }, {
            y: '2012',
            a: 100,
            b: 90
        }],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Series A', 'Series B'],
        hideHover: 'auto',
        resize: true
    });

});

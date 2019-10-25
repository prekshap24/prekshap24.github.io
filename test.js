

window.onload = () => {

	var state = [];
	var dData =[];
	fetchData(response => {
		state = response;
		if(state.length) {
			let rowData = [];
			state.map(d => {
				const da = [d.id,d.name,d.start,d.end];
				dData.push(da);

			});
			

			for(var i =0 ;i<dData.length;i++)
			{
				l= (dData[i][2].split("/"));
				dData[i][2]=(l[2]+ ", " + l[1]+", "+l[0]);
				l= (dData[i][3].split("/"));
				dData[i][3]=(l[2]+ ", " + l[1]+", "+l[0]);
			}

			populateData(dData);
			graphifyData(dData);
			document.getElementById('BUTTON').style.visibility = "visible";
			Calculate(dData);


		}

	})


// Fetch json data from https://totalcloud-static.s3.amazonaws.com/intern.json
// using xhr callback
function fetchData(callback) {	
	const xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://totalcloud-static.s3.amazonaws.com/intern.json', true);
	xhr.responseType = 'json';
	xhr.onload = function() {
		const status = xhr.status;
		if(status === 200)
		{
			callback(xhr.response);
		}
		else
		{
			alert("Error while retriving data.")
		}
	};
	xhr.send();	
}

// Put All data in Google charts  with the help of moment.js.
function graphifyData(dData) {	
	google.charts.load('current', {'packages':['timeline']});
	google.charts.setOnLoadCallback(drawChart);
	function drawChart() {
		var container = document.getElementById('timeline');
		var chart = new google.visualization.Timeline(container);
		var dataTable = new google.visualization.DataTable();
		dataTable.addColumn({ type: 'string', id : 'Term'});
		dataTable.addColumn({ type: 'string', id: 'Name' });
		dataTable.addColumn({ type: 'date', id: 'Start' });
		dataTable.addColumn({ type: 'date', id: 'End' });

		for(var i=0 ; i <dData.length;i++)
			dataTable.addRows([[dData[i][0]+"", dData[i][1], new Date(dData[i][2]), new Date(dData[i][3]) ]]);
		var options = 
		{
			timeline: { singleColor: '#f53c2f' },
			hAxis: 
			{
				viewWindow: 
				{
					min: new Date(2019, 8, 1),
					max: new Date(2019, 9, 1)
				},
				format: 'd/MM'	,

			}
		};
		chart.draw(dataTable,options);
	}
}

//Populate Data in HTML TABLE
function populateData(dData){				

	var table = document.getElementById('data-table');

	table.border = "1";
	table.width = "50%";

	for(i=0;i<dData.length;i++)
	{
		row=table.insertRow(-1);
		var cell = row.insertCell(0);
		cell.textContent = dData[i][0];
		cell = row.insertCell(1);
		cell.textContent = dData[i][1];
		cell = row.insertCell(2);
		cell.textContent = moment(dData[i][2]).format('D/MMM');
		cell = row.insertCell(3);
		cell.textContent = moment(dData[i][3]).format('D/MMM');
	}
}

// Calculate the free Date Availaible in using greey approach in O(n) time complexitiy
function Calculate(dData){					
	month =new Array(30);
	for(i =0;i< 30;i++)
		(month[i]=0);

	for(i=0;i<dData.length;i++)
	{
		month[parseInt(moment(dData[i][2]).format('DD'),10)-1]++;
		month[parseInt(moment(dData[i][3]).format('DD'),10)]--;

	}
	prints= "Avalaible days = ";
	for(i=1;i<30;i++)
	{
		month[i]+=month[i-1];
		if(month[i] ==0)
			prints+=( (i+1) + " ");
	}

	document.getElementById('Output').textContent= prints +"";
}
}

// Made the data visible on the webpage.
function visible()		
{
	document.getElementById('Output').style.visibility = "visible";
}
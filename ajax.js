//show table when DOM is loaded
document.addEventListener('DOMContentLoaded', showTable);

//AJAX request to insert new workout
document.getElementById('addWorkout').addEventListener('click', function(event) {
	var req = new XMLHttpRequest();
	var name = document.getElementById('name').value;
	var reps = document.getElementById('reps').value || null;
	var weight = document.getElementById('weight').value || null;
	var date = document.getElementById('date').value || null;
	var unit = document.getElementById('unit').value || null;

	req.open('GET', "/insert?name=" + name + "&reps=" + reps + "&weight=" + weight + "&date=" + date + "&unit=" + unit, true);
	req.addEventListener('load', function() {
		if(req.status >= 200 && req.status < 400) {
			var response = JSON.parse(req.responseText);
			var myId = response.insertId;
			addRow(name, reps, weight, date, unit, myId);
			showTable();
		}
		else {
			console.log("Error in network request: " + req.statusText);
		}
	});
	req.send(null);
	event.preventDefault();
});

//shows the SQL table
function showTable() {
	var req = new XMLHttpRequest();
	req.open('GET', "/show-table", true);
	req.addEventListener('load', function() {
		if(req.status >= 200 && req.status < 400) {
			var response = JSON.parse(req.responseText);
			clearTable();
			for (var p in response) {
				addRow(response[p].name, response[p].reps, response[p].weight, response[p].date, response[p].unit, response[p].id);
			}
		} 
		else {
			console.log("Error in network request: " + req.statusText);
		}
	});
	req.send(null);

}

//function to delete row
function deleteRow(id) {
	var req = new XMLHttpRequest();
	req.open('GET', "/delete?id=" + id, true);
	req.addEventListener('load', function() {
		if(req.status >= 200 && req.status < 400) {
			var response = JSON.parse(req.responseText);
			showTable();
		}
		else {
			console.log("Error in network request: " + req.statusText);
		}
	});
	req.send(null);
}

//AJAX request to update row when update button clicked

document.getElementById('editWorkout').addEventListener('click', function(event) {
	var req = new XMLHttpRequest();
	var name = document.getElementById('editName').value;
	var reps = document.getElementById('editReps').value;
	var weight = document.getElementById('editWeight').value;
	var date = document.getElementById('editDate').value;
	var unit = document.getElementById('editUnit').value;
	var id = document.getElementById('editId').value;

	req.open('GET', "/update?id=" + id + "&name=" + name + "&reps=" + reps + "&weight=" + weight + "&date=" + date + "&unit=" + unit, true);
	req.addEventListener('load', function() {
		if(req.status >= 200 && req.status < 400) {
			var response = JSON.parse(req.responseText);
			showTable();
		}
		else {
			console.log("Error in network request: " + req.statusText);
		}
	});
	req.send(null);
	event.preventDefault();
});

//populate update fields
function getRow(id) {
	var req = new XMLHttpRequest();
	req.open('GET', "/get-row?id=" + id, true);
	req.addEventListener('load', function () {
		if(req.status >= 200 && req.status < 400) {
			var response = JSON.parse(req.responseText);
			document.getElementById('editName').value = response[0].name;
			document.getElementById('editReps').value = response[0].reps;
			document.getElementById('editWeight').value = response[0].weight;
			document.getElementById('editDate').value = response[0].date;
			document.getElementById('editUnit').value = response[0].unit;
		}
		else {
			console.log("Error in network request: " + req.statusText);
		}
	});
	req.send(null);
}

//function to append new row to table
function addRow(name, reps, weight, date, unit, id) {
	var table = document.getElementById('myTable');

    var tr = document.createElement('tr');   

    var tdName = document.createElement('td');
    var tdReps = document.createElement('td');
    var tdWeight = document.createElement('td');
    var tdDate = document.createElement('td');
    var tdUnit = document.createElement('td');
    var tdDelete = document.createElement('td');
    var tdEdit = document.createElement('td');

    var text1 = document.createTextNode(name);
    var text2 = document.createTextNode(reps);
    var text3 = document.createTextNode(weight);
    var text4 = document.createTextNode(date);
    var text5 = document.createTextNode(unit);
    var delButton = document.createElement('button');
    var editButton = document.createElement('button');

    var delButtonText = document.createTextNode('Delete');
    var editButtonText = document.createTextNode('Edit');

    delButton.appendChild(delButtonText);
    delButton.className = "delButton";
    delButton.id = id;

    editButton.appendChild(editButtonText);
    editButton.className = "editButton";
    editButton.id = id;

    tdName.appendChild(text1);
    tdReps.appendChild(text2);
    tdWeight.appendChild(text3);
    tdDate.appendChild(text4);
    tdUnit.appendChild(text5);
    tdDelete.appendChild(delButton);
    tdEdit.appendChild(editButton);

    tr.appendChild(tdName);
    tr.appendChild(tdReps);
    tr.appendChild(tdWeight);
    tr.appendChild(tdDate);
    tr.appendChild(tdUnit);
    tr.appendChild(tdEdit);
    tr.appendChild(tdDelete);

    table.appendChild(tr);

    // document.getElementById('editId').value = id;

    delButton.addEventListener('click', function(event) {
    	deleteRow(delButton.id);
    	event.preventDefault();
    });

    editButton.addEventListener('click', function(event) {
    	getRow(editButton.id);
    	document.getElementById('editId').value = editButton.id;
    	event.preventDefault();

    });
}

//function to clear the table
function clearTable() {
	var myNode = document.getElementById("myTable");

	while (myNode.firstChild) {
    	myNode.removeChild(myNode.firstChild);
	}

	//recreate header
    var header = myNode.createTHead();
    var row = header.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell1.innerHTML = "<b>Name</b>";
    cell2.innerHTML = "<b>Reps</b>";
    cell3.innerHTML = "<b>Weight</b>";
    cell4.innerHTML = "<b>Date</b>";
    cell5.innerHTML = "<b>Lbs/Kg</b>";
}

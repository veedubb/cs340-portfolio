function deleteSale(salesID) {
    // Set our data for our request
    let data = {
        id: salesID
    };

    // Set up our request
    let xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-sale", true);
    xhttp.setRequestHeader("Content-Type", "application/json");

    // Resolution
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            deleteRow(salesID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));
}

// Perform the act of deleting the row
function deleteRow(salesID){
    var table = document.getElementById("sales-table");
    for (let i=0, row; row= table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == salesID) {
            table.deleteRow(i);
            break;
        }
    }
}
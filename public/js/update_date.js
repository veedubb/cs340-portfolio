let updateDateForm = document.getElementById('update-date-form');

updateDateForm.addEventListener("submit", function(e){
    e.preventDefault();

    let inputOrder = document.getElementById('input-order-date');
    let inputDate = document.getElementById('input-new-date');

    let orderValue = inputOrder.value;
    let dateValue = inputDate.value;

    let data = {
        order: orderValue,
        date: dateValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", '/update-date', true);
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = () => {
        if(xhttp.readyState == 4 && xhttp.status == 200){
            updateDateRow(xhttp.response, orderValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200){
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));
})

function updateDateRow(data, orderID){
    let parsedData = JSON.parse(data)
    let table = document.getElementById('sales-table')

    for(let i = 0, row; row = table.rows[i]; i++){
        if (table.rows[i].getAttribute("data-value") == orderID){
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let td1 = updateRowIndex.getElementsByTagName("td")[2];
            td1.innerHTML = parsedData[0].orderDate;
        }
    }
}

let updateOrderForm = document.getElementById('update-order-form');

updateOrderForm.addEventListener("submit", function(f) {
    f.preventDefault();

    let inputOrder = document.getElementById('update-order');
    let inputCustomer = document.getElementById('input-new-customer');

    let orderValue = inputOrder.value;
    let customerValue = inputCustomer.value;

    let data = {
        order: orderValue,
        customer: customerValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", '/put-order', true);
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = () => {
        if(xhttp.readyState == 4 && xhttp.status == 200){
            updateRow(xhttp.response, orderValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200){
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));
})

function updateRow(data, orderID){
    let parsedData = JSON.parse(data)
    let table = document.getElementById('sales-table')

    for(let i = 0, row; row = table.rows[i]; i++){
        if (table.rows[i].getAttribute("data-value") == orderID){
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let td1 = updateRowIndex.getElementsByTagName("td")[3];
            td1.innerHTML = parsedData[0].firstName;
            let td2 = updateRowIndex.getElementsByTagName('td')[4]
            td2.innerHTML = parsedData[0].lastName
            let td3 = updateRowIndex.getElementsByTagName('td')[5]
            td3.innerHTML = parsedData[0].phoneNumber
        }
    }
}


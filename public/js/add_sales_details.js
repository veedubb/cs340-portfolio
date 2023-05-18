let addDetails = document.getElementById('add-sales-details-form');

addDetails.addEventListener("submit", function(e){
    // Prevent form from submitting

    // Get all the form elements
    let inputOrder    = document.getElementById("input-order");
    let inputProduct  = document.getElementById("input-product");
    let inputQty      = document.getElementById("input-qty");
    
    // Get values from fields
    let orderValue      = inputOrder.value;
    let productValue    = inputProduct.value;
    let qtyValue        = inputQty.value;

    // Create JS Object
    let data = {
            order               : orderValue,
            product             : productValue,
            qty                 : qtyValue,
    }
    console.log(data)
    
    // Setup AJAX request
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-sales-details", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX how to resolve
    xhttp.onreadystatechange = () => {
        if(xhttp.readyState == 4 && xhttp.status == 200){
            addRowToTable(xhttp.response)
        }
        else if(xhttp.readyState == 4 && xhttp.status != 200){
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data))
})

/*
addRowToTable = (data) => {
    // Get table
    let currentTable = document.getElementById('sales-details-table');

    // Get index for new row

    // Get DB information
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create row and cells
    let row           = document.createElement("TR");
    let idCell        = document.createElement("TD");
    let orderCell     = document.createElement("TD");
    let dateCell      = document.createElement("TD");
    let orderIdCell   = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell  = document.createElement("TD");
    let productCell   = document.createElement("TD");
    let priceCell     = document.createElement("TD");
    let qtyCell       = document.createElement("TD");

    // Fill cells
    idCell.innerText        = newRow.customerID;
    orderCell.innerText     = newRow.phoneNumber;
    dateCell.innerText      = newRow.firstName;
    orderIdCell.innerText   = newRow.lastName;
    firstNameCell.innerText = newRow.streetAddress;
    lastNameCell.innerText  = newRow.streetAddress2;
    productCell.innerText   = newRow.city;
    priceCell.innerText     = newRow.state;
    qtyCell.innerText       = newRow.zip;

    // Append cells to current table
    row.appendChild(idCell);
    row.appendChild(orderCell);
    row.appendChild(dateCell);
    row.appendChild(orderIdCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(productCell);
    row.appendChild(priceCell);
    row.appendChild(qtyCell);

    console.log(row)

    // Add row to current table
    currentTable.appendChild(row)
}
*/
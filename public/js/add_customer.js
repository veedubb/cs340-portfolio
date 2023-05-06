let addCustomer = document.getElementById('add-customer-form');

addCustomer.addEventListener("submit", function(e){
    // Prevent form from submitting
    e.preventDefault();

    // Get all the form elements
    let inputFirstName    = document.getElementById("input-fname");
    let inputLastName     = document.getElementById("input-lname");
    let inputPhone        = document.getElementById("input-phone");
    let inputAddress1     = document.getElementById("input-address1");
    let inputAddress2     = document.getElementById("input-address2");
    let inputCity         = document.getElementById("input-city");
    let inputState        = document.getElementById("input-state");
    let inputZip          = document.getElementById("input-zip");
    let inputEmail        = document.getElementById("input-email");
    
    // Get values from fields
    let firstNameValue    = inputFirstName.value;
    let lastNameValue     = inputLastName.value;
    let phoneValue        = inputPhone.value;
    let address1Value     = inputAddress1.value;
    let address2Value     = inputAddress2.value;
    let cityValue         = inputCity.value;
    let stateValue        = inputState.value;
    let zipValue          = inputZip.value;
    let emailValue        = inputEmail.value;

    // Create JS Object
    let data = {
            fname               : firstNameValue,
            lname               : lastNameValue,
            phone               : phoneValue,
            address1            : address1Value,
            address2            : address2Value,
            city                : cityValue,
            state               : stateValue,
            zip                 : zipValue,
            email               : emailValue
    }
    console.log(data)
    
    // Setup AJAX request
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX how to resolve
    xhttp.onreadystatechange = () => {
        if(xhttp.readyState == 4 && xhttp.status == 200){
            addRowToTable(xhttp.response)

            inputFirstName.value  = '';
            inputLastName.value   = '';
            inputPhone.value      = '';
            inputAddress1.value   = '';
            inputAddress2.value   = '';
            inputCity.value       = '';
            inputState.value      = '';
            inputZip.value        = '';
            inputEmail.value      = '';
        }
        else if(xhttp.readyState == 4 && xhttp.status != 200){
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data))
})

addRowToTable = (data) => {
    // Get table
    let currentTable = document.getElementById('customers-table');

    // Get index for new row
    let newRowIndex = currentTable.rows.length;

    // Get DB information
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create row and cells
    let row           = document.createElement("TR");
    let idCell        = document.createElement("TD");
    let phoneCell     = document.createElement("TD");
    let fNameCell     = document.createElement("TD");
    let lNameCell     = document.createElement("TD");
    let addr1Cell     = document.createElement("TD");
    let addr2Cell     = document.createElement("TD");
    let cityCell      = document.createElement("TD");
    let stateCell     = document.createElement("TD");
    let zipCell       = document.createElement("TD");
    let emailCell     = document.createElement("TD");

    // Fill cells
    idCell.innerText    = newRow.customerID;
    phoneCell.innerText = newRow.phoneNumber;
    fNameCell.innerText = newRow.firstName;
    lNameCell.innerText = newRow.lastName;
    addr1Cell.innerText = newRow.streetAddress;
    addr2Cell.innerText = newRow.streetAddress2;
    cityCell.innerText  = newRow.city;
    stateCell.innerText = newRow.state;
    zipCell.innerText   = newRow.zip;
    emailCell.innerText = newRow.emailAddress;

    // Append cells to current table
    row.appendChild(idCell);
    row.appendChild(fNameCell);
    row.appendChild(lNameCell);
    row.appendChild(phoneCell);
    row.appendChild(addr1Cell);
    row.appendChild(addr2Cell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);
    row.appendChild(zipCell);
    row.appendChild(emailCell);

    // Add row to current table
    currentTable.appendChild(row)
}
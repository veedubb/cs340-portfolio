const addCustomer = document.getElementById('add-customer-form');

addCustomer.addEventListener("submit", function(e){
    
    // Prevent form from submitting
    e.preventDefault();

    // Get all the form elements
    const inputFirstName    = document.getElementById("");
    const inputLastName     = document.getElementById("");
    const inputPhone        = document.getElementById("");
    const inputAddress1     = document.getElementById("");
    const inputAddress2     = document.getElementById("");
    const inputCity         = document.getElementById("");
    const inputState        = document.getElementById("");
    const inputZip          = document.getElementById("");
    const inputEmail        = document.getElementById("");
    
    // Get values from fields
    const firstNameValue    = inputFirstName.value;
    const lastNameValue     = inputLastName.value;
    const phoneValue        = inputPhone.value;
    const address1Value     = inputAddress1.value;
    const address2Value     = inputAddress2.value;
    const cityValue         = inputCity.value;
    const stateValue        = inputState.value;
    const zipValue          = inputZip.value;
    const emailValue        = inputEmail.value;


    // Create JS Object
    const data = {
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

    // Setup AJAX request
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX how to resolve
    xhttp.onreadystatechange = () => {
        if(xhttp.readyState == 4 && xhttp.status == 200){
            addRowToTable(xhttp.response)

            inputFirstName  = '';
            inputLastName   = '';
            inputPhone      = '';
            inputAddress1   = '';
            inputAddress2   = '';
            inputCity       = '';
            inputState      = '';
            inputZip        = '';
            inputEmail      = '';
        }
        else if(xhttp.readyState == 4 && xhttp.status != 200){
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data))
})

addRowToTable = (data) => {
    // Get table
    const currTable = document.getElementById("add-customer-table");

    // Get index for new row
    const newRowIndex = currTable.rows.length;

    // Get DB information
    const parsedData = JSON.parse(data);
    const newRow = parsedData[parsedData.length - 1]

    // Create row and cells
    const row           = document.createElement("tr");
    const idCell        = document.createElement("td");
    const phoneCell     = document.createElement("td");
    const fNameCell     = document.createElement("td");
    const lNameCell     = document.createElement("td");
    const addr1Cell     = document.createElement("td");
    const addr2Cell     = document.createElement("td");
    const cityCell      = document.createElement("td");
    const stateCell     = document.createElement("td");
    const zipCell       = document.createElement("td");
    const emailCell     = document.createElement("td");

    // Fill cells
    idCell.innerText = newRow.id;
    phoneCell.innerText = newRow.phoneNumber;
    fNameCell.innerText = newRow.firstName;
    lNameCell.innerText = newRow.lastName;
    addr1Cell.innerText = newRow.streetAddress;
    addr2Cell.innerText = newRow.streetAddress2;
    cityCell.innerText = newRow.city;
    stateCell.innerText = newRow.state;
    zipCell.innerText = newRow.zip;
    emailCell.innerText = newRow.emailAddress;

    // Append cells to current table
    row.append(idCell);
    row.append(phoneCell);
    row.append(fNameCell);
    row.append(lNameCell);
    row.append(addr1Cell);
    row.append(addr2Cell);
    row.append(cityCell);
    row.append(stateCell);
    row.append(zipCell);
    row.append(emailCell);

    // Add row to current table
    currTable.appendChild(row);
}
let addCustomer = document.getElementById('add-customer-form');
console.log(addCustomer)

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
    let currTable = document.getElementById("add-customer-form");
    console.log(currTable)
    // Get index for new row

    // Get DB information
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create row and cells
    let row           = document.createElement("tr");
    let idCell        = document.createElement("td");
    let phoneCell     = document.createElement("td");
    let fNameCell     = document.createElement("td");
    let lNameCell     = document.createElement("td");
    let addr1Cell     = document.createElement("td");
    let addr2Cell     = document.createElement("td");
    let cityCell      = document.createElement("td");
    let stateCell     = document.createElement("td");
    let zipCell       = document.createElement("td");
    let emailCell     = document.createElement("td");

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
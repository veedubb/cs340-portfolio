/*
    SETUP
*/

const express   = require('express');
const app       = express();
const PORT      = 2666;
const db        = require('./database/db-connector')
const { engine } = require('express-handlebars');
const exphbs = require('express-handlebars');
app.engine('.hbs', engine({extname: ".hbs",}));
app.set('view engine', '.hbs');
app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))



/*
    ROUTES
*/

/*
    GET HOMEPAGE
*/
app.get('/', function(req, res)
    {
        res.render('index');
    });

/*
    GET CUSTOMERS PAGE
*/
app.get('/customers', function(req, res)
    {
        let query1 = "SELECT * FROM Customers;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('customers', {data: rows});
    })
});

/*
    GET PRODUCTS PAGE
*/
app.get('/products', function(req, res)
{
    let query1 =    `SELECT 	Products.productID, Products.name, Products.storeCost, Products.salePrice, Products.developer, Products.publisher, Suppliers.name AS supplier
                    FROM 		Products
                    INNER JOIN	Suppliers
                    ON			Products.supplierID = Suppliers.supplierID
                    ORDER BY	Products.name ASC;`;
    let query2 =    `SELECT * FROM ProductTypes`
    let query3 =    `SELECT * FROM Suppliers`
    db.pool.query(query1, function(error, rows, fields){
        let products = rows
        db.pool.query(query2, (error, rows, fields) => {
            let productTypes = rows
            db.pool.query(query3, (error, rows, fields) =>{
                let suppliers = rows
                res.render('products', {data: products, types: productTypes, suppliers: suppliers})
                console.log(rows)
            })
        })
    })
});

/*
    GET SALES PAGE
*/
app.get('/sales', function(req, res){
    let query1 =    `SELECT Sales.orderID, Sales.orderDate, Customers.firstName, Customers.lastName, Customers.phoneNumber 
                    FROM Sales 
                    INNER JOIN Customers 
                    ON Sales.customerID = Customers.customerID 
                    ORDER BY Sales.orderDate DESC;`;
    let query2 =    `SELECT customerID, firstName, lastName, phoneNumber
                    FROM Customers`
    db.pool.query(query1, function(error, rows, fields){
        let sales = rows
        db.pool.query(query2, (error, rows, fields) =>{
            let customers = rows
            console.log(customers)
            return res.render('sales', {data: sales, people: customers})
        })
    })
});

/*
    GET SUPPLIERS PAGE
*/
app.get('/suppliers', function(req, res){
    let query1 = "SELECT * FROM Suppliers;";
    db.pool.query(query1, function(error, rows, fields){
        res.render('suppliers', {data: rows})
    })
});

/*
    GET PRODUCT TYPES PAGE
*/
app.get('/product-types', function(req, res){
    let query1 = "SELECT * FROM ProductTypes;";
    db.pool.query(query1, function(error, rows, fields){
        res.render('product-types', {data: rows})
    })
});

/*
    GET SALES DETAILS PAGE
*/
app.get('/sales-details', function(req, res){
    let query1 =    `SELECT SalesDetails.saleDetailID, Sales.orderDate, Sales.orderID, Customers.firstName, Customers.lastName, Products.name AS productName, Products.salePrice, SalesDetails.qtyPurchased
                    FROM 		SalesDetails
                    INNER JOIN	Sales
                    ON			SalesDetails.orderID = Sales.orderID
                    INNER JOIN 	Customers
                    ON 			Sales.customerID = Customers.customerID
                    INNER JOIN 	Products
                    ON			SalesDetails.productID = Products.productID
                    ORDER BY 	Sales.orderID ASC;`;
    let query2 =    `SELECT *
                    FROM Products;`;
    let query3 =    `SELECT Sales.orderID, Sales.orderDate, Customers.lastName
                    FROM Sales
                    INNER JOIN Customers
                    ON Sales.customerID = Customers.customerID;`
    db.pool.query(query1, function(error, rows, fields){
        let details = rows;
        db.pool.query(query2, (error, rows, fields) => {
            let products = rows;
            db.pool.query(query3, (error, rows, fields) => {
                let orders = rows;
                console.log(orders)
                return res.render('sales-details', {data: details, products: products, sales: orders})
            })
        })
    })
    
})

/*
    POST TO CUSTOMERS PAGE
    Adding new customers
*/
app.post('/add-customer', function(req, res){
    var data = req.body

    if (!data.address2){
        data.address2 = null
    } else {
        data.address2 = "'" + data.address2 + "'"
    }

    if (!data.email){
        data.email = null
    } else {
        data.email = "'" + data.email + "'"
    }

    query1 =    `INSERT INTO Customers(
                firstName,
                lastName,
                phoneNumber,
                streetAddress,
                streetAddress2,
                city,
                state,
                zip,
                emailAddress
            )
            VALUES
            ('${data.fname}', '${data.lname}', ${data.phone}, '${data.address1}', ${data.address2}, '${data.city}', '${data.state}', ${data.zip}, ${data.email});`   
            db.pool.query(query1, function(error, rows, fields){
        if (error){
            console.log(error);
            res.sendStatus(400);
        }
        else {
            query2 = "SELECT * FROM Customers";
            db.pool.query(query2, function(error, rows, fields){
                if(error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                    res.send(rows);
                }
            })
        }
    })


});

/*
    POST SALES PAGE
    Add a Sale
*/
app.post('/add-sales', function(req, res){
    let data = req.body
    console.log(data)

    let query1 =    `INSERT INTO Sales(
                    orderDate,
                    customerID
                    )
                    VALUES('${data['input-date']}', '${data['input-customer']}');`
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else{
            res.redirect('/sales')
        }
    })
})

/*
    POST PRODUCTS PAGE
    Add a Product
*/
app.post('/add-product', function(req, res){
    let data = req.body
    if (!data['input-developer']){
        data['input-developer'] = null
    } else {
        data['input-developer'] = "'" + data['input-developer'] + "'"
    }

    if (!data['input-publisher']){
        data['input-publisher'] = null
    } else {
        data['input-publisher'] = "'" + data['input-publisher'] + "'"
    }

    if(!data['input-productType']){
        data['input-productType'] = null
    }
    console.log(data)
    let richardButtkiss =   `INSERT INTO Products(
                                name,
                                storeCost,
                                salePrice,
                                developer,
                                publisher,
                                productTypeID,
                                supplierID
                            )
                            VALUES(
                                '${data['input-name']}',
                                ${data['input-storeCost']},
                                ${data['input-salePrice']},
                                ${data['input-developer']},
                                ${data['input-publisher']},
                                ${data['input-productType']},
                                ${data['input-supplier']}
                            );`
    db.pool.query(richardButtkiss, function(error, rows, fields){
        if(error){
            console.log(error)
            res.sendStatus(400)
        }
        else{
            res.redirect('/products')
        }
    })
})


/*
    POST SALES DETAILS PAGE
    Add line item to Sale
*/
app.post('/add-sales-details', function(req, res){
    let data = req.body
    console.log(data)

    let query1 =    `INSERT INTO SalesDetails(
                    orderID,
                    productID,
                    qtyPurchased
            )
            VALUES
            ('${data['input-order']}', '${data['input-product']}', ${data['input-qty']});`   
        db.pool.query(query1, function(error, rows, fields){
            if (error){
                console.log(error);
                res.sendStatus(400);
            }
            else {
                res.redirect('/sales-details')
            }
    })


});

/*
    POST SUPPLIERS PAGE
    Add a Supplier
*/
app.post('/add-supplier', function(req, res){
    let data = req.body
    console.log(data)

    if (!data['input-address2']){
        data['input-address2'] = null
    }
    else {
        let temp = data['input-address2']
        data['input-address2'] = "'" + temp + "'"
    }

    let query1 =    `INSERT INTO Suppliers(
                        name,
                        phoneNumber,
                        emailAddress,
                        streetAddress,
                        streetAddress2,
                        city,
                        state,
                        zip
                    )
                    VALUES(
                        '${data['input-name']}',
                        ${data['input-phone']},
                        '${data['input-email']}',
                        '${data['input-address1']}',
                        ${data['input-address2']},
                        '${data['input-city']}',
                        '${data['input-state']}',
                        ${data['input-zip']}
                    );`
    db.pool.query(query1, function(error, rows, fields){
        if (error){
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.redirect('/suppliers')
        }
    })
})

/*
    POST PRODUCT TYPES PAGE
    Add a Product Type
*/
app.post('/add-product-type', function(req, res){
    let data = req.body
    console.log(data)

    let query1 =    `INSERT INTO ProductTypes(
                        typeName,
                        typeDescription
                    )
                    VALUES(
                        '${data['input-typeName']}',
                        '${data['input-typeDesc']}'
                    );`
    db.pool.query(query1, function(error, rows, fields){
        if (error){
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.redirect('/product-types')
        }
    })
})

/*
    DELETE SALES PAGE
    Refund a Sale
*/
app.delete('/delete-sale', function(req, res, next){
    let data = req.body;
    let salesId = parseInt(data.id);
    console.log(data)
    let deleteSalesDetails  = `DELETE FROM SalesDetails WHERE orderID = ?`;
    let deleteSales = `DELETE FROM Sales WHERE orderID = ?`;

    db.pool.query(deleteSalesDetails, [salesId], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            db.pool.query(deleteSales, [salesId], function(error, rows, fields){
                if(error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                    res.sendStatus(204)
                }
            })
        }
    })

}) 

/*
    PUT SALES PAGE
    Update a Sale
*/
app.put('/put-order', function(req, res, next){
    let data = req.body;
    console.log(data)

    let order = data.order
    let newCustomer = data.customer

    let query1 = `UPDATE Sales SET customerID = ? WHERE Sales.orderID = ?`;
    let selectCust = `SELECT * FROM Customers WHERE customerID = ?`;

    db.pool.query(query1, [newCustomer, order], function(error, rows, fields){
        if(error){
            console.log(error)
            res.sendStatus(400)
        }
        else{
            db.pool.query(selectCust, [newCustomer], function(error, rows, fields){
                if(error){
                    console.log('Query 1 Successful.')
                    console.log(error)
                    res.sendStatus(400)
                }
                else{
                    console.log('Query 2 successful.')
                    res.send(rows)
                }
            })
        }
    })
})

app.put('/update-date', function(req, res, next){
    let data = req.body
    console.log(data)

    let order = data.order
    let date = data.date

    let query1 = `UPDATE Sales SET orderDate = ? WHERE Sales.orderID = ?`
    let query2 = `SELECT * FROM Sales WHERE orderDate = ?`

    db.pool.query(query1, [date, order], function(error, rows, fields){
        if(error){
            console.log(error)
            res.sendStatus(400)
        }
        else{
            db.pool.query(query2, [date], function(error, rows, fields){
                if(error){
                    console.log('Query 1 Successful.')
                    console.log(error)
                    res.sendStatus(400)
                }
                else{
                    console.log('Query 2 successful.')
                    res.send(rows)
                }
        })
        }
    })
})

/*
    LISTENER
*/

app.listen(PORT, function() {
    console.log(`Express started on http://localhost:${PORT}; press Ctrl + C to terminate.`)
});
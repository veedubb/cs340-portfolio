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
    let query1 =    `SELECT 	Products.productID, Products.name, Products.storeCost, Products.salePrice, Products.developer, Products.publisher, ProductTypes.typeName, Suppliers.name AS supplier
                    FROM 		Products
                    INNER JOIN 	ProductTypes
                    ON			Products.productTypeID = ProductTypes.productTypeID
                    INNER JOIN	Suppliers
                    ON			Products.supplierID = Suppliers.supplierID
                    ORDER BY	Products.name ASC;`;
    db.pool.query(query1, function(error, rows, fields){
        res.render('products', {data: rows})
        console.log(rows)
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
    db.pool.query(query1, function(error, rows, fields){
        res.render('sales', {data: rows})
        console.log(rows)
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
    let query1 =    `SELECT 		SalesDetails.saleDetailID, Sales.orderDate, Sales.orderID, Customers.firstName, Customers.lastName, Products.name AS productName, Products.salePrice, SalesDetails.qtyPurchased
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
    }

    if (!data.email){
        data.email = null
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
            query2 = "SELECT * FROM Customers;";
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


/*
    POST PRODUCTS PAGE
    Add a Product
*/


/*
    POST SALES DETAILS PAGE
    Add line item to Sale
*/


/*
    POST SUPPLIERS PAGE
    Add a Supplier
*/

/*
    POST PRODUCT TYPES PAGE
    Add a Product Type
*/

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
    
    Update a Product
*/


/*
    LISTENER
*/

app.listen(PORT, function() {
    console.log(`Express started on http://localhost:${PORT}; press Ctrl + C to terminate.`)
});
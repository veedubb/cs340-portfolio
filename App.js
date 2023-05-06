/*
    SETUP
*/

const express   = require('express');
const app       = express();
const PORT      = 2666;
const db        = require('./database/db-connector')
const { engine } = require('express-handlebars');
const exphbs = require('express-handlebars');
app.engine('.hbs', engine({extname: ".hbs"}));
app.set('view engine', '.hbs');
app.use(express.static(__dirname + '/public'));


/*
    ROUTES
*/

app.get('/', function(req, res)
    {
        res.render('index');
    });

app.get('/customers', function(req, res)
    {
        let query1 = "SELECT * FROM Customers;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('customers', {data: rows});
    })
});

app.get('/products', function(req, res)
{
    let query1 =    `SELECT 		Products.productID, Products.name, Products.storeCost, Products.salePrice, Products.developer, Products.publisher, ProductTypes.typeName, Suppliers.name AS supplier
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

app.get('/suppliers', function(req, res){
    let query1 = "SELECT * FROM Suppliers;";
    db.pool.query(query1, function(error, rows, fields){
        res.render('suppliers', {data: rows})
    })
});

app.get('/product-types', function(req, res){
    let query1 = "SELECT * FROM ProductTypes;";
    db.pool.query(query1, function(error, rows, fields){
        res.render('product-types', {data: rows})
    })
});

app.post('/add-customer', function(req, res){
    var data = req.body

    var addr2 = parseInt(data.address2)
    if (addr2 === undefined){
        addr2 = 'NULL'
    }

    var email = parseInt(data.email)
    if (email === undefined){
        email = 'NULL'
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
            VALUES(
                ${data.fname},
                ${data.lname},
                ${data.phone},
                ${data.address1},
                ${data.address2},
                ${data.city},
                ${data.state},
                ${data.zip},
                ${data.email}
            );`
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


})


/*
    LISTENER
*/

app.listen(PORT, function() {
    console.log(`Express started on http://localhost:${PORT}; press Ctrl + C to terminate.`)
});
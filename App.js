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
    let query1 = "SELECT * FROM Products;";
    db.pool.query(query1, function(error, rows, fields){
        res.render('products', {data: rows})
    })
});

app.get('/sales', function(req, res){
    let query1 = "SELECT * FROM Sales;";
    db.pool.query(query1, function(error, rows, fields){
        res.render('sales', {data: rows})
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


/*
    LISTENER
*/

app.listen(PORT, function() {
    console.log(`Express started on http://localhost:${PORT}; press Ctrl + C to terminate.`)
});
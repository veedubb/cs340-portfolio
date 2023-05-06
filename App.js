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

app.get('/products', function(req, res){
    res.render('products')
});

app.get('/sales', function(req, res){
    res.render('sales')
});

app.get('/suppliers', function(req, res){
    res.render('suppliers')
});

app.get('/product-types', function(req, res){
    res.render('product-types')
});


/*
    LISTENER
*/

app.listen(PORT, function() {
    console.log(`Express started on http://localhost:${PORT}; press Ctrl + C to terminate.`)
});
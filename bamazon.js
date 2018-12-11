//npm init -y
//npm install mysql
//npm install inquirer
//npm install dotenv

var mysql = require('mysql');
var inquirer = require('inquirer');
require('dotenv').config()

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'BAMAZON'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('connected!');
    connection.query('SELECT * FROM PRODUCTS', function (error, results, fields) {
        fullResults = results
        if (error) throw error;
        logResults(results);
        inquireUser();
    });
});





function inquireUser() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'prodID',
                message: 'Please enter the Product ID of the item you would like to buy'
            },
            {
                type: 'input',
                name: 'units',
                message: 'How many units would you like to purchase?'
            }
        ])
        .then(answers => {
            var prodID = answers.prodID;
            var unitsBought = answers.units;
            stockCheck(prodID, unitsBought);

        });
}




function stockCheck(prodID, units) {
    connection.query('SELECT * FROM PRODUCTS WHERE ITEM_ID =?', prodID, function (error, results) {
        var product = results[0].product_name;
       
        if (error) throw error;
        

        if (units > results[0].stock_quantity) {
            console.log('Insufficient Quantity!  Not enough ' + product + ' in stock...') // order amount of units exceeds the amount of units in stock
            connection.end();
            inquireUser();
        }
        else {
            fulfillOrder(units, prodID)                         // if units ordered  is less than units in stock, fulfill the order
            console.log('You successfully purchased ' + units + " unit(s) of " + product);
            connection.end();
        }

    });
}

function fulfillOrder(units, prodID) {
    connection.query('UPDATE BAMAZON.PRODUCTS SET STOCK_QUANTITY = STOCK_QUANTITY - ? WHERE ITEM_ID = ?', [units, prodID],
        function (error, results) {
            if (error) throw error;
            logResults(results);
        });
}

function logResults(results) {
    for (i = 0; i < results.length; i++) {
        var id = results[i].item_id;
        var product = results[i].product_name;
        var department = results[i].department_name;
        var price = results[i].price;
        var stock = results[i].stock_quantity;
        console.log(id + ' | ' + product + ' | ' + department + ' | ' + price + ' | ' + stock + ' | ' + '\n')
    }
}
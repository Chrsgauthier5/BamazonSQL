//npm init -y
//npm install mysql
//npm install inquirer
//npm install dotenv

var mysql = require('mysql');
var inquirer = require('inquirer');
var cTable = require('console.table');
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
    console.log('connected!\n');
    connection.query('SELECT * FROM PRODUCTS', function (error, results) {
        const table = results;
        console.table(table);
        if (error) throw error;
        inquireUser();
    });
});





function inquireUser() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'prodID',
                message: 'Please enter the item_id of the item you would like to buy'
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
        var price = results[0].price

        if (error) throw error;


        if (units > results[0].stock_quantity) {
            console.log('Insufficient Quantity!  Not enough ' + product + ' in stock...') // order amount of units exceeds the amount of units in stock
            inquireUser();
        }
        else {
            
            fulfillOrder(units, prodID)                         // if units ordered  is less than units in stock, fulfill the order
            console.log('You successfully purchased ' + units + " unit(s) of " + product + ".\n" +
                "This cost you $" + price * units);
            connection.end();
        }

    });
}

function fulfillOrder(units, prodID) {
    connection.query('UPDATE BAMAZON.PRODUCTS SET STOCK_QUANTITY = STOCK_QUANTITY - ? WHERE ITEM_ID = ?', [units, prodID],
        function (error, results) {
            if (error) throw error;
        });
    connection.query('SELECT * FROM PRODUCTS WHERE ITEM_ID =?', prodID,
        function (error, results) {
            if (error) throw error;
            logResults(results);
        });

}

function logResults(results) {
    console.table(results);
    
}


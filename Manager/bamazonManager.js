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

inquireManager();


function inquireManager() {
    inquirer
        .prompt([
            {
                type: 'rawlist',
                name: 'dashboard',
                message: 'What action would you like to perform?',
                choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
            }
        ])
        .then(answers => {

            switch (answers.dashboard) {

                case 'View Products for Sale':
                    viewProducts();
                    break;

                case 'View Low Inventory':
                    viewLowInv();
                    break;

                case 'Add to Inventory':
                    addInvInquire();
                    break;

                case 'Add New Product':
                    newProductInquire();
                    break;

                default:
                    console.log("Please pick a valid option");
                    break;
            }
        });
}




//--------------------------------------------------------- View Products for Sale ----------------------------------------------------------------//

function viewProducts() {
    connection.query('SELECT * FROM PRODUCTS', function (error, results) {
        if (error) throw error;
        console.table(results);
        inquireManager();
    });
}


//--------------------------------------------------------- View Low Inventory ----------------------------------------------------------------//

function viewLowInv() {
    connection.query('SELECT * FROM PRODUCTS WHERE STOCK_QUANTITY < 5', function (error, results) {
        if (error) throw error;
        console.table(results);
        inquireManager();
    });
}

//---------------------------------------------------------Add Inv Inquire -------------------------------------------------------------//
function addInvInquire() {
    connection.query('SELECT PRODUCT_NAME FROM PRODUCTS', function (error, results) {
        if (error) throw error;
        items = [];
        for (i = 0; i < results.length; i++) {
            items.push(results[i].PRODUCT_NAME);
        }
        addInventory();
    });

    function addInventory() {
        inquirer
            .prompt([
                {
                    type: 'rawlist',
                    name: 'product',
                    message: 'Which item would you like to add more inventory to?',
                    choices: items
                },
                {
                    type: 'input',
                    name: 'units',
                    message: 'How many units would you like to add to the inventory?'
                }
            ])
            .then(answers => {
                var product = answers.product;
                var units = answers.units;
                connection.query('UPDATE PRODUCTS SET STOCK_QUANTITY = STOCK_QUANTITY + ? WHERE PRODUCT_NAME = ?', [units, product], function (error, results) {
                    if (error) throw error;
                    console.log('------------------------------------------------------------------------------\n')
                    console.log("Successfully increased the inventory of " + product + " by " + units + " units!");
                    
                });
                connection.query('SELECT * FROM PRODUCTS', function (error, results) {
                    if (error) throw error;
                    console.log('------------------------------------------------------------------------------\n')
                    console.table(results);
                    inquireManager();
                });

            });
    }
}

//-------------------------------------------New Item Add------------------------------------------------------------------------------//


function newProductInquire() {

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'newProduct',
                message: 'Please enter the name of the product you want to add'
            },
            {
                type: 'input',
                name: 'department',
                message: 'What department category will this item be put in?'
            },
            {
                type: 'input',
                name: 'price',
                message: 'What is the price per unit of this new item?'
            },
            {
                type: 'input',
                name: 'stock',
                message: 'What will be the initial stock quantity of this item?'
            }
        ])
        .then(answers => {
            var product = answers.newProduct;
            var department = answers.department;
            var price = answers.price;
            var stock = answers.stock;
            newProduct(product, department, price, stock)
        });
}

// -------------------------------------------------------------- Add new Product to DB from New Product Inquire info --------------------------------------------------------//

function newProduct(prod, dept, price, stock) {

        connection.query('INSERT INTO PRODUCTS (PRODUCT_NAME, DEPARTMENT_NAME, PRICE, STOCK_QUANTITY) VALUES (?,?,?,?)', [prod, dept, price, stock],
            function (error, results) {
                if (error) throw error;
                console.log('Successfully added ' + prod + ' to the databse!');
            });
        connection.query('SELECT * FROM PRODUCTS', function (error, results) {
            if (error) throw error;
            console.table(results);
            inquireManager();
        });
}


drop database if exists BAMAZON;

create database BAMAZON;

use BAMAZON;

create table BAMAZON.PRODUCTS(
item_id int not null auto_increment primary key,
product_name varchar(100) not null,
department_name varchar(50) not null,
price decimal(10, 4) not null,
stock_quantity int unsigned not null

);

insert into PRODUCTS(product_name, department_name, price, stock_quantity)
values ('Super Soaker', 'Toys', 40.00, 100), ('Sleeping Bag', 'Outdoors', 29.95, 40), ('Nintendo Switch', 'Video Games', 299.99, 30),
('Apple Watch', 'Electronics', 250.00, 200), ('Pogo Stick', 'Toys', 89.99, 5), ('Zelda Breath of the Wild', 'Video Games', 59.95, 1000),
('Keurig Coffee Maker', 'Home/Kitchen', 99.00, 25), ('Electric Toothbrush', 'Health & Beauty', 50.00, 15), ('60" 4K Televsion ', 'Electronics', 499.95, 16),
('Ticonderoga Pencil', 'Office Supplies', 0.25, 100000);


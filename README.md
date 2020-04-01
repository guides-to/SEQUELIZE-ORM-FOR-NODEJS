# Course Outline

**Prerequisite Knowledge**
+ basics of nodejs

**What will be covered in this course**

In this course you will learn how to make the data driven application in nodejs using SQL database. And moreover, you will learn how to deal will database in using ORMs

**Requirements**
+ nodejs runtime
+ npm / yarn
+ any text editor
+ any sql server (we will be using MariaDB in this course)

**Project**

The project is in `project` directory

**NOTE :** This course if made with jupyter notebook. If you want the notebook drop a message at tbhaxor@gmail.com

# Introduction to SQL

A **database** is an organized collection of data, generally stored and accessed electronically from a computer system. To communicate with this database there is standard language, known as **SQL** and abbv. for **S**tructured **Q**uery **L**anguage.

**Need of database**
+ store data and make it easily accessible
+ persistent and fast retrival
+ fault tolerance
+ need not to open gigantic set fo file to look for a piece of information

There are basically two types of database SQL and NoSQL

In case of SQL
+ the data is organised in table like structure
+ provided linking of tables via **relationships**
+ for each table, there is fixed schema and it should be followed while adding new entry
+ database consists of tables, tables consists of rows and columns, the entry is added in row is often called record
+ datatypes in sql &rarr; https://mariadb.com/kb/en/data-types/

For example, creating a table named _student_ in database _school_
```sql
CREATE TABLE school.students (
    student_id int,
    last_name varchar(255),
    first_name varchar(255),
    address varchar(255),
);
```

This  `create table ***`  is a SQL query to create a table in the database (condition, the database should exists)

Now if you want to select all the records,
```sql
SELECT * FROM school.students;
```

In case of NoSQL
+ doesn't follow the approach that SQL follows
+ uses different query langauge
+ database contains collections, collections contains documents. These documents are the records
+ document doesn't have to stick to same schema
+ stores the data in binary json (called [bson](http://bsonspec.org/))
+ there are no relations, duplicattion of data is preffered


**SQL vs NoSQL. What to choose and when** <br>
Horizontal scaling is simply adding more serves to the existing app, provinding more resources. Where as vertical scalling is simply adding more resources to the same server.

Horizontal scaling is more challenging than vertical scaling

![](https://i.ibb.co/GnVYhRW/image.png)

In case of SQL
+ horizontal scaling is very difficult, but vertical scaling is easy
+ limitations of read/write queries per seconds
+ use this when you have multiple data, and you want data aggregation to be very easy

In case of NoSQL
+ both horizontal and vertical scaling are easy
+ great performance for mass read/write operations
+ use this when you have to deal with big data

**Note :** It all depends what type of data you have

## Setting up MariaDB

Installing MariaDB on Windows: [Documentation](https://mariadb.com/kb/en/installing-mariadb-msi-packages-on-windows/) | [Video](https://www.youtube.com/watch?v=lH_2taJUOj4)

Installing Mariadb on Linux: [Documentation](https://downloads.mariadb.org/mariadb/repositories/#mirror=one) | [Video](https://www.youtube.com/watch?v=7H0manxJzFw)

### Connecting to the Server from NodeJS application

Installing the nodejs package

```bash
# using yarn
yarn add mysql2

# using npm
npm i mysql2
```


```javascript
// requiring the packages
const mysql = require("mysql2");
```

You can directly connect to the server using  mysql.createConnection , but it will create only one connection which has to be closed after running the query. Opening and closing connection for every query doesn't seems to be good approach for larger application. So you can create a pool of the connection to reuse the same

Read more about connection pooling: https://en.wikipedia.org/wiki/Connection_pool


```javascript
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "node_orm",
    password: "test@1234",
});

const connection = pool.promise();
```


```javascript
connection.execute(`CREATE  TABLE  products (
     id  INT NOT NULL AUTO_INCREMENT,
     title  VARCHAR(255) NOT NULL,
     price  DOUBLE UNSIGNED NOT NULL,
     description  VARCHAR(255) NOT NULL,
     PRIMARY KEY( id )
);`)
    .then(console.log)
    .catch(console.warn)
```

    [
      ResultSetHeader {
        fieldCount: 0,
        affectedRows: 0,
        insertId: 0,
        info: '',
        serverStatus: 2,
        warningStatus: 0
      },
      undefined
    ]


## Running Basic CRUD Quering

### Create


```javascript
connection.execute(`INSERT INTO products (title, price, description) 
                    VALUES ('ORM in Nodejs', 499.99, 'A book on introduction on ORM in nodejs')`)
    .then(console.log)
    .catch(console.warn)
```

    [
      ResultSetHeader {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 1,
        info: '',
        serverStatus: 2,
        warningStatus: 0
      },
      undefined
    ]


### Read


```javascript
// reading all the data
connection.execute(`SELECT * FROM products;`)
    .then(_ => console.log(_[0]))
    .catch(console.warn)
```

    [
      BinaryRow {
        id: 1,
        title: 'ORM in Nodejs',
        price: 499.99,
        description: 'A book on introduction on ORM in nodejs'
      }
    ]



```javascript
// reading a specific record
connection.execute(`SELECT * FROM products WHERE id=1;`)
    .then(_ => console.log(_[0]))
    .catch(console.warn)
```

    [
      BinaryRow {
        id: 1,
        title: 'ORM in Nodejs',
        price: 499.99,
        description: 'A book on introduction on ORM in nodejs'
      }
    ]


### Update


```javascript
connection.execute(`UPDATE products SET title='[BOOK] ORM for Nodejs' WHERE id=1;`)
    .then(_ => console.log(_[0]))
    .catch(console.warn)
```

    ResultSetHeader {
      fieldCount: 0,
      affectedRows: 1,
      insertId: 0,
      info: 'Rows matched: 1  Changed: 1  Warnings: 0',
      serverStatus: 2,
      warningStatus: 0,
      changedRows: 1
    }



```javascript
// reading a specific record
connection.execute(`SELECT * FROM products WHERE id=1;`)
    .then(_ => console.log(_[0]))
    .catch(console.warn)
```

    [
      BinaryRow {
        id: 1,
        title: '[BOOK] ORM for Nodejs',
        price: 499.99,
        description: 'A book on introduction on ORM in nodejs'
      }
    ]


### Delete


```javascript
connection.execute(`DELETE FROM products WHERE id=1;`)
    .then(_ => console.log(_[0]))
    .catch(console.warn)
```

    ResultSetHeader {
      fieldCount: 0,
      affectedRows: 1,
      insertId: 0,
      info: '',
      serverStatus: 2,
      warningStatus: 0
    }



```javascript
// reading a specific record
connection.execute(`SELECT * FROM products WHERE id=1;`)
    .then(_ => console.log(_[0]))
    .catch(console.warn)
```

    []


# Introduction ORM

ORM stands for **O**bject-**R**elational **M**apping (ORM) is a programming technique for converting data between relational databases and object oriented programming languages such as Java, C#, etc.

**What does an ORM consists of**
1. An API to perform basic CRUD operations on objects of persistent classes.
2. A configurable facility for specifying mapping metadata.
3. A technique to interact with transactional objects to perform 
    + dirty checking
    + lazy association fetching
    + other optimization functions
    + pre-execution validations

**Why ORM? Why not executing raw queries**
1. Focus on business code rather than dealing with database
2. Transaction management and automatic key generation.
3. Community support of database security
4. Encapsulation of SQL queries from OO logic.

The ORM for nodejs is [**Sequelize**](https://sequelize.org/)

## Installing sequelize

```bash
# using yarn
yarn add sequelize

# using npm
npm i sequelize
```

Also you would have to install the drivers
``` bash
# One of the following:
npm install --save pg pg-hstore # Postgres
npm install --save mysql2
npm install --save mariadb
npm install --save sqlite3
npm install --save tedious # Microsoft SQL Server
```

**NOTE :** We will be using mariadb

## Connecting to Database


```javascript
// importing the sequelize package
const { Sequelize, INTEGER, STRING, DOUBLE } = require("sequelize")
```


```javascript
const sequelize = new Sequelize("node_orm", "root", "test@1234", {
    dialect: "mariadb", // the database provider (here, mariadb)
    host: "localhost",
    logging: false
});
```

## Defining a Model

Models are the interface to the table in the database. It consists of the schema definition (which is often known as model definition) and then you can run variaous method on the model to deal with the corresponding database and the table


```javascript
// the first parameter is the name of the table
// the second parameter is the schema description
const Product = sequelize.define("products", {
    id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: STRING(255),
    price: {
        type: DOUBLE,
        defaultValue: 0.0
    },
    description: STRING(255)
})
```

Till now the model is in the memory. To synchronize the model with database, you should use `.sync()` method


```javascript
sequelize.sync({force: true})
    .then(()=> console.log("Table Created"))
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    warning: please use IANA standard timezone format ('Etc/GMT0')
    warning: please use IANA standard timezone format ('Etc/GMT0')
    Table Created


The table will look like the following

```
+-------------+--------------+------+-----+---------+----------------+
| Field       | Type         | Null | Key | Default | Extra          |
+-------------+--------------+------+-----+---------+----------------+
| id          | int(11)      | NO   | PRI | NULL    | auto_increment |
| title       | varchar(255) | YES  |     | NULL    |                |
| price       | double       | YES  |     | 0       |                |
| description | varchar(255) | YES  |     | NULL    |                |
| createdAt   | datetime     | NO   |     | NULL    |                |
| updatedAt   | datetime     | NO   |     | NULL    |                |
+-------------+--------------+------+-----+---------+----------------+
```

See how it created two more columns to maintain the track record of creation and updation. However, you can forbid sequelize to do so by using `timestamps: false` while defining the model

The SQL query that sequelize actually ran in the background is
```sql
 CREATE TABLE IF NOT EXISTS `products`
             (
                          `id`          INTEGER auto_increment ,
                          `title`       VARCHAR(255),
                          `price`       DOUBLE PRECISION DEFAULT 0,
                          `description` VARCHAR(255),
                          `createdat`   datetime NOT NULL,
                          `updatedat`   datetime NOT NULL,
                          PRIMARY KEY (`id`)
             )
             engine=innodb; 
```

## Creating a Record


```javascript
Product.create({
    title: "ORM book for nodejs developer",
    description: "An all in one resource on data driven application development using sql and orm in nodejs",
    price: 100.99
})
    .then(() => console.log("Record created")).catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    warning: please use IANA standard timezone format ('Etc/GMT0')
    Record created


## Fetching all the Records


```javascript
Product.findAll()
    .then(v => {
        v.forEach(_ => console.log(_.dataValues))
    })
    .catch(console.warn)
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    {
      id: 1,
      title: 'ORM book for nodejs developer',
      price: 100.99,
      description: 'An all in one resource on data driven application development using sql and orm in nodejs',
      createdAt: 2020-03-31T07:36:16.000Z,
      updatedAt: 2020-03-31T07:36:16.000Z
    }


**Getting records based on conditions**


```javascript
__ = Product.findAll({ where: { id: 1 }})
    .then(v => {
        console.log(v[0].dataValues)
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    {
      id: 1,
      title: 'ORM book for nodejs developer',
      price: 100.99,
      description: 'An all in one resource on data driven application development using sql and orm in nodejs',
      createdAt: 2020-03-31T07:36:16.000Z,
      updatedAt: 2020-03-31T07:36:16.000Z
    }


**Getting specific columns only**


```javascript
__ = Product.findAll({ attributes: ["title"] })
    .then(v=>{
        console.log(v[0].dataValues)
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    { title: 'ORM book for nodejs developer' }


**Finding by Primary Key and Getting Particular Column**


```javascript
Product.findByPk(1, { attributes:["title", "price"] })
    .then(v => {
        console.log(v.dataValues)
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    { title: 'ORM book for nodejs developer', price: 100.99 }


## Updating the Records


```javascript
Product.update({ title: "Book on NodeJS ORM" }, { where: { id: 1 } })
    .then(console.log)
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    [ 1 ]



```javascript
Product.findByPk(1, { attributes:["title", "price"] })
    .then(v => {
        console.log(v.dataValues)
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    { title: 'Book on NodeJS ORM', price: 100.99 }


## Deleting the Records


```javascript
Product.destroy({
    where: {
        id: 1
    }
})
    .then(console.log)
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    1



```javascript
Product.findByPk(1, { attributes:["title", "price"] })
    .then(v => {
        console.log(v)
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    null


The `null` means record doesn't found

## Relationships with Sequelize

Before heading forward, create a user model


```javascript
const User = sequelize.define("users", {
    id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: STRING,
    email: STRING
})
```


```javascript
sequelize.sync()
    .then(() => {
        console.log("Created new table")
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    Created new table


### One-to-Many


```javascript
Product.belongsTo(User, {
    contraints: true, // adding relation contraints
    onDelete: "CASCADE" // delete products when user is deleted
})
User.hasMany(Product)
```




    products



**NOTE :** About belongsTo and hasMany has been answered here &rarr; https://softwareengineering.stackexchange.com/a/152774

Reflecting changes in DB


```javascript
sequelize.sync({ force: true })
    .then(() => {
        console.log("Created tables with relations")
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    Created tables with relations


**Creating a dummy user**


```javascript
User.findByPk(1)
    .then(v => {
        if (v == null)
        {
            console.log("User not found. Creating it")
            User.create({
                name: "Dummy User",
                email: "dummy@user.com"
                })
                .then(() => {
                    console.log("User Created")
                })
                .catch(console.warn)
        }
        else
        {
            console.log("User found. Not creating a new one")
        }
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    User not found. Creating it
    User Created


**Finding User &rarr; Creating Product &rarr; Linking user with Product**


```javascript
User.findByPk(1)
    .then(v => {
        Product.create({
            title: "Product #1",
            description: "Sample description for Product #1",
            price: 10.99,
            userId: v.dataValues.id
        })
            .then(v => {
                console.log("New product created")
            })
            .catch(console.warn)
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    New product created


**NOTE :** fter fetching the user, you can use `createProduct()` for the particular user.


```javascript
User.findByPk(1)
    .then(v => {
        v.createProduct({
            title: "Product #2",
            description: "Sample description for Product #2",
            price: 12.88,
        })
            .then(() => {
                console.log("Created product");
            })
            .catch(console.warn)
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    Created product


**Getting products with user details**


```javascript
Product.findAll({ 
    include: [{
        model: User
    }]
})
    .then(v => {
        v.forEach(_ => {
            console.log(`Product ID: ${_.dataValues.id}`);
            console.log(`Product Title: ${_.dataValues.title}`);
            console.log(`Product Price: ${_.dataValues.price}`);
            console.log(`Added By: ${_.dataValues.user.name} (${_.dataValues.user.email})`);
            console.log("-------------------");
        })
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    Product ID: 1
    Product Title: Product #1
    Product Price: 10.99
    Added By: Dummy User (dummy@user.com)
    -------------------
    Product ID: 2
    Product Title: Product #2
    Product Price: 12.88
    Added By: Dummy User (dummy@user.com)
    -------------------


**NOTE :** To get products of particular user, use `getProducts()` method on that user object

## Many-to-Many relationships

Create a new table, named `cart`


```javascript
const Cart = sequelize.define("carts", {
    id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
});
```


```javascript
const CartItem = sequelize.define("cart_items", {
    id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: INTEGER
})
```


```javascript
Cart.belongsTo(User)
User.hasOne(Cart)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })
```




    carts




```javascript
sequelize.sync({ force: true })
    .then(() => {
        console.log("Created new table and added relations to it")
    })
    .catch(console.warn)
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    warning: please use IANA standard timezone format ('Etc/GMT0')
    Created new table and added relations to it



```javascript
User.findByPk(1)
    .then(v => {
        if (v == null)
        {
            console.log("User not found. Creating it")
            User.create({
                name: "Dummy User",
                email: "dummy@user.com"
                })
                .then(() => {
                    console.log("User Created")
                })
                .catch(console.warn)
        }
        else
        {
            console.log("User found. Not creating a new one")
        }
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    User not found. Creating it
    User Created



```javascript
User.findByPk(1)
    .then(v => {
        v.createProduct({
            title: "Product #1",
            description: "Sample description for Product #1",
            price: 12.88,
        })
            .then(() => {
                console.log("Created product");
            })
            .catch(console.warn)
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    Created product



```javascript
User.findByPk(1)
    .then(v => {
        v.createProduct({
            title: "Product #2",
            description: "Sample description for Product #2",
            price: 12.88,
        })
            .then(() => {
                console.log("Created product");
            })
            .catch(console.warn)
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    Created product



```javascript
User.findByPk(1)
    .then(v => {
        v.createProduct({
            title: "Product #3",
            description: "Sample description for Product #3",
            price: 12.88,
        })
            .then(() => {
                console.log("Created product");
            })
            .catch(console.warn)
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    Created product


**Getting the Cart**


```javascript
User.findByPk(1)
    .then(v => {
        v.getCart()
            .then(v => {
                console.log(v)
            })
            .catch(console.warn)
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    warning: please use IANA standard timezone format ('Etc/GMT0')
    null


Since there is no cart, therefore it's `null`

**Creating a cart for the user, if it's not created**


```javascript
User.findByPk(1)
    .then(v => {
        v.getCart()
            .then(c => {
                if (c == null) {
                    console.log("No cart found. Creating one")
                    v.createCart()
                        .then(() => {
                            console.log("Cart created")
                        })
                        .catch(console.warn)
                } else {
                    console.log("Cart exists")
                }
            })
            .catch(console.warn)
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    warning: please use IANA standard timezone format ('Etc/GMT0')
    No cart found. Creating one
    Cart created



```javascript
User.findByPk(1)
    .then(v => {
        v.getCart()
            .then(v => {
                console.log(v.dataValues)
            })
            .catch(console.warn)
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    warning: please use IANA standard timezone format ('Etc/GMT0')
    {
      id: 1,
      createdAt: 2020-03-31T07:58:41.000Z,
      updatedAt: 2020-03-31T07:58:41.000Z,
      userId: 1
    }


**Getting products from cart**


```javascript
User.findByPk(1)
    .then(v => {
        v.getCart()
            .then(c => {
                c.getProducts()
                    .then(p => {
                        console.log(p)
                    })
                    .catch(console.warn)
            })
            .catch(console.warn)
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    warning: please use IANA standard timezone format ('Etc/GMT0')
    []


Since no product has been added to the cart, the list is empty

**Adding products to the cart**


```javascript
let product_id = null
```


```javascript
Product.findOne({ where: { title: "Product #2" }})
    .then(product => {
        product_id = product.id
    })
    .catch(console.warn)
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    warning: please use IANA standard timezone format ('Etc/GMT0')



```javascript
product_id
```




    2




```javascript
User.findByPk(1)
    .then(v => {
        let cart;
        v.getCart() // getting the cart
            .then(c => {
                cart = c; // assigning for later use
                return c.getProducts({ where: { id: product_id } }) // returning all the products in the cart
            })
            .then(products => {
                let product = null;
                if (products.length > 0) { // select one product
                    product = products[0]
                }
                
                let quantity = 1 // the quantity set to one
                if (product) { // if product exits
                    // get the current quantity
                    // add one to it
                    // add the same object of product model to the cart
                    CartItem
                        .findOne({ productId: product.id, cartId: cart.id })
                        .then(item => {
                            let oldQuantity = item.quantity; 
                            quantity = oldQuantity + 1;
                            cart
                                .addProduct(product, { through: { quantity } })
                                .then(() => console.log("Updated the quantity"))
                                .catch(console.warn)
                        })
                         .catch(console.warn)
                    
                } else {
                    // find the product by id
                    // add it to the cart through cart item model, setting the quantity
                    Product
                        .findByPk(product_id)
                        .then(product => {
                            cart.addProduct(product, { through: { quantity } })
                            console.log("Added new product");
                        })
                        .catch(console.warn)
                }
            })
            .catch(console.warn)
    })
    .catch()
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    warning: please use IANA standard timezone format ('Etc/GMT0')


    (sequelize) Warning: Model attributes (productId, cartId) passed into finder method options of model cart_items, but the options.where object is empty. Did you forget to use options.where?


    Updated the quantity


**Deleting the item in the cart**


```javascript
User.findByPk(1)
    .then(u => {
        let cart = null;
        u
            .getCart()
            .then(c => {
                cart = c;
                return c.getProducts({ where: { id: product_id } })
            })
            .then(products => {
                const product = products[0];
                CartItem
                    .findOne({ productId: product_id,  cartId: cart.id })
                    .then(item => {
                        item
                            .destroy()
                            .then(() => console.log("Deleted the product from cart"))
                            .catch(console.warn)
                    })
                    .catch(console.warn);
            })
            .catch(console.warn)
    })
    .catch(console.warn)
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    warning: please use IANA standard timezone format ('Etc/GMT0')


    (sequelize) Warning: Model attributes (productId, cartId) passed into finder method options of model cart_items, but the options.where object is empty. Did you forget to use options.where?


    Deleted the product from cart



```javascript
CartItem
    .findAll()
    .then(v => console.log(v.length))
    .catch(console.warn)
```




    Promise [Object] {
      _bitField: 0,
      _fulfillmentHandler0: undefined,
      _rejectionHandler0: undefined,
      _promise0: undefined,
      _receiver0: undefined
    }



    warning: please use IANA standard timezone format ('Etc/GMT0')
    0


# Misc

_This section will updated soon_

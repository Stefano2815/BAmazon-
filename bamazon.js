var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password1",
  database: "bamazon"
})

function start(){
  inquirer.prompt([{
    type: "list",
    name: "doThing",
    message: "Welcome To BAmazon: What Are You Interested In?",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product","End Session"]
  }]).then(function(ans){
     switch(ans.doThing){
      case "View Products for Sale": viewProducts();
      break;
      case "View Low Inventory": viewLowInventory();
      break;
      case "Add to Inventory": addToInventory();
      break;
      case "Add New Product": addNewProduct();
      break;
      case "End Session": console.log('F**k You Then!');
    }
  });
}

function viewProducts(){




  console.log('Search Amazon');

  connection.query('SELECT * FROM Products', function(err, res){
  if(err) throw err;
  console.log('----------------------------------------------------------------------------------------------------')

//console.log(res);
for (item in res){
  var current = res[item];

  console.log(`${current.id} ${current.stockQuantity} ${current.departmentName} ${current.productName} ${current.price}`);

}

  });
}

function viewLowInventory(){
  console.log('Viewing Low Inventory');

  connection.query('SELECT * FROM Products', function(err, res){
  if(err) throw err;
  console.log('----------------------------------------------------------------------------------------------------')

  for(var i = 0; i<res.length;i++){
    if(res[i].StockQuantity <= 5){
    console.log("ID: " + res[i].ItemID + " | " + "Product: " + res[i].ProductName + " | " + "Department: " + res[i].DepartmentName + " | " + "Price: " + res[i].Price + " | " + "QTY: " + res[i].StockQuantity);
    console.log('--------------------------------------------------------------------------------------------------');
    }
  }

  start();
  });
}

function addToInventory(){
  console.log('Adding to Inventory');

  connection.query('SELECT * FROM Products', function(err, res){
  if(err) throw err;
  var itemArray = [];

for(var i=0; i<res.length; i++){
    itemArray.push(res[i].productName);
  }
console.log(itemArray)
inquirer.prompt([{
    type: "list",
    name: "product",
    choices: itemArray,
    message: "Search for Item"
  }, {
    type: "input",
    name: "PS4",
    message: "How Many?",
    validate: function(input){
      return typeof eval(input) === "number";
    }
    }]).then(function(ans){
      console.log(ans)
      var currentQty;
      for(var i=0; i<res.length; i++){
        if(res[i].ProductName === ans.product){
          currentQty = res[i].StockQuantity;
        }
      }
      connection.query('UPDATE Products SET ? WHERE ?', [
        {StockQuantity: parseInt(ans.PS4)},
        {ProductName: ans.product}
        ], function(err, res){
          if(err) throw err;
          console.log('The quantity was updated.');
          start();
        });
      })
  });
}

function addNewProduct(){
  console.log('Adding New Product');
  var deptNames = [];

  connection.query('SELECT * FROM products', function(err, res){
    if(err) throw err;
    for(var i = 0; i<res.length; i++){
      deptNames.push(res[i].productName);
    }


  inquirer.prompt([{
    type: "input",
    name: "product",
    message: "Product: ",
    validate: function(value){
      if(value){return true;}
      else{return false;}
    }
  }, {
    type: "list",
    name: "department",
    message: "Department: ",
    choices: deptNames
  }, {
    type: "input",
    name: "price",
    message: "Price: ",
    validate: function(value){
      if(isNaN(value) === false){return true;}
      else{return false;}
    }
  }, {
    type: "input",
    name: "quantity",
    message: "Quantity: ",
    validate: function(value){
      if(isNaN(value) == false){return true;}
      else{return false;}
    }
  }]).then(function(ans){
    connection.query('INSERT INTO Products SET ?',{
      ProductName: ans.product,
      DepartmentName: ans.department,
      Price: ans.price,
      StockQuantity: ans.quantity
    }, function(err, res){
      if(err) throw err;
      console.log('Another item was added to the store.');
    })
    start();
  });
});
}

start();

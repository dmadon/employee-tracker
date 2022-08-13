const express = require('express');
const app = express();
const PORT = process.env.PORT||3001;
const db = require('./db/connection');
const cTable = require('console.table');


// function getEmployees(){
// const sql = `SELECT * FROM employees`
// db.query(sql,(err,rows) => {
//     if(err){
//         console.log(err);
//         return;
//     }
//     console.table(rows);
// });
// }

// getEmployees();







// app.listen(PORT,() => {
//     console.log(`Server running on port ${PORT}`);
// });
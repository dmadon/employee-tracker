
const db = require('./db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');
const {getEmployees, addEmployee} = require ('./utils/employeeInfo');



const addRole = () => {

    return new Promise((resolve,reject) => {

        db.query("SELECT * FROM departments", (err,results) => {

            if(err){
                reject(err);
                return;
            };

            return inquirer
                .prompt([
                { 
                    type: 'list',
                    name: 'chooseDepartment',
                    message: "Choose an department",
                    choices: function(){
                        let choiceArr = [];
                        for(i=0; i<results.length;i++){
                            choiceArr.push(results[i].dept_name);
                        }
                        return choiceArr;
                    }
                },            
                ])// end of .prompt
                .then((answer) => {
                    resolve(
                    console.log('Role added!')
                    )
                })// end of .then
        });// end of db.query
    });// end of new Promise
};// end of addRole function


addRole()

.then(() => {
    console.log('did it work?')
})




// const testPromise = () => {
//     return new Promise((resolve,reject) => {
//         const sql = 
//         `SELECT 
//         E.emp_id AS 'ID',
//         E.emp_last_name AS 'Last Name',
//         E.emp_first_name AS 'First Name',   
//         roles.role_title AS 'Title',
//         departments.dept_name AS 'Department',
//         roles.role_salary AS 'Salary',
//         CONCAT(M.emp_first_name," ",M.emp_last_name) AS Manager
    
//         FROM employees E
        
//         JOIN roles
//         ON roles.role_id = E.emp_role_id
        
//         JOIN departments
//         ON departments.dept_id = roles.role_dept_id
    
//         LEFT JOIN employees M
//         ON M.emp_id = E.emp_manager_id
    
//         ORDER BY E.emp_last_name ASC
        
//         `;
        
    
//         db.query(sql,(err,rows) => {
//             if(err){
//                 reject(err);
//                 return;
//             }
//             resolve(
//                 console.table(rows)
//             );
//         });

//     })
    
// }


// testPromise()




const PORT = process.env.PORT||3001;
const db = require('./db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');
const {getEmployees, addEmployee} = require ('./utils/employeeInfo');

const start = () => {

    const sql = 
    `SELECT 
    E.emp_id AS 'ID',
    E.emp_last_name AS 'Last Name',
    E.emp_first_name AS 'First Name',   
    roles.role_title AS 'Title',
    departments.dept_name AS 'Department',
    roles.role_salary AS 'Salary',
    CONCAT(M.emp_first_name," ",M.emp_last_name) AS Manager

    FROM employees E
    
    JOIN roles
    ON roles.role_id = E.emp_role_id
    
    JOIN departments
    ON departments.dept_id = roles.role_dept_id

    LEFT JOIN employees M
    ON M.emp_id = E.emp_manager_id

    ORDER BY E.emp_last_name ASC
    
    `;
    

    db.query(sql,(err,rows) => {
        if(err){
            console.log(err);
            return;
        }
        console.table(rows);
    });
  
    }

    

start();

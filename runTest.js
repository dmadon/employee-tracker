const PORT = process.env.PORT||3001;
const db = require('./db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');
const {getEmployees, addEmployee} = require ('./utils/employeeInfo');

const start = () => {

    const sql = `
    SELECT
    CONCAT(e.emp_first_name," ",e.emp_last_name) AS Employee,
    CONCAT(m.emp_first_name," ",m.emp_last_name) AS Manager
    FROM
    employees e
    LEFT JOIN
    employees m ON m.emp_id = e.emp_manager_id
    
    `;



    
    // const sql = 
    // `SELECT 
    // employees.emp_id AS 'ID',
    // employees.emp_last_name AS 'Last Name',
    // employees.emp_first_name AS 'First Name',    
    // roles.role_title AS 'Title',
    // departments.dept_name AS 'Department',
    // roles.role_salary AS 'Salary',
    // employees.emp_manager_id AS 'Manager'
    // FROM employees
    // JOIN roles
    // ON roles.role_id = employees.emp_role_id
    // JOIN departments
    // ON departments.dept_id = roles.role_dept_id
    // ORDER BY employees.emp_last_name ASC
    
    // `;
    

    db.query(sql,(err,rows) => {
        if(err){
            console.log(err);
            return;
        }
        console.table(rows);
    });
  
    }

    

start();

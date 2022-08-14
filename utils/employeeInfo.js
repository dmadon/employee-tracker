const db = require('../db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');


const getEmployees = () => {

    return new Promise((resolve,reject) => {

    console.table(`
-----------------------------------------------------------------------------------------
                                       ALL EMPLOYEES
-----------------------------------------------------------------------------------------`);
    const sql = `SELECT 
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

    ORDER BY E.emp_last_name ASC`;

    db.query(sql,(err,rows) => {
        if(err){
            reject(err);
            return;
        }
        resolve(
            console.table(rows)
        );
    });

})
  
}


const addEmployee = () => {
    return inquirer
        .prompt([
           { 
            type: 'input',
            name: 'firstName',
            message: "What is your employee's first name?",
            validate: firstNameInput => {
                if(firstNameInput){
                    return true;
                }
                else{
                    console.log('First name is required.');
                    return false;
                }
            }
           },
           {
            type: 'input',
            name: 'lastName',
            message: "What is your employee's last name?",
            validate: lastNameInput => {
                if(lastNameInput){
                    return true;
                }
                else{
                    console.log('Last name is required.');
                    return false;
                }
            }
           },
           {
            // THIS WILL EVENTUALLY NEED TO BE POPULATED FROM POSSIBLE VALUES IN THE DATABASE
            type: 'input',
            name: 'empRoleId',
            message: "What is your employee's role id?",
            validate: empRoleIDInput => {
                if(empRoleIDInput){
                    return true;
                }
                else{
                    console.log('Role ID is required.');
                    return false;
                }
            }
           },
           {
            // EVENTUALLY, THIS WILL NEED TO BE POPULATED BY A LIST OF POSSIBLE CHOICES FROM THE DATABASE
            type: 'input',
            name: 'empManagerId',
            message: "What is your employee's manager's ID?"
           }   
           
        ])
        .then((answers) => {
            console.log(answers);
            db.query("INSERT INTO employees SET ?",
                {
                emp_first_name: answers.firstName,
                emp_last_name: answers.lastName,
                emp_role_id: answers.empRoleId,
                emp_manager_id: answers.empManagerId
                },  
                function(error){
                if(error) throw error;
                console.log('Employee added!');
                getEmployees(); 
                })
                
            }) 
        
};

module.exports = {getEmployees, addEmployee};
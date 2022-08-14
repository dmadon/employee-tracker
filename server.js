const express = require('express');
const app = express();
const PORT = process.env.PORT||3001;
const db = require('./db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');


const getEmployees = () => {
const sql = `SELECT * FROM employees`
db.query(sql,(err,rows) => {
    if(err){
        console.log(err);
        return;
    }
    console.table(rows);
});
}


const promptUser = () => {
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
            console.table(answers);
            db.query("INSERT INTO employees SET ?",
                {
                emp_first_name: answers.firstName,
                emp_last_name: answers.lastName,
                emp_role_id: answers.empRoleId,
                emp_manager_id: answers.emp_manager_id
                },  
                function(error){
                if(error) throw error;
                console.log('Employee added!');
                getEmployees(); 
                })
                
            }) 
        
};


promptUser();



app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
});


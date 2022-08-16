const db = require('../db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');


const getDepartments = () => {

    return new Promise((resolve,reject) => {

    console.table(`
-----------------------------------------------------------------------------------------
                                       ALL DEPARTMENTS
-----------------------------------------------------------------------------------------`);
    const sql = `SELECT departments.dept_id AS id, departments.dept_name AS name FROM departments`;

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


const addDepartment = () => {
    return inquirer
        .prompt([
           { 
            type: 'input',
            name: 'departmentName',
            message: "What is the name of the new department?",
            validate: departmentNameInput => {
                if(departmentNameInput){
                    return true;
                }
                else{
                    console.log('Department name is required.');
                    return false;
                }
            }
           }
        ])
        .then((answers) => {
            db.query("INSERT INTO departments SET ?",
                {
                    dept_name: answers.departmentName
                }) 
                
                console.log('Department added!');
                // getEmployees(); 
                
                
            }) 
        
};

module.exports = {getDepartments, addDepartment};
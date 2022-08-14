const express = require('express');
const app = express();
const PORT = process.env.PORT||3001;
const db = require('./db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');
const {getEmployees, addEmployee} = require ('./utils/employeeInfo');


const chooseEmployee = () => {

    db.query("SELECT * FROM employees ORDER BY emp_last_name ASC", (err,results) => {

        if(err)throw err;

        return inquirer
            .prompt([
            { 
                type: 'rawlist',
                name: 'chooseEmployee',
                message: "Choose an employee",
                choices: function(){
                    let choiceArr = [];
                    for(i=0; i<results.length;i++){
                        choiceArr.push(results[i].emp_last_name+", "+results[i].emp_first_name);
                    }
                    return choiceArr;
                }
            },
            
            ])
            .then((answers) => {
                console.log('You chose '+answers.chooseEmployee+'!');
            })
    });
}


chooseEmployee();






app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
});
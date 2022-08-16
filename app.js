const PORT = process.env.PORT||3001;
const db = require('./db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');
const {getEmployees, addEmployee} = require ('./utils/employeeInfo');
const {getDepartments,addDepartment} = require('./utils/departmentInfo');
const {getRoles,addRole} = require('./utils/roleInfo');


const start = () => {
    console.log(`
    ---------------------------------
             EMPLOYEE TRACKER
    ---------------------------------`);

    return inquirer.prompt([
        {
            type: 'list',
            name: 'selectOption',
            message: 'Please select an option from the list',
            choices: ['View All Departments','View All Roles','View All Employees','Add a Department','Add a Role','Add an Employee','Update an Employee Role'],
        }    
    ])
    .then((answer) => {
        switch(answer.selectOption){
            case 'View All Departments':
                getDepartments()
                .then(() => {start()});
                break;
            case 'View All Roles':
                getRoles()
                .then(() => {start()});
                break;
            case 'View All Employees':
                getEmployees()
                .then(() => {start()});
                break;
            case 'Add a Department':
                addDepartment()
                .then(() => {start()})
                break;
            case 'Add a Role':
                addRole()
                .then(() => {start()})
                break;
            case 'Add an Employee':
                addEmployee()
                .then(() => {start()}) 
                    
                break;
            case 'Update an Employee Role':
                // INSERT FUNCTION TO UPDATE employees TABLE WITH A NEW ROLE VALUE;
        }

    })
}

start();










// const chooseEmployee = () => {

//     db.query("SELECT * FROM employees ORDER BY emp_last_name ASC", (err,results) => {

//         if(err)throw err;

//         return inquirer
//             .prompt([
//             { 
//                 type: 'rawlist',
//                 name: 'chooseEmployee',
//                 message: "Choose an employee",
//                 choices: function(){
//                     let choiceArr = [];
//                     for(i=0; i<results.length;i++){
//                         choiceArr.push(results[i].emp_id+" "+results[i].emp_last_name+", "+results[i].emp_first_name);
//                     }
//                     return choiceArr;
//                 }
//             },
            
//             ])
//             .then((answers) => {
//                 console.table(answers);
//             })
//     });
// }


// chooseEmployee();






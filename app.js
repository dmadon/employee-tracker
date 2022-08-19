const PORT = process.env.PORT||3001;
const db = require('./db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');
const {getEmployees, addEmployee, updateRole, updateManager, getEmployeesByManager, getEmployeesByDepartment, deleteEmployee} = require ('./utils/employeeInfo');
const {getDepartments,addDepartment, deleteDepartment, viewDepartmentBudget} = require('./utils/departmentInfo');
const {getRoles,addRole, deleteRole} = require('./utils/roleInfo');


const start = () => {
    console.log(`
-----------------------------------------------------------------------------------------
                              WELCOME TO EMPLOYEE TRACKER
-----------------------------------------------------------------------------------------`);

    return inquirer.prompt([
        {
            type: 'list',
            name: 'selectOption',
            message: 'Please select an option from the list',
            choices: ['View All Departments','View All Roles','View All Employees','View Employees by Manager','View Employees by Department',
            'Add an Employee','Delete an Employee','View Department Salary Budgets','Add a Department','Delete a Department','Add a Role','Delete a Role',
            'Update an Employee Role','Update an Employee Manager'],
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
            case 'View Employees by Manager':
                getEmployeesByManager()
                .then(() => {start()});
                break;
            case 'View Employees by Department':
                getEmployeesByDepartment()
                .then(() => {start()});
                break;
            case 'Add an Employee':
                addEmployee()
                .then(() => {start()}) 
                break;
            case 'Delete an Employee':
                deleteEmployee()
                .then(() => {start()});
                break;
            case 'View Department Salary Budgets':
                viewDepartmentBudget()
                .then(() => {start()});
                break;
            case 'Add a Department':
                addDepartment()
                .then(() => {start()})
                break;
            case 'Delete a Department':
                deleteDepartment()
                .then(() => {start()})
                break;
            case 'Add a Role':
                addRole()
                .then(() => {start()})
                break;
            case 'Delete a Role':
                deleteRole()
                .then(() => {start()})
                break;
            case 'Update an Employee Role':
                updateRole()
                .then(() => {start()}) 
                break;
            case 'Update an Employee Manager':
                updateManager()
                .then(() => {start()}) 
                break;
        }// end of switch case
    })// end of .then statement
}// end of start function

start();
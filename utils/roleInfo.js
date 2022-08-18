const db = require('../db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');


const getRoles = () => {

    return new Promise((resolve,reject) => {

    console.table(`
-----------------------------------------------------------------------------------------
                                       ALL ROLES
-----------------------------------------------------------------------------------------`);
    const sql = `SELECT 
    roles.role_id AS id, 
    roles.role_title AS title, 
    departments.dept_name AS department, 
    roles.role_salary AS salary 
    FROM roles
    JOIN departments ON departments.dept_id = roles.role_dept_id`;

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


const addRole = () => {

    return new Promise((resolve,reject) => {

        db.query("SELECT * FROM departments", (err,rows) => {

            if(err){
                reject(err);
                return;
            };

            return inquirer
                .prompt([
                {
                    type: 'input',
                    name: 'roleTitle',
                    message: 'What is the role title?',
                    validate: roleTitleInput => {
                        if(roleTitleInput){
                            return true;
                        }
                        else{
                            console.log('Role title is required.');
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'roleSalary',
                    message: 'What is the salary for this role?',
                    validate(value) {
                        const valid = !isNaN(parseFloat(value));
                        if(valid){
                            return true;
                        }
                        else{                            
                            console.log('Salary must be a number.');
                            return false;
                        }
                    }
                },
                { 
                    type: 'list',
                    name: 'chooseDepartment',
                    message: 'To which department does this role belong?',
                    choices: function(){
                        let choiceArr = [];
                        for(i=0; i<rows.length;i++){
                            choiceArr.push(rows[i].dept_name);
                        }
                        return choiceArr;
                    }
                },            
                ])// end of .prompt
                .then((answer) => {
                    db.query("SELECT departments.dept_id FROM departments WHERE departments.dept_name = ?",
                        answer.chooseDepartment,
                        (err,response) => {
                            if(err){
                                console.log(err);
                                return;
                            }
                            answer.roleDeptId =  response[0].dept_id;
                            db.query("INSERT INTO roles SET ?",
                            {
                                role_title: answer.roleTitle,
                                role_salary: answer.roleSalary,
                                role_dept_id: answer.roleDeptId
                            })

                            resolve(console.log('Role added!'));
                        });                   
                })// end of then statement   
        })// end of promise query
    })// end of new Promise    
};// end of addRole function




const updateRole = () => {

    return new Promise((resolve,reject) => {

        let employeeArr = [];
        let roleArr = [];

        db.query("SELECT employees.emp_id, CONCAT(employees.emp_last_name,', ',employees.emp_first_name) AS Employee, employees.emp_role_id FROM employees",
        (err,rows) => {
            if(err){
                reject(err);
                return;
            }
            for(i=0;i<rows.length;i++){
                employeeArr.push(rows[i].Employee);
            };
        });

        db.query("SELECT roles.role_title FROM roles",
        (err,rows) => {
            if(err){
                reject(err);
                return;
            }
            for(i=0;i<rows.length;i++){
                roleArr.push(rows[i].role_title)
            }
            
        return inquirer
            .prompt([
                {
                type: 'list',
                name: 'empName',
                message: 'Select an employee to change role.',
                choices: employeeArr
                },
                {
                type: 'list',
                name: 'newRole',
                message: 'Select a new role for the employee',
                choices: roleArr
                }           
            ])       
            .then((answer) => {
                
                db.query("SELECT employees.emp_id FROM employees WHERE CONCAT(employees.emp_last_name,', ',employees.emp_first_name) = ?",
                    answer.empName,
                    (err,response) => {
                        if(err){
                            console.log(err);
                            return;
                        }
                        answer.empId = response[0].emp_id;
                        
                    })

                db.query("SELECT roles.role_id FROM roles WHERE roles.role_title = ?",
                    answer.newRole,
                    (err,response) => {
                        if(err){
                            console.log(err);
                            return;
                        }
                        answer.newRoleId = response[0].role_id;
                        

                        db.query(`UPDATE employees SET employees.emp_role_id = ${answer.newRoleId} WHERE employees.emp_id = ${answer.empId}`),
                        (err,response) => {
                            if(err){
                                console.log(err);
                                return;
                            }
                            
                        }
                        resolve(console.log('Role updated!'));
                })   
            })// end of then statement
    })// end of new Promise    
})
};// end of addRole function


module.exports = {getRoles, addRole, updateRole};
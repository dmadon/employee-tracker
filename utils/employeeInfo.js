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

    return new Promise((resolve,reject) => {

        let roleChoices = [];
        let managerChoices = ['none'];

        db.query("SELECT * FROM roles", (err,rows) => {
            if(err){
                reject(err);
                return;
            }
            for(i=0;i<rows.length;i++){
                roleChoices.push(rows[i].role_title)
            }
        })
        db.query("SELECT CONCAT(emp_last_name,', ',emp_first_name) AS managers FROM employees ORDER BY emp_last_name ASC", (err,rows) => {
            if(err){
                reject(err);
                return;
            }
            for(i=0;i<rows.length;i++){
                managerChoices.push(rows[i].managers)
            }
            
        })

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
                type: 'list',
                name: 'empRole',
                message: "What is your employee's role?",
                choices: roleChoices
                },
                {
                type: 'list',
                name: 'empManager',
                message: "Who is this employee's manager?",
                choices: managerChoices
                }   
            
            ])
            .then((answer) => {

                db.query("SELECT roles.role_id FROM roles WHERE roles.role_title = ?",
                answer.empRole,
                (err,response) => {
                    if(err){
                        console.log(err);
                        return;
                }
                answer.empRoleId = response[0].role_id;
                })
                

                db.query("SELECT employees.emp_id FROM employees WHERE CONCAT(employees.emp_last_name,', ',employees.emp_first_name)=?",
                answer.empManager,
                (err,response) => {
                    if(err){
                    console.log(err);
                    return;
                }
                if(answer.empManager == "none"){
                    answer.empManagerId = null;
                }
                else{
                    answer.empManagerId = response[0].emp_id;
                }
                    console.table(answer);
                    db.query("INSERT INTO employees SET ?", 
                        {
                        emp_first_name: answer.firstName,
                        emp_last_name: answer.lastName,
                        emp_role_id: answer.empRoleId,
                        emp_manager_id: answer.empManagerId
                        },
                        (err,response) => {
                            if(err){
                                console.log('UNABLE TO ADD EMPLOYEE.')
                                return;
                            }
                            resolve(console.log('Employee added!'));
                        }
                        )
                        
                }) 
            }) // end of then statement
    })// end of new Promise     
};

module.exports = {getEmployees, addEmployee};
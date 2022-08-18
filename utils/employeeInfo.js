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

        db.query("SELECT * FROM roles ORDER BY roles.role_title ASC",
        (err,rows) => {
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
                    else if(answer.empManager == "none"){
                        answer.empManagerId = null;
                    }
                    else{
                        answer.empManagerId = response[0].emp_id;
                    }

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
};// end of updateRole function

const updateManager = () => {

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
                message: 'Select an employee to change manager.',
                choices: employeeArr
                },
                {
                type: 'list',
                name: 'newManager',
                message: 'Select a new manager for the employee',
                choices: employeeArr
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

                    db.query("SELECT employees.emp_id FROM employees WHERE CONCAT(employees.emp_last_name,', ',employees.emp_first_name) = ?",
                    answer.newManager,
                    (err,response) => {
                        if(err){
                            console.log(err);
                            return;
                        }
                        answer.newManagerId = response[0].emp_id;
                        

                        db.query(`UPDATE employees SET employees.emp_manager_id = ${answer.newManagerId} WHERE employees.emp_id = ${answer.empId}`),
                        (err,response) => {
                            if(err){
                                console.log(err);
                                return;
                            }
                            
                        }
                        resolve(console.log('Manager updated!'));
                })   
            })// end of then statement
    })// end of new Promise    
})
};// end of updateManager function

const getEmployeesByManager = () => {

    return new Promise((resolve,reject) => {

        db.query("SELECT CONCAT(employees.emp_last_name,', ',employees.emp_first_name) AS Employees FROM employees",
            (err,rows) => {
                if(err){
                    reject(err);
                    return;
                };

                return inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Select a manager to view employees.',
                        choices: function(){
                            let choiceArr = [];
                            for (i=1; i<rows.length;i++){
                                choiceArr.push(rows[i].Employees);
                            }
                            return choiceArr;
                        }
                    }
                ])
                .then((answer) => {
                    db.query("SELECT employees.emp_id FROM employees WHERE CONCAT(employees.emp_last_name,', ',employees.emp_first_name) = ?",
                    answer.manager,
                        (err, response) => {
                            if(err){
                                reject(err);
                                return;
                            }
                            answer.id = response[0].emp_id;

                            db.query(`SELECT 
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

                            WHERE E.emp_manager_id = ${answer.id}
                        
                            ORDER BY E.emp_last_name ASC`,

                                (err,res) => {
                                    if(err){
                                        reject(err);
                                        return;
                                    }
                                    resolve(
                                    console.table(`
-----------------------------------------------------------------------------------------
                    EMPLOYEES FOR MANAGER: ${answer.manager}
-----------------------------------------------------------------------------------------`),
                                    console.table(res))
                                })
                        })
                    })
            }
        )
    })
  
}



const getEmployeesByDepartment = () => {

    return new Promise((resolve,reject) => {

        db.query("SELECT departments.dept_name FROM departments",
            (err,rows) => {
                if(err){
                    reject(err);
                    return;
                };

                return inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Select a department to view employees.',
                        choices: function(){
                            let choiceArr = [];
                            for (i=1; i<rows.length;i++){
                                choiceArr.push(rows[i].dept_name);
                            }
                            return choiceArr;
                        }
                    }
                ])
                .then((answer) => {
                    db.query("SELECT departments.dept_id FROM departments WHERE departments.dept_name = ?",
                    answer.department,
                        (err, response) => {
                            if(err){
                                reject(err);
                                return;
                            }
                            answer.deptId = response[0].dept_id;

                            db.query(`SELECT 
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

                            WHERE departments.dept_id = ${answer.deptId}
                        
                            ORDER BY E.emp_last_name ASC`,

                                (err,res) => {
                                    if(err){
                                        reject(err);
                                        return;
                                    }
                                    resolve(
                                    console.table(`
-----------------------------------------------------------------------------------------
                    EMPLOYEES FOR DEPARTMENT: ${answer.department}
-----------------------------------------------------------------------------------------`),
                                    console.table(res))
                                })
                        })
                    })
            }
        )
    })
  
}

const deleteEmployee = () => {

    return new Promise((resolve,reject) => {

        db.query("SELECT CONCAT(employees.emp_last_name,', ',employees.emp_first_name) AS Employees FROM employees",
            (err,rows) => {
                if(err){
                    reject(err);
                    return;
                };

                return inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Select an employee to delete.',
                        choices: function(){
                            let choiceArr = [];
                            for (i=1; i<rows.length;i++){
                                choiceArr.push(rows[i].Employees);
                            }
                            return choiceArr;
                        }
                    }
                ])
                .then((answer) => {
                    db.query("SELECT employees.emp_id FROM employees WHERE CONCAT(employees.emp_last_name,', ',employees.emp_first_name) = ?",
                    answer.employee,
                        (err, response) => {
                            if(err){
                                reject(err);
                                return;
                            }
                            answer.empId = response[0].emp_id;

                            db.query(`DELETE FROM employees WHERE employees.emp_id = ${answer.empId}`,
                                (err,res) => {
                                    if(err){
                                        reject(err);
                                        return;
                                    }
                                    resolve(
                                    console.log('Employee deleted!'))
                                })
                        })
                    })
            }
        )
    })
  
}




module.exports = {getEmployees, addEmployee, updateRole, updateManager, getEmployeesByManager, getEmployeesByDepartment, deleteEmployee};
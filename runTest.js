
const db = require('./db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');



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
updateManager()

.then(() => {
    console.log('did it work?')
})






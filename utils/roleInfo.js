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
                    db.query(`SELECT departments.dept_id FROM departments WHERE departments.dept_name = ?`,
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

module.exports = {getRoles, addRole};
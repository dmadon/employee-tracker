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
    });
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
        }) 
};

const deleteDepartment = () => {

    return new Promise((resolve,reject) => {

    db.query("SELECT departments.dept_name FROM departments",
        (err, rows)=> {

            if(err){
                reject(err);
                return;
            }
            return inquirer
            .prompt([
               { 
                type: 'list',
                name: 'departmentName',
                message: "Select a department to delete.",
                choices: function(){
                    let choiceArr = [];
                    for (i=0; i<rows.length;i++){
                        choiceArr.push(rows[i].dept_name)
                    }
                    return choiceArr;
                    }   
               }
            ])
            .then((answers) => {
                db.query("DELETE FROM departments WHERE departments.dept_name = ?",
                    answers.departmentName, (err, response) => {
                        if(err){
                            reject(err);
                            return;
                        }
                        resolve(console.log("Deparmtent deleted!"))
                    });
            }) ;
        });
    });
};

const viewDepartmentBudget = () => {

    return new Promise((resolve,reject) => {
        console.table(`
-----------------------------------------------------------------------------------------
                            TOTAL SALARY BUDGET BY DEPARTMENT
-----------------------------------------------------------------------------------------`);

        db.query(`SELECT departments.dept_name AS 'Department' , sum(roles.role_salary) AS 'Total Salaries'
                FROM departments
                JOIN roles
                WHERE roles.role_dept_id = departments.dept_id
                GROUP BY departments.dept_name
                ORDER BY departments.dept_name`,
            (err, rows)=> {
                if(err){
                    reject(err);
                    return;
                }
                resolve(console.table(rows))
        });
    });
};


module.exports = {getDepartments, addDepartment, deleteDepartment, viewDepartmentBudget};
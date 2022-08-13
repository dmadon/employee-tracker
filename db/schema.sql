DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;
USE employee_tracker;

CREATE TABLE departments(
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles(
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_title VARCHAR(30) NOT NULL,
    role_salary DECIMAL NOT NULL,
    role_dept_id INT,
    CONSTRAINT fk_dept FOREIGN KEY (role_dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL
);

CREATE TABLE employees(
    emp_id INT AUTO_INCREMENT PRIMARY KEY,
    emp_first_name VARCHAR(30) NOT NULL,
    emp_last_name VARCHAR(30) NOT NULL,
    emp_role_id INT,
    emp_manager_id INT DEFAULT NULL,
    CONSTRAINT fk_role_id FOREIGN KEY (emp_role_id) REFERENCES roles(role_id) ON DELETE SET NULL,
    CONSTRAINT fk_manager_id FOREIGN KEY (emp_manager_id) REFERENCES employees(emp_id) ON DELETE SET NULL
);

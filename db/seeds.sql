INSERT INTO departments(dept_name)
    VALUES
    ('Superintentent'),
    ('Academic Services'),
    ('Elementary Curriculum');

INSERT INTO roles(role_title,role_salary,role_dept_id)
    VALUES
    ('Manager', 120000.00, 1),
    ('Coordinator', 80000.00,1),
    ('Specialist', 65000.00,1),
    ('Support Staff', 55000.00,1),
    ('Manager', 100000.00,2),
    ('Coordinator', 70000.00,2),
    ('Specialist', 60000.00,2),
    ('Support Staff', 50000.00,2),
    ('Manager', 90000.00,3),
    ('Coordinator', 60000.00,3),
    ('Specialist', 50000.00,3),
    ('Support Staff', 40000.00,3);

INSERT INTO employees(emp_first_name,emp_last_name,emp_role_id,emp_manager_id)
    VALUES
    ('Theresa','Williams',1,NULL),
    ('Lisa','Wilson',2,1),
    ('Liz','Tycom',3,1);
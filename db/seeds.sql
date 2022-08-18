INSERT INTO departments(dept_name)
    VALUES
    ('Superintentent'),
    ('Acad Serv'),
    ('Elem Acad Serv'),
    ('Federal Programs');

INSERT INTO roles(role_title,role_salary,role_dept_id)
    VALUES
    ('Superintendent', 300000.00, 1),
    ('Deputy Superintendent', 25000.00,1),
    ('Assistant Superintendent', 220000.00,1),
    ('Chief Learning Officer', 210000.00,2),
    ('Director of Elem Acad Serv', 190000.00,3),
    ('Elem Math Coord', 120000.00,3),
    ('Elem Science Coord', 120000.00,2),
    ('Elem Literacy Coord', 12000.00,2),
    ('Elem Social Studies Coord', 120000.00,3),
    ('Elem Inst Specialist, Math', 80000.00,3),
    ('Elem Inst Specialist, Science', 80000.00,3),
    ('Elem Inst Specialist, Literacy', 80000.00,3),
    ('Director of Federal Programs', 150000.00,4),
    ('Title I Specialist', 80000,4),
    ('Federal Grants Secretary', 48000.00,4),
    ('Title I Secretary',48000.00,4),
    ('Office Manager Elem Acad Serv',50000.00,3);

INSERT INTO employees(emp_first_name,emp_last_name,emp_role_id,emp_manager_id)
    VALUES
    ('Theresa','Williams',1,NULL),
    ('Lisa','Wilson',2,1),
    ('Laurie','Taylor',4,2),
    ('Ashley','Davis',5,3),
    ('Nardeen','Boxell',13,3),
    ('Deanna','Madon',17,4),
    ('Ginger','Teaff',6,4);

-- Seed departments

INSERT INTO department (name)
VALUES ('Engineering'), ('Sales'), ('Finance');

-- Seed roles

INSERT INTO role (title,
                  salary,
                  department_id)
VALUES ('Software Engineer',
        100000,
        1), ('Sales Manager',
             75000,
             2), ('Accountant',
                  60000,
                  3);

-- Seed employees

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Alice',
        'Johnson',
        1,
        NULL), ('Bob',
                'Smith',
                2,
                NULL), ('Charlie',
                        'Brown',
                        3,
                        1);


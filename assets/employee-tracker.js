
// Import required modules
const inquirer = require('inquirer');
const { Client } = require('pg');

// Database configuration
const dbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'employee_db',
    password: '7410',
    port: 5432,
};

const client = new Client(dbConfig);

// Connect to the database
client.connect()
    .then(() => console.log('Connected to the database.'))
    .catch(err => console.error('Database connection error:', err.stack));

// Main menu options
const mainMenu = async () => {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update Employee Manager',
                'View Employees by Manager',
                'View Employees by Department',
                'Delete Department, Role, or Employee',
                'View Total Utilized Budget by Department',
                'Exit'
            ]
        }
    ]);

    switch (action) {
        case 'View all departments':
            await viewDepartments();
            break;
        case 'View all roles':
            await viewRoles();
            break;
        case 'View all employees':
            await viewEmployees();
            break;
        case 'Add a department':
            await addDepartment();
            break;
        case 'Add a role':
            await addRole();
            break;
        case 'Add an employee':
            await addEmployee();
            break;
        case 'Update an employee role':
            await updateEmployeeRole();
            break;
        case 'Update Employee Manager':
            await updateEmployeeManager();
            break;
        case 'View Employees by Manager':
            await viewEmployeesByManager();
            break;
        case 'View Employees by Department':
            await viewEmployeesByDepartment();
            break;
        case 'Delete Department, Role, or Employee':
             await deleteRecord();
            break;
        case 'View Total Utilized Budget by Department':
            await viewDepartmentBudget();
            break;
        case 'Exit':
            client.end();
            console.log('Goodbye!');
            return;
    }

    // Return to main menu
    await mainMenu();
};

// View all departments
const viewDepartments = async () => {
    const res = await client.query('SELECT * FROM department ORDER BY id');
    console.table(res.rows);
};

// View all roles
const viewRoles = async () => {
    const res = await client.query(
        `SELECT role.id, role.title, role.salary, department.name AS department 
         FROM role 
         JOIN department ON role.department_id = department.id 
         ORDER BY role.id;`
    );
    console.table(res.rows);
};

// View all employees
const viewEmployees = async () => {
    const res = await client.query(
        `SELECT 
            e.id AS employee_id, 
            e.first_name, 
            e.last_name, 
            r.title AS job_title, 
            d.name AS department, 
            r.salary, 
            CASE 
                WHEN e.manager_id IS NULL THEN 'None' 
                ELSE CONCAT(m.first_name, ' ', m.last_name) 
            END AS manager
        FROM employee e
        JOIN role r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
        ORDER BY e.id;`
    );
    console.table(res.rows);
};


// Add a department
const addDepartment = async () => {
    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:'
        }
    ]);
    await client.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Department '${name}' added successfully.`);
};

// Add a role
const addRole = async () => {
    const departments = await client.query('SELECT id, name FROM department');
    const departmentChoices = departments.rows.map(dep => ({ name: dep.name, value: dep.id }));

    const { title, salary, department_id } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter the role title:' },
        { type: 'input', name: 'salary', message: 'Enter the role salary:' },
        { type: 'list', name: 'department_id', message: 'Select the department:', choices: departmentChoices }
    ]);

    await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log(`Role '${title}' added successfully.`);
};

// Add an employee
const addEmployee = async () => {
    const roles = await client.query('SELECT id, title FROM role');
    const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));

    const employees = await client.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employee');
    const managerChoices = employees.rows.map(emp => ({ name: emp.name, value: emp.id }));
    managerChoices.unshift({ name: 'None', value: null });

    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        { type: 'input', name: 'first_name', message: 'Enter the employee first name:' },
        { type: 'input', name: 'last_name', message: 'Enter the employee last name:' },
        { type: 'list', name: 'role_id', message: 'Select the employee role:', choices: roleChoices },
        { type: 'list', name: 'manager_id', message: 'Select the employee manager:', choices: managerChoices }
    ]);

    await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
    console.log(`Employee '${first_name} ${last_name}' added successfully.`);
};

// Update employee role
const updateEmployeeRole = async () => {
    const employees = await client.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employee');
    const employeeChoices = employees.rows.map(emp => ({ name: emp.name, value: emp.id }));

    const roles = await client.query('SELECT id, title FROM role');
    const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));

    const { employee_id, role_id } = await inquirer.prompt([
        { type: 'list', name: 'employee_id', message: 'Select the employee to update:', choices: employeeChoices },
        { type: 'list', name: 'role_id', message: 'Select the new role:', choices: roleChoices }
    ]);

    await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log('Employee role updated successfully.');
};

// Update employee manager
const updateEmployeeManager = async () => {
    const employees = await client.query('SELECT id, first_name || \' \' || last_name AS name FROM employee');
    const employeeChoices = employees.rows.map(emp => ({ name: emp.name, value: emp.id }));

    const { employee_id, manager_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to update:',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select the new manager:',
            choices: [{ name: 'None', value: null }, ...employeeChoices]
        }
    ]);

    await client.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [manager_id, employee_id]);
    console.log('Employee manager updated successfully.');
};

// View employees by manager
const viewEmployeesByManager = async () => {
    const managers = await client.query('SELECT id, first_name || \' \' || last_name AS name FROM employee');
    const managerChoices = managers.rows.map(mgr => ({ name: mgr.name, value: mgr.id }));

    const { manager_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select a manager to view their employees:',
            choices: managerChoices
        }
    ]);

    const res = await client.query(
        `SELECT first_name, last_name FROM employee WHERE manager_id = $1`,
        [manager_id]
    );
    console.table(res.rows);
};

// View employees by department
const viewEmployeesByDepartment = async () => {
    const departments = await client.query('SELECT id, name FROM department');
    const departmentChoices = departments.rows.map(dep => ({ name: dep.name, value: dep.id }));

    const { department_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'department_id',
            message: 'Select a department to view employees:',
            choices: departmentChoices
        }
    ]);

    const res = await client.query(
        `SELECT e.first_name, e.last_name, r.title FROM employee e
         JOIN role r ON e.role_id = r.id
         WHERE r.department_id = $1`,
        [department_id]
    );
    console.table(res.rows);
};

// Delete a department, role, or employee
const deleteRecord = async () => {
    const { recordType } = await inquirer.prompt([
        {
            type: 'list',
            name: 'recordType',
            message: 'What would you like to delete?',
            choices: ['Department', 'Role', 'Employee']
        }
    ]);

    switch (recordType) {
        case 'Department':
            const departments = await client.query('SELECT id, name FROM department');
            const departmentChoices = departments.rows.map(dep => ({ name: dep.name, value: dep.id }));

            const { department_id } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'department_id',
                    message: 'Select a department to delete:',
                    choices: departmentChoices
                }
            ]);

            await client.query('DELETE FROM department WHERE id = $1', [department_id]);
            console.log('Department deleted successfully.');
            break;

        case 'Role':
            const roles = await client.query('SELECT id, title FROM role');
            const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));

            const { role_id } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select a role to delete:',
                    choices: roleChoices
                }
            ]);

            await client.query('DELETE FROM role WHERE id = $1', [role_id]);
            console.log('Role deleted successfully.');
            break;

        case 'Employee':
            const employees = await client.query('SELECT id, first_name || \' \' || last_name AS name FROM employee');
            const employeeChoices = employees.rows.map(emp => ({ name: emp.name, value: emp.id }));

            const { employee_id } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: 'Select an employee to delete:',
                    choices: employeeChoices
                }
            ]);

            await client.query('DELETE FROM employee WHERE id = $1', [employee_id]);
            console.log('Employee deleted successfully.');
            break;
    }
};

// View total utilized budget by department
const viewDepartmentBudget = async () => {
    const departments = await client.query('SELECT id, name FROM department');
    const departmentChoices = departments.rows.map(dep => ({ name: dep.name, value: dep.id }));

    const { department_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'department_id',
            message: 'Select a department to view the total utilized budget:',
            choices: departmentChoices
        }
    ]);

    const res = await client.query(
        `SELECT SUM(r.salary) AS total_budget FROM employee e
         JOIN role r ON e.role_id = r.id
         WHERE r.department_id = $1`,
        [department_id]
    );

    console.log(`Total Utilized Budget: $${res.rows[0].total_budget || 0}`);
};

// Start the application
mainMenu();

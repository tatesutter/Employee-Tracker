# Employee Tracker

## Description

The Employee Tracker is a command-line application that helps manage a company's employee database. It allows users to view and manipulate departments, roles, and employee records stored in a PostgreSQL database. This project is built with **Node.js**, **Inquirer**, and **PostgreSQL**.

---

## Table of Contents

- [Employee Tracker](#employee-tracker)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Features](#features)
  - [Database Schema](#database-schema)
  - [Preview](#preview)
  - [License](#license)
    - [Questions?](#questions)

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd Employee-Tracker
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   This will install:
   - `inquirer@8.2.4` (for user prompts)
   - `pg` (for PostgreSQL database interaction)

3. **Set Up the Database**:
   - Install PostgreSQL if not already installed.
   - Create a database named `employee_db`.
   - Execute the `schema.sql` and `seeds.sql` files to set up tables and sample data:
     ```bash
     psql -U postgres -d employee_db -f schema.sql
     psql -U postgres -d employee_db -f seeds.sql
     ```

4. **Update Database Configuration**:
   Open the script file and modify the `dbConfig` object with your PostgreSQL credentials:
   ```javascript
   const dbConfig = {
       user: 'your_username',
       host: 'localhost',
       database: 'employee_db',
       password: 'your_password',
       port: 5432,
   };
   ```

---

## Usage

1. **Run the Application**:
   ```bash
   node employee_cms.js
   ```

2. **Follow the Prompts**:
   - Choose options such as viewing departments, roles, and employees or adding and updating records.
   - Enter details when prompted.

---

## Features

- View all departments, roles, and employees.
- Add new departments, roles, and employees.
- Update employee roles.
- Automatically displays data in a formatted table for clarity.
- Update employee managers.
- View employees by manager or department.
- Delete departments, roles, and employees.
- Calculate total department budgets.

---

## Database Schema

The database contains three tables:

1. **department**:
   - `id`: Primary key.
   - `name`: Name of the department.

2. **role**:
   - `id`: Primary key.
   - `title`: Role title.
   - `salary`: Salary for the role.
   - `department_id`: Foreign key referencing `department.id`.

3. **employee**:
   - `id`: Primary key.
   - `first_name`: Employee’s first name.
   - `last_name`: Employee’s last name.
   - `role_id`: Foreign key referencing `role.id`.
   - `manager_id`: Foreign key referencing `employee.id` (for managers).

---

## Preview

A walkthrough video demonstrating the application's functionality is available [here](/assets/employee-example-video.mp4).

([Use if first link doesn't work](https://www.youtube.com/watch?v=Ubl1IzC-32k))

---

## License

This project is licensed under the [MIT License](LICENSE).

---

### Questions?
For any questions or feedback, feel free to contact me at [tatesutter04@gmail.com](mailto:tatesutter04@gmail.com)


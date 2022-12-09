db.connect(function (err) {
    if (err) throw err;
    console.log('Connected');
    init()
})

const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');
const Department = require('./lib/Department');
const Role = require('./lib/Role')
const Employee = require('./lib/Employee')

function init() {

let departmentArray = ['Sales', 'Engineering', 'Finance', 'Legal']
let roleArray = []

async function mainMenu(){
    let managers = await connection.query(
    `SELECT * FROM employees WHERE employees.manager_id IS NULL`
  );
  console.table(managers);
    inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Choose an option:',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
        }
    ]).then((response) => {
        if ((response.option) ==  'View all departments') {
            return viewAllDepartments()
        }
        else if ((response.option) == 'View all roles') {
            return viewAllRoles()
        } else if ((response.option) == 'View all employees') {
            return viewAllEmployees()
        } else if ((response.option) == 'Add a department') {
            return addDepartment()
        } else if ((response.option) == 'Add a role') {
            return addRole()
        } else if ((response.option) == 'Add an employee') {
            return addEmployee()
        } else if ((response.option) == 'Update an employee role') {
            return updateRole()
        }
    })
}

//shows dept names and id's
function viewAllDepartments() {
    db.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu()
    })
}

//shows job title, role id, the dept that role belongs to, and salary for that role
function viewAllRoles() {
db.query('SELECT * FROM roles', function (err, res) {
    if (err) throw (err);
    console.table(res);
    mainMenu()
})
}

//employee id's, first names, last names, job titles, departments, salaries and manager they report to
function viewAllEmployees() {
    db.query('SELECT * FROM employee', function (err,res) {
        if (err) throw (err);
        console.table(res);
        mainMenu()
    })
}

//enter name of dept -> add that name to db
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department you would like to add?'
        }
    ]).then((response) => {
        let department = new Department(response.name)
        departmentArray.push(department)
    })    
}

//enter the name, salary and dept for the role -> role is then added to db
function addRole() {

    inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'What is the title of the role you would like to add?'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'Please enter a salary for this role:',
            validate(value) {
                const valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
              },
              filter: Number,
        },
        {
            type: 'input',
            name: 'roleDept',
            message: 'What department will this role be in?',
            validate: roleDept => {
                if (departmentArray.indexOf(roleDept) > -1) {
                    return true
                } else {
                    console.log('Please enter a valid department.')
                    return false;
                }
            }
        }
    ]).then((response) => {
        const sql = `INSERT INTO roles(title, salary, departmet_id) VALUES (?,?,?)`;
        const role = new Role(response.roleName.title, response.roleSalary.salary, response.roleDept.department_id)
        db.query(sql, role, (err, res) => {
            if (err) throw err;
            console.log('Role added')
        })
        mainMenu()
    })
} 

//prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
async function addEmployee() {
    let managers = await connection.query(
        `SELECT * FROM employees WHERE employees.manager_id IS NULL`
      );
      console.table(managers);
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'First name of employee:'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Last name of employee:'
        },
        {
            type: 'list',
            name: 'empRole',
            message: "What is the employee's role?",
            choices: roleArray
        },
        {
            type: 'list',
            name: 'empManager',
            message: "Who is the employee's manager?",
            choices: managers
        }


    ])
    const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
    const employee = new Employee(response.firstName.first_name, response.lastName.last_name, response.empRole.role_id, response.empManager.manager_id)
        db.query(sql, employee, (err, res) => {
            if (err) throw err;
            console.log('Employee added')
        })
        mainMenu()

}

//select an employee to update and their new role and this information is updated in the database
function updateRole() {

}
}


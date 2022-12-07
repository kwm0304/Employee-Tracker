const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');
const Department = require('./lib/Department');
const Role = require('./lib/Role')
const Rx = require('rx')

function init() {
let departmentArray = ['Sales', 'Engineering', 'Finance', 'Legal']
function mainMenu(){
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


function viewAllDepartments() {
    db.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        cTable(res);
        mainMenu()
    })
}
function viewAllRoles() {
db.query('SELECT * FROM roles', function (err, res) {
    if (err) throw (err);
    cTable(res);
    mainMenu()
})
}

function viewAllEmployees() {
    db.query('SELECT * FROM employee', function (err,res) {
        if (err) throw (err);
        cTable(res);
        mainMenu()
    })
}

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
        const role = new Role(response.title, response.salary, response.department_id)
        db.query(sql, role, (err, res) => {
            if (err) throw err;
            console.log('Role added')
        })
        mainMenu()
    })
} 

function addEmployee() {

}

function updateRole() {

}
}

l
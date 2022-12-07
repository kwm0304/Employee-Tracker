const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');
const Department = require('./lib/Department');

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
        }.then(response) => {
            let department = new Department(response.name, )
        }
    ])
}

function addRole() {

} 

function addEmployee() {

}

function updateRole() {

}
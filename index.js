const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    
    mainMenu();
})

function mainMenu(){
    
    inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Choose an option:',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'View all managers']
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
        } else if ((response.option) == 'View all managers') {
            return showManagers()
        }
    })
}

//shows dept names and id's
function viewAllDepartments() {
    db.query('SELECT department.id AS id, department.names AS department FROM department', function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu()
    })
}

//shows job title, role id, the dept that role belongs to, and salary for that role
function viewAllRoles() {
db.query('SELECT roles.id, roles.title, roles.salary, department.names AS department FROM roles INNER JOIN department ON roles.department_id = department.id', function (err, res) {
    if (err) throw (err);
    console.table(res);
    const roleChoices = res.map(({ title }) => {title: `${title}`})
    mainMenu()
})
}

//employee id's, first names, last names, job titles, departments, salaries and manager they report to
function viewAllEmployees() {
    let sql = `SELECT employee.id,
            employee.first_name,
            employee.last_name,
            roles.title,
            department.names AS department,
            roles.salary,
            CONCAT (manager.first_name, " ", manager.last_name) AS manager
            FROM employee
            LEFT JOIN roles ON employee.role_id = roles.id
            LEFT JOIN department ON roles.department_id = department.id
            LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    db.query(sql, (err, res) => {
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
        let sql = `INSERT INTO department (names) value (?)`;
        let department = response.departmentName
        db.query(sql, department, (err, res) => {
            if (err) {console.log('oops')}
            else console.table(res)
        })
        mainMenu()
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
            type: 'rawlist',
            name: 'roleDept',
            message: 'Enter the corresponding number for the department this role will be added to: (1 = Sales, 2 = Engineering, 3= Finance, 4 = Legal, 5 = Maintenance',
            choices: [1,2,3,4,5]
        }
    ]).then((response) => {
        const sql = `INSERT INTO roles (title, salary, department_id) VALUES ('${response.roleName}',${response.roleSalary},${response.roleDept})`;
        db.query(sql, (err, response) => {
            console.log(err)
            if (err) throw err;
            console.log('Role added')
            console.table(response)
        })
        mainMenu()
    })
} 


async function showManagers() {
     let sql = `SELECT * from employee WHERE employee.manager_id IS NULL`;
     db.query(sql, (err,response) => {
        console.log(err)
        if (err) throw err;
        console.table(response)
        mainMenu()
     })
     
}
//prompted to enter the employee???s first name, last name, role, and manager, and that employee is added to the database
async function addEmployee() {
    var query =
    `SELECT roles.id, roles.title, roles.salary 
      FROM roles`
    
  db.query(query, function (err, res) {
    if (err) throw err;
    const roleChoices = res.map(({ id, title }) => ({
        value: `${id}`, name: `${title}`
      }))
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
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'empManager',
            message: "Pick the corresponding number to the manager: 1 = John Doe/Sales, 2 = Ashley Rodriguez/Engineering, 3 = Kunal Singh/Finance, 4 = Sarah Lourd/Legal",
            choices: [1,2,3,4]
        }
    ]).then((response) => {     
    const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) 
    VALUES ('${response.firstName}','${response.lastName}','${response.empRole}','${response.empManager}')`;
        db.query(sql, (err, response) => {
            console.log(err)
            if (err) throw err;
            console.log('Employee added')
            console.table(response)
        })
        mainMenu()
    });
    }
)};

//select an employee to update and their new role and this information is updated in the database
async function updateRole() {
    // get employees from employee table 
    const employeeChoices = `SELECT * FROM employee`;
  
    db.query(employeeChoices, (err, data) => {
      if (err) throw err; 
  
    const mapEmployees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: "Select employee to update",
          choices: mapEmployees
        }
      ])
        .then(response => {
          const employee = response.name;
          const set = []; 
          set.push(employee);
  
          const sql = `SELECT * FROM roles`;
  
          db.query(sql, (err, data) => {
            if (err) throw err; 
  
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's new role?",
                  choices: roles
                }
              ])
                  .then(response => {
                  const role = response.role;
                  set.push(role); 
                  
                  let employee = set[0]
                  set[0] = role
                  set[1] = employee 
                  
  
                  // console.log(params)
  
                  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  
                  db.query(sql, set, (err, res) => {
                    if (err) throw err;
                  console.log("Employee has been updated!");
                
                  mainMenu();
            });
          });
        });
      });
    });
  };

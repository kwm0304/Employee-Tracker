DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employee;

USE company;

CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  names VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  CONSTRAINT fk_department
    FOREIGN KEY (department_id)
    REFERENCES department(id)
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,/*hold reference to employee role*/
  manager_id INT/*hold reference to another employee that is the manager of the current employee, null if the employee has no manager*/
  CONSTRAINT fk_roles FOREIGN KEY (role_id) REFERENCES roles(id)
  CONSTRAINT fk_roles FOREIGN KEY (manager_id) REFERENCES roles(id)
);
DROP DATABASE IF EXISTS company;
CREATE DATABASE company;

USE company;

DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employee;

CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  names VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY(department_id) 
    REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT, 
FOREIGN KEY (manager_id) 
    REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) 
    REFERENCES roles(id) ON DELETE CASCADE
);
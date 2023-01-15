-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 25, 2022 at 09:39 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `employeeDB1`
--

-- --------------------------------------------------------

--
-- Table structure for table employee
--

CREATE TABLE `employee` (
  `EmpID` int(20) NOT NULL,
  -- employee ID
  `FirstName` varchar(20) NOT NULL,
  `LastName` varchar(20) NOT NULL,
  -- employee name
  `EmpCode` int(20) NOT NULL,
  -- employee code
  `Salary` int(20) NOT NULL,
  -- employee salary
  `DaysOff` int(20) NOT NULL,
  -- number of days off the employee has availableADD COLUMN 
  `email` VARCHAR(255) NOT NULL,
  -- email
  `phone` VARCHAR(20) NOT NULL,
  -- phone number
  `job_title` VARCHAR(255) NOT NULL,
  -- employee job title
  `dept_name` VARCHAR(255) NOT NULL
  -- department the employee works in
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create a departments table
CREATE TABLE departments (
    `dept_id` INT AUTO_INCREMENT PRIMARY KEY,
    -- department ID auto incrementing number
    `dept_name` VARCHAR(255) NOT NULL,
    -- Department name
    `dept_head` int(20) NOT NULL
    -- Employee ID department Head
);

-- Add foreign key to Departments table 
ALTER TABLE `departments`
ADD FOREIGN KEY (`dept_head`) REFERENCES `employee`(`EmpID`);
--
-- Dumping data for table `employee` and table `departments`
--

INSERT INTO `employee` (`EmpID`, `FirstName`, `LastName`, `EmpCode`, `Salary`, `DaysOff`, `email`, `phone`, `job_title`, `dept_name`) VALUES
(10, 'Peter', 'Griffin', 7892, 500000, 12, 'yacin.montacer@gmail.com', '+216 55 555 555', 'junior accountant', 'Accounting'),
(11, 'Johnny', 'Candito', 13, 40000, 10, 'yacin.montacer@gmail.com', '+216 55 555 555', 'senior engineer', 'IT'),
(12, 'Ed', 'Coan', 89, 77000, 6, 'yacin.montacer@gmail.com', '+216 55 555 555', 'manager', 'IT'),
(13, 'Danielle', 'Melo', 2121, 88000, 5, 'yacin.montacer@gmail.com', '+216 55 555 555', 'manager', 'Accounting'),
(14, 'Amanda', 'Ann', 3232, 110000, 0, 'yacin.montacer@gmail.com', '+216 55 555 555', 'manager', 'HR'),
(15, 'Jaquin', 'Phoenix', 87564, 100000, 2, 'yacin.montacer@gmail.com', '+216 55 555 555', 'senior accountant', 'Accounting'),
(16, 'John', 'Doe', 433512, 90000, 1, 'yacin.montacer@gmail.com', '+216 55 555 555', 'technician', 'IT'),
(17, 'Mark', 'Bell', 2135, 80000, 3, 'yacin.montacer@gmail.com', '+216 55 555 555', 'junior accountant', 'Accounting'),
(18, 'Mark', 'Baum', 5468, 60000, 1, 'yacin.montacer@gmail.com', '+216 55 555 555', 'HR associate', 'HR'),
(19, 'Matt', 'Wenning', 2356, 60000, 20, 'yacin.montacer@gmail.com', '+216 55 555 555', 'junior accountant', 'Accounting'),
(20, 'Homer', 'Simpson', 5421, 300000, 25, 'yacin.montacer@gmail.com', '+216 55 555 555', 'junior engineer', 'IT');

-- Create a table projects

CREATE TABLE `projects`(
  `project_id` INT PRIMARY KEY,
  `project_name` VARCHAR(255) NOT NULL,
  `dept_id` INT,
  FOREIGN KEY (`dept_id`) REFERENCES `departments`(`dept_id`),
  `start_date` DATE NOT NULL,
  `end_date` DATE,
  `EmpID` INT,
  FOREIGN KEY (`EmpID`) REFERENCES `employee`(`EmpID`)
);


INSERT INTO `departments` (`dept_name`, `dept_head`) VALUES
    ('IT', 12),
    ('HR', 14),
    ('Accounting', 13);

-- Add passwords column to employees 
ALTER TABLE `employee` ADD `password` VARCHAR(255);


INSERT INTO `projects` (`project_id`, `project_name`, `dept_id`, `start_date`, `end_date`, `EmpID`)
VALUES 
(1, 'Project A', 1, '2022-01-01', '2022-12-31', 10),
(2, 'Project B', 2, '2022-01-01', '2022-12-31', 11),
(3, 'Project C', 3, '2022-01-01', '2022-12-31', 12),
(4, 'Project D', 1, '2022-01-01', '2022-12-31', 13),
(5, 'Project E', 2, '2022-01-01', '2022-12-31', 14),
(6, 'Project F', 3, '2022-01-01', '2022-12-31', 15),
(7, 'Project G', 1, '2022-01-01', '2022-12-31', 16),
(8, 'Project H', 2, '2022-01-01', '2022-12-31', 17),
(9, 'Project I', 3, '2022-01-01', '2022-12-31', 18),
(10, 'Project J', 1, '2022-01-01', '2022-12-31', 19);


--
-- Indexes for dumped tables
--

--
-- Indexes for table 'employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`EmpID`);
COMMIT;




/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

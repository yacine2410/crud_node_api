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
-- Database: `employeeDB`
--

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `EmpID` int(20) NOT NULL,
  -- employee ID
  `FirstName` varchar(20) NOT NULL,
  `LastName` varchar(20) NOT NULL,
  -- employee name
  `EmpCode` int(20) NOT NULL,
  --employee code
  `Salary` int(20) NOT NULL,
  --employee salary
  `DaysOff` int(20) NOT NULL,
  --number of days off the employee has available
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`EmpID`, `FirstName`, `LastName`, `EmpCode`, `Salary`, `DaysOff`) VALUES
(10, 'Peter', 'Griffin', 7892, 500000, 12),
(11, 'Johnny', 'Candito', 13, 40000, 10),
(12, 'Ed', 'Coan', 89, 77000, 6),
(13, 'Danielle', 'Melo', 2121, 88000, 5),
(14, 'Amanda', 'Ann', 3232, 110000, 0),
(15, 'Jaquin', 'Phoenix', 87564, 100000, 2),
(16, 'John', 'Doe', 433512, 90000, 1),
(17, 'Mark', 'Bell', 2135, 80000, 3),
(18, 'Mark', 'Baum', 5468, 60000, 1),
(19, 'Matt', 'Wenning', 2356, 60000, 20),
(20, 'Homer', 'Simpson', 5421, 300000, 25);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`EmpID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

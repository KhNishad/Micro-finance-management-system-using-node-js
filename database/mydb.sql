-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 10, 2020 at 11:55 AM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `cus_id` int(11) NOT NULL,
  `scheme_id` int(11) NOT NULL,
  `scheme_name` varchar(200) NOT NULL,
  `scheme_amount` float NOT NULL,
  `installment_amount` float NOT NULL,
  `cus_name` varchar(255) NOT NULL,
  `cus_contact` varchar(255) NOT NULL,
  `cus_address` varchar(255) NOT NULL,
  `cus_asset` varchar(255) NOT NULL,
  `asset_price` float NOT NULL,
  `img` varchar(200) NOT NULL,
  `date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`cus_id`, `scheme_id`, `scheme_name`, `scheme_amount`, `installment_amount`, `cus_name`, `cus_contact`, `cus_address`, `cus_asset`, `asset_price`, `img`, `date`) VALUES
(1, 1, 'Home Loan', 300000, 25000, 'Nishad', '01723456765', 'Tangail,Baniara', 'Mobile', 10000, '[000274].jpg', '2020-04-09'),
(2, 1, 'Home Loan', 300000, 25000, 'Habib', '01723456765', 'Khulna', 'Bat', 10000, '[000040].jpg', '2020-04-09'),
(3, 1, 'Home Loan', 300000, 25000, 'TOma', '01723456765', 'Gazipur', 'Laptop', 50000, '[000658].jpg', '2020-04-09'),
(4, 2, 'Phone Loan', 20000, 3333.33, 'Rajon', ' 0172345655454', 'Tangail', 'Lighter', 10000, '[000279].jpg', '2020-04-09'),
(5, 1, 'Home Loan', 300000, 25000, 'test ', '01723456765', 'Tangail,Baniara', 'Mobile', 250000, '[000033].jpg', '2020-04-10'),
(6, 1, 'Home Loan', 300000, 25000, 'test ', '01723456765', 'Tangail,Baniara', 'Mobile', 250000, '[000033].jpg', '2020-04-10'),
(7, 2, 'Phone Loan', 20000, 3333.33, 'test 2', '01723456765', 'Tangail,Baniara', 'Mobile', 250000, '[000033].jpg', '2020-04-10');

-- --------------------------------------------------------

--
-- Table structure for table `installment`
--

CREATE TABLE `installment` (
  `install_id` int(11) NOT NULL,
  `cus_id` int(11) NOT NULL,
  `amount` float NOT NULL,
  `remaining` float NOT NULL,
  `status` varchar(11) NOT NULL,
  `fine` float NOT NULL,
  `ins_date` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `installment`
--

INSERT INTO `installment` (`install_id`, `cus_id`, `amount`, `remaining`, `status`, `fine`, `ins_date`) VALUES
(1, 1, 25000, 275000, 'Late', 50, '2020-05-12'),
(2, 3, 25000, 275000, 'Late', 50, '2020-05-15'),
(3, 2, 25000, 275000, 'On Time', 0, '2020-05-08'),
(4, 2, 25000, 250000, 'Late', 50, '2020-06-13'),
(5, 3, 25000, 250000, 'Late', 50, '2020-06-13'),
(6, 4, 3333.33, 16666.7, 'Late', 50, '2020-04-24'),
(7, 4, 3333.33, 13333.4, 'On Time', 0, '2020-04-11'),
(8, 4, 6666.66, 6666.74, 'Delayed', 66.6666, '2020-05-15'),
(9, 4, 6666.66, 6666.74, 'Delayed', 66.6666, '2020-05-08'),
(10, 4, 3333.33, 10000.1, 'On Time', 0, '2020-04-18'),
(11, 4, 3333.33, 6666.77, 'On Time', 0, '2020-04-25'),
(12, 2, 25000, 225000, 'On Time', 0, '2020-06-18'),
(13, 2, 50000, 175000, 'Delayed', 500, '2020-09-24'),
(14, 2, 50000, 125000, 'Delayed', 500, '2020-12-11'),
(15, 3, 50000, 200000, 'Delayed', 500, '2020-08-07'),
(16, 3, 50000, 150000, 'Delayed', 500, '2020-10-15'),
(17, 3, 25000, 125000, 'Late', 50, '2020-11-07'),
(18, 3, 25000, 100000, 'On Time', 0, '2020-12-05'),
(19, 6, 25000, 275000, 'Late', 50, '2020-04-11'),
(20, 6, 50000, 225000, 'Delayed', 500, '2020-06-13'),
(21, 7, 3333.33, 16666.7, 'Late', 50, '2020-04-11'),
(22, 6, 25000, 200000, 'Late', 50, '2020-04-11');

-- --------------------------------------------------------

--
-- Table structure for table `loan_info`
--

CREATE TABLE `loan_info` (
  `scheme_id` int(11) NOT NULL,
  `cus_id` int(11) NOT NULL,
  `scheme_amount` float NOT NULL,
  `remaining_amount` float NOT NULL,
  `installment_no` int(11) NOT NULL,
  `installment_remaining` int(11) NOT NULL,
  `installment_amount` float NOT NULL,
  `date` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `loan_info`
--

INSERT INTO `loan_info` (`scheme_id`, `cus_id`, `scheme_amount`, `remaining_amount`, `installment_no`, `installment_remaining`, `installment_amount`, `date`) VALUES
(1, 1, 300000, 275000, 12, 11, 25000, '2020-04-09'),
(1, 2, 300000, 125000, 12, 5, 25000, '2020-04-09'),
(1, 3, 300000, 100000, 12, 4, 25000, '2020-04-09'),
(2, 4, 20000, 6666.77, 6, 2, 3333.33, '2020-04-09'),
(1, 5, 300000, 300000, 12, 12, 25000, '2020-04-10'),
(1, 6, 300000, 200000, 12, 8, 25000, '2020-04-10'),
(2, 7, 20000, 16666.7, 6, 5, 3333.33, '2020-04-10');

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE `schedule` (
  `install_no` int(11) NOT NULL,
  `cus_id` int(11) NOT NULL,
  `cus_name` varchar(200) NOT NULL,
  `Time` varchar(255) NOT NULL,
  `status` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `schedule`
--

INSERT INTO `schedule` (`install_no`, `cus_id`, `cus_name`, `Time`, `status`) VALUES
(1, 1, 'Nishad', '2020-05-09', 'paid'),
(2, 1, 'Nishad', '2020-06-08', ''),
(3, 1, 'Nishad', '2020-07-08', ''),
(4, 1, 'Nishad', '2020-08-07', ''),
(5, 1, 'Nishad', '2020-09-06', ''),
(6, 1, 'Nishad', '2020-10-06', ''),
(7, 1, 'Nishad', '2020-11-05', ''),
(8, 1, 'Nishad', '2020-12-05', ''),
(9, 1, 'Nishad', '2021-01-04', ''),
(10, 1, 'Nishad', '2021-02-03', ''),
(11, 1, 'Nishad', '2021-03-05', ''),
(12, 1, 'Nishad', '2021-04-04', ''),
(1, 2, 'Habib', '2020-05-09', 'paid'),
(2, 2, 'Habib', '2020-06-08', 'paid'),
(3, 2, 'Habib', '2020-07-08', 'paid'),
(4, 2, 'Habib', '2020-08-07', 'paid'),
(5, 2, 'Habib', '2020-09-06', 'unpaid'),
(6, 2, 'Habib', '2020-10-06', 'paid'),
(7, 2, 'Habib', '2020-11-05', 'paid'),
(8, 2, 'Habib', '2020-12-05', 'unpaid'),
(9, 2, 'Habib', '2021-01-04', 'unpaid'),
(10, 2, 'Habib', '2021-02-03', 'unpaid'),
(11, 2, 'Habib', '2021-03-05', 'unpaid'),
(12, 2, 'Habib', '2021-04-04', 'unpaid'),
(1, 3, 'TOma', '2020-05-09', 'paid'),
(2, 3, 'TOma', '2020-06-08', 'unpaid'),
(3, 3, 'TOma', '2020-07-08', 'paid'),
(4, 3, 'TOma', '2020-08-07', 'paid'),
(5, 3, 'TOma', '2020-09-06', 'paid'),
(6, 3, 'TOma', '2020-10-06', 'paid'),
(7, 3, 'TOma', '2020-11-05', 'paid'),
(8, 3, 'TOma', '2020-12-05', 'paid'),
(9, 3, 'TOma', '2021-01-04', 'unpaid'),
(10, 3, 'TOma', '2021-02-03', 'unpaid'),
(11, 3, 'TOma', '2021-03-05', 'unpaid'),
(12, 3, 'TOma', '2021-04-04', 'unpaid'),
(1, 4, 'Rajon', '2020-04-16', 'paid'),
(2, 4, 'Rajon', '2020-04-23', 'unpaid'),
(3, 4, 'Rajon', '2020-04-30', 'unpaid'),
(4, 4, 'Rajon', '2020-05-07', 'unpaid'),
(5, 4, 'Rajon', '2020-05-14', 'unpaid'),
(6, 4, 'Rajon', '2020-05-21', 'unpaid'),
(1, 5, 'test ', '2020-04-11', 'unpaid'),
(2, 5, 'test ', '2020-04-12', 'unpaid'),
(3, 5, 'test ', '2020-04-13', 'unpaid'),
(4, 5, 'test ', '2020-04-14', 'unpaid'),
(5, 5, 'test ', '2020-04-15', 'unpaid'),
(6, 5, 'test ', '2020-04-16', 'unpaid'),
(7, 5, 'test ', '2020-04-17', 'unpaid'),
(8, 5, 'test ', '2020-04-18', 'unpaid'),
(9, 5, 'test ', '2020-04-19', 'unpaid'),
(10, 5, 'test ', '2020-04-20', 'unpaid'),
(11, 5, 'test ', '2020-04-21', 'unpaid'),
(12, 5, 'test ', '2020-04-22', 'unpaid'),
(1, 6, 'test ', '2020-04-10', 'paid'),
(2, 6, 'test ', '2020-04-10', 'paid'),
(3, 6, 'test ', '2020-04-10', 'paid'),
(4, 6, 'test ', '2020-04-10', 'paid'),
(5, 6, 'test ', '2020-04-10', 'unpaid'),
(6, 6, 'test ', '2020-04-10', 'unpaid'),
(7, 6, 'test ', '2020-04-10', 'unpaid'),
(8, 6, 'test ', '2020-04-10', 'unpaid'),
(9, 6, 'test ', '2020-04-10', 'unpaid'),
(10, 6, 'test ', '2020-04-10', 'unpaid'),
(11, 6, 'test ', '2020-04-10', 'unpaid'),
(12, 6, 'test ', '2020-04-10', 'unpaid'),
(1, 7, 'test 2', '2020-04-10', 'paid'),
(2, 7, 'test 2', '2020-04-10', 'unpaid'),
(3, 7, 'test 2', '2020-04-10', 'unpaid'),
(4, 7, 'test 2', '2020-04-10', 'unpaid'),
(5, 7, 'test 2', '2020-04-10', 'unpaid'),
(6, 7, 'test 2', '2020-04-10', 'unpaid');

-- --------------------------------------------------------

--
-- Table structure for table `scheme`
--

CREATE TABLE `scheme` (
  `scheme_id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `amount` float NOT NULL,
  `r_asset` float NOT NULL,
  `no_installment` int(11) NOT NULL,
  `Install_amount` float NOT NULL,
  `duration` varchar(20) NOT NULL,
  `date` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `scheme`
--

INSERT INTO `scheme` (`scheme_id`, `name`, `amount`, `r_asset`, `no_installment`, `Install_amount`, `duration`, `date`) VALUES
(1, 'Home Loan', 300000, 10000, 12, 25000, 'month', '2020-04-09 '),
(2, 'Phone Loan', 20000, 5000, 6, 3333.33, 'week', '2020-04-09 ');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `father_name` varchar(200) NOT NULL,
  `likee` varchar(200) NOT NULL,
  `pass` varchar(20) NOT NULL,
  `time` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `father_name`, `likee`, `pass`, `time`) VALUES
(4, 'test1', 'test1@gmail.com', '', '', '12345', '2020-02-18 12:56:14'),
(5, 'Nishad', 'k@gmail.com', '', '', '12345', '2020-02-18 1:07:20'),
(6, 'Nishad', 'k@gmail.com', '', '', '12345', '2020-02-18 1:07:43'),
(25, 'Nishad', 'k@gmail.com', '', '', 'df', '2020-02-18 1:23:09'),
(28, 'TOma', 'k@gmail.com', '', '', 'jjj', '2020-02-18 1:25:10'),
(34, 'Nishad3', 'kkhnishad@gmail.com', '', '', '123', '2020-02-20 9:51:15'),
(35, 'inventory', 'kkhnishad@gmail.com', '', '', 'bb', '2020-02-20 9:54:29'),
(36, 'inventory', 'k@gmail.com', '', '', 'bb', '2020-02-20 9:55:34'),
(37, 'Suleiman', 'mangnificent@hmmm', '', '', '12345', '2020-04-02'),
(38, 'Nishad', 'nis@gmail.com', 'wakil', 'cric', '12345', '2020-04-05'),
(39, 'Alvi', 'alvi4200@gmail.com', 'faruki', 'bal', '12345', '2020-04-05'),
(40, 'Viper', 'kkkkhnishad@gmail.com', 'Wakil', 'cric', '12345', '2020-04-10'),
(41, 'Alvi', 'alvi4201@gmail.com', 'faruki', 'bal', '12345', '2020-04-10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`cus_id`),
  ADD KEY `scheme` (`scheme_id`);

--
-- Indexes for table `installment`
--
ALTER TABLE `installment`
  ADD PRIMARY KEY (`install_id`);

--
-- Indexes for table `loan_info`
--
ALTER TABLE `loan_info`
  ADD KEY `scheme_id` (`scheme_id`),
  ADD KEY `cus_id` (`cus_id`),
  ADD KEY `cus_id_2` (`cus_id`);

--
-- Indexes for table `schedule`
--
ALTER TABLE `schedule`
  ADD KEY `cus_id` (`cus_id`);

--
-- Indexes for table `scheme`
--
ALTER TABLE `scheme`
  ADD PRIMARY KEY (`scheme_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `cus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `installment`
--
ALTER TABLE `installment`
  MODIFY `install_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `loan_info`
--
ALTER TABLE `loan_info`
  MODIFY `cus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `scheme`
--
ALTER TABLE `scheme`
  MODIFY `scheme_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

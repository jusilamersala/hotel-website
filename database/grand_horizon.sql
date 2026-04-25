-- Sigurohu që databaza ekziston
CREATE DATABASE IF NOT EXISTS `grand_horizon`;
USE `grand_horizon`;

CREATE TABLE IF NOT EXISTS `contact` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `Room_Type` (
    `room_Type_ID` INT PRIMARY KEY,
    `type` ENUM('Single', 'Double', 'Suite', 'Deluxe'),
    `description` VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS `Room` (
    `room_ID` INT PRIMARY KEY,
    `room_Type_ID` INT,
    `name` VARCHAR(100),
    `floor` INT,
    `description` VARCHAR(255),
    `price` FLOAT,
    `availability` ENUM('Available', 'Occupied', 'Maintenance'),

    FOREIGN KEY (Room_Type_ID) REFERENCES Room_Type(Room_Type_ID)
);


CREATE TABLE IF NOT EXISTS `User` (
    `user_ID` INT PRIMARY KEY,
    `name` VARCHAR(100),
    `surname` VARCHAR(100),
    `password` VARCHAR(255),
    `email` VARCHAR(100),
    `role` VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS `Booking` (
    `booking_ID` INT PRIMARY KEY,
    `user_ID` INT,
    `room_ID` INT,
    `booking_Date` DATE,
    `status` ENUM('Pending', 'Confirmed', 'Cancelled'),
    `check_In_Date` DATE,
    `check_Out_Date` DATE,
    `email_verified` BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (user_ID) REFERENCES User(User_ID),
    FOREIGN KEY (room_ID) REFERENCES Room(Room_ID)
);

CREATE TABLE IF NOT EXISTS `Services` (
    `service_ID` INT PRIMARY KEY,
    `service_Type` VARCHAR(100),
    `service_Price` FLOAT
);

CREATE TABLE IF NOT EXISTS `Booking_Services` (
    `booking_ID` INT,
    `service_ID` INT,

    PRIMARY KEY (booking_ID, service_ID),

    FOREIGN KEY (booking_ID) REFERENCES Booking(Booking_ID),
    FOREIGN KEY (service_ID) REFERENCES Services(Service_ID)
);

CREATE TABLE IF NOT EXISTS `Invoice` (
    `invoice_ID` INT PRIMARY KEY,
    `booking_ID` INT,
    `invoice_Date` DATE,
    `status` ENUM('Paid', 'Unpaid', 'Pending'),
    `amount` FLOAT,

    FOREIGN KEY (booking_ID) REFERENCES Booking(booking_ID)
);

CREATE TABLE IF NOT EXISTS `Staff` (
    `staff_ID` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100),
    `surname` VARCHAR(100),
    `email` VARCHAR(100),
    `role` VARCHAR(50),
    `shift` VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS `Timetable` (
    `timetable_ID` INT PRIMARY KEY AUTO_INCREMENT,
    `staff_ID` INT,
    `date` DATE,
    `start_time` TIME,
    `end_time` TIME,
    `task` VARCHAR(255),

    FOREIGN KEY (staff_ID) REFERENCES Staff(staff_ID)
);

ALTER TABLE Booking DROP FOREIGN KEY Booking_ibfk_1;
ALTER TABLE User MODIFY COLUMN user_ID INT AUTO_INCREMENT;

ALTER TABLE Booking ADD CONSTRAINT Booking_ibfk_1 
FOREIGN KEY (user_ID) REFERENCES User(user_ID);
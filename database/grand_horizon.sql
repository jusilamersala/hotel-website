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

ALTER TABLE User ADD COLUMN is_verified TINYINT(1) DEFAULT 0;
ALTER TABLE User ADD COLUMN verification_token VARCHAR(255) NULL;

DROP TABLE IF EXISTS `Booking`;

CREATE TABLE `Booking` (
    `booking_ID` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `surname` VARCHAR(100) NOT NULL,
    `room_type` VARCHAR(100) NOT NULL,
    `price` INT NOT NULL,
    `check_In_Date` DATE NOT NULL,
    `check_Out_Date` DATE NOT NULL,
    `extra_service` VARCHAR(100) DEFAULT NULL,
    `service_price` INT DEFAULT 0,
    `status` VARCHAR(50) DEFAULT 'Confirmed',
    `booking_Date` DATETIME DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE Booking
    ADD COLUMN total_nights INT DEFAULT 0 AFTER check_Out_Date;

ALTER TABLE Booking
    ADD COLUMN total_price DECIMAL(10,2) DEFAULT 0.00 AFTER total_nights;

ALTER TABLE Booking
    ADD COLUMN phone VARCHAR(20) AFTER total_price;

ALTER TABLE Booking
    ADD COLUMN payment_method ENUM('cash','card') DEFAULT 'cash' AFTER phone;

ALTER TABLE Booking
    MODIFY COLUMN booking_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER payment_method;

-- Rregullimet e Invoice
ALTER TABLE Invoice
    MODIFY COLUMN invoice_ID INT AUTO_INCREMENT;

ALTER TABLE Invoice
    MODIFY COLUMN amount DECIMAL(10,2) NOT NULL;

ALTER TABLE Invoice
    ADD COLUMN payment_method ENUM('cash','card') DEFAULT 'cash' AFTER amount;

ALTER TABLE Invoice
    MODIFY COLUMN invoice_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER payment_method;

CREATE TABLE IF NOT EXISTS `Services` (
    `service_ID` INT PRIMARY KEY,
    `service_Type` VARCHAR(100),
    `service_Price` FLOAT
);

ALTER TABLE Services
CHANGE COLUMN service_Type service_Name VARCHAR(100) NOT NULL;

ALTER TABLE Services
ADD COLUMN service_Description TEXT AFTER service_Name;

ALTER TABLE Services
MODIFY COLUMN service_Price DECIMAL(10, 2) DEFAULT 0.00;

ALTER TABLE Services
ADD COLUMN is_Included TINYINT(1) DEFAULT 0;

ALTER TABLE Services
MODIFY COLUMN service_ID INT AUTO_INCREMENT;

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

ALTER TABLE Room_Type MODIFY COLUMN type VARCHAR(50);

ALTER TABLE Room 
ADD COLUMN image_url VARCHAR(255) AFTER description,
ADD COLUMN capacity INT DEFAULT 2 AFTER image_url;

INSERT INTO Room (room_ID, room_type_ID, name, floor, description, price, availability, image_url, capacity) 
VALUES (
    1,
    16, -- Supozojmë që 4 është ID për 'Luxury Double'
    'Deluxe Double Room', 
    2, 
    'Një dhomë luksoze me krevat king-size dhe pamje nga kopshti i hotelit.', 
    85.00, 
    'Available', 
    'assets/images/rooms/deluxe-double.jpg', 
    2
);

INSERT INTO Room_Type (type, description) VALUES 
('Standard Single', 'Dhomë komode për një person, e pajisur me krevat tek, tavolinë pune dhe sistem ngrohje/ftohje.'),
('Luxury Single', 'Akomodim premium për një person, me mobilim modern, mini-bar dhe shërbim dhome të dedikuar.'),
('Standard Double', 'Dhomë me krevat dopio, e përshtatshme për dy persona, me Wi-Fi dhe pajisje bazë komoditeti.'),
('Luxury Double', 'Hapësirë elegante me krevat king-size, dekor luksoz dhe sistem zanor premium.'),
('Twin Room', 'Dhomë me dy krevatë teke të ndarë, ideale për udhëtarë që ndajnë të njëjtën dhomë.'),
('Triple Room', 'Dhomë e gjerë me tre krevatë teke, e krijuar për të ofruar komoditet maksimal për tre persona.'),
('Junior Suite', 'Hapësirë që ndërthur dhomën e gjumit me një zonë të vogël ndenjeje për më shumë rehati.'),
('Executive Suite', 'Suitë me standarde të larta, e pajisur me dhomë ndenjeje të veçantë dhe pajisje zyre.'),
('Presidential Suite', 'Niveli më i lartë i luksit me pajisje ekskluzive, dhomë ndenjeje të madhe dhe shërbim VIP.'),
('Family Room', 'Dhomë e përshtatur për familje, me kombinim krevatësh për të rritur dhe fëmijë.'),
('Studio', 'Dhomë funksionale që përfshin një aneks kuzhine të vogël dhe zonë për ngrënie.');

INSERT INTO Room (room_type_ID, name, floor, description, image_url, capacity, price, availability) VALUES 
(1, 'Eco Single 101', 1, 'Dhomë komode me pamje nga kopshti.', 'assets/rooms/ecosingle-room.jpg', 1, 45.00, 'Available'),
(1, 'Classic Single 201', 2, 'Dhomë e qetë, ideale për punë.', 'assets/rooms/classic-singleroom.jpg', 1, 45.00, 'Available'),
(2, 'Premium Single 301', 3, 'Pamje panoramike dhe mini-bar.',  'assets/rooms/premium-singleroom.jpg', 1, 65.00, 'Available'),
(2, 'Elite Single 302', 3, 'Mobilim modern dhe shërbim premium.', 'assets/rooms/elite-singleroom.jpg', 1, 65.00, 'Available'),
(3, 'Standard Double 102', 1, 'Krevat dopio dhe shumë dritë natyrale.', 'assets/rooms/standard-doubleroom.jpg', 2, 75.00, 'Available'),
(3, 'Standard Double 202', 2, 'Ideale për çifte, ambient i ngrohtë.',  'assets/rooms/standard-doubleroom.jpg', 2, 75.00, 'Available'),
(4, 'Deluxe Double 401', 4, 'Krevat King-size dhe ballkon privat.', 'assets/rooms/deluxe-doubleroom.jpg', 2, 110.00, 'Available'),
(4, 'Royal Double 402', 4, 'Dekor luksoz dhe jacuzzi në dhomë.', 'assets/rooms/royal-doubleroom.jpg', 2, 125.00, 'Available'),
(5, 'Twin Classic 103', 1, 'Dy krevatë teke, komode për miq.', 'assets/rooms/twin-classicroom.jpg', 2, 80.00, 'Available'),
(5, 'Twin Superior 203', 2, 'Hapësirë e bollshme me dy krevatë.', 'assets/rooms/twin-superiorroom.jpg', 2, 80.00, 'Available'),
(6, 'Triple Family 104', 1, 'Tre krevatë teke, shumë hapësirë.', 'assets/rooms/triple-familyroom.jpg', 3, 100.00, 'Available'),
(6, 'Triple Comfort 204', 2, 'Ideale për grupe miqsh.', 'assets/rooms/triple-comfortroom.jpg', 3, 100.00, 'Available'),
(7, 'Junior Suite 501', 5, 'Zonë ndenjeje dhe krevat mbretëror.', 'assets/rooms/junior-suiteroom.jpg', 2, 150.00, 'Available'),
(7, 'Junior Suite 502', 5, 'Dizajn modern dhe komoditet ekstra.', 'assets/rooms/junior-suiteroom.jpg', 2, 150.00, 'Available'),
(8, 'Executive Business 601', 6, 'Suitë me zyrë dhe dhomë gjumi.', 'assets/rooms/executive-businessroom.jpg', 2, 220.00, 'Available'),
(8, 'Executive VIP 602', 6, 'Për takime biznesi dhe luks.', 'assets/rooms/executive-viproom.jpg', 2, 220.00, 'Available'),
(9, 'Presidential 701', 7, 'Luks absolut dhe siguri maksimale.', 'assets/rooms/presidential-room.jpg', 4, 500.00, 'Available'),
(9, 'Presidential 702', 7, 'Suitë elitare me pamje 360 gradë.', 'assets/rooms/presidential-room.jpg', 4, 500.00, 'Available'),

(10, 'Family 105', 1, 'Kombinim krevatesh për prindër e fëmijë.', 'assets/rooms/family-room.jpg', 4, 130.00, 'Available'),
(10, 'Family 205', 2, 'Hapësirë e madhe dhe lojëra për fëmijë.', 'assets/rooms/family-room.jpg', 4, 130.00, 'Available'),
(11, 'Studio Kitchen 106', 1, 'Me aneks kuzhine për qëndrime të gjata.', 'assets/rooms/studio-kitchen.jpg', 2, 90.00, 'Available'),
(11, 'Modern Studio 206', 2, 'E vogël, praktike dhe shumë moderne.', 'assets/rooms/modern-studioroom.jpg', 2, 90.00, 'Available');




TRUNCATE TABLE Services;

INSERT INTO Services (service_Name, service_Description, service_Price, is_Included)
VALUES 
('Pishina & Sauna', 
 'Relaksohuni në pishinën tonë të brendshme me ujë të ngrohtë dhe ambientet e saunës finlandeze. Ky shërbim ofrohet falas për të gjithë mysafirët e hotelit dhe është i hapur çdo ditë nga ora 07:00 deri në 22:00, duke përfshirë edhe zonën e dedikuar të relaksit.', 
 0.00, 1),
('Palestër & Fitness', 
 'Për të gjithë të apasionuarit pas sportit, qendra jonë e fitnesit ofron pajisjet më moderne për kardio dhe forcë. Ambienti është i pajisur me sistem kondicionimi dhe është në dispozicionin tuaj 24 orë në ditë për t u siguruar që rutina juaj stërvitore të mos ndërpritet.', 
 0.00, 1),
('Terapi & Masazhe', 
 'Rigjallëroni trupin dhe mendjen tuaj me seancat tona të masazhit profesional. Mund të zgjidhni midis masazhit suedez, masazhit me gurë të nxehtë apo aromaterapisë. Çdo seancë zgjat 60 minuta dhe realizohet nga terapistë të trajnuar në një ambient tejet qetësues.', 
 50.00, 0),
('Trajtime Fytyre & Wellness', 
 'Kujdesuni për lëkurën tuaj me trajtimet tona ekskluzive të fytyrës. Duke përdorur produkte organike të cilësisë së lartë, ky shërbim përfshin pastrim të thellë, hidratim dhe masazh facial që do t ju japë një ndjesi freskie dhe shkëlqim natyral.', 
 35.00, 0);

 INSERT INTO `User` (name, surname, password, email, role, is_verified) 
VALUES (
    'Admin', 
    'Admin', 
    '123456',
    'admin@gmail.com', 
    'Admin', 
    1
);

UPDATE `User` 
SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
WHERE role = 'Admin';

INSERT INTO `User`(name, surname, password, email, role, is_verified) 
VALUES (
    'Admin', 
    'Test', 
    '$2y$12$VzKB/635UI0mi4.gU5vBbeeMi7cbEoziP/KmN1hgkNH2H.JM4h.S6', 
    'admin@test.com', 
    'Admin', 
    1
);

UPDATE `User`
SET 
 role= 'Admin'
WHERE `user_ID` = 16;
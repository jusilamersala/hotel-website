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
(1, 'Eco Single 101', 1, 'Dhomë komode me pamje nga kopshti.', 'assets/images/single-std.jpg', 1, 45.00, 'Available'),
(1, 'Classic Single 201', 2, 'Dhomë e qetë, ideale për punë.', 'assets/images/single-std.jpg', 1, 45.00, 'Available'),
(2, 'Premium Single 301', 3, 'Pamje panoramike dhe mini-bar.', 'assets/images/single-lux.jpg', 1, 65.00, 'Available'),
(2, 'Elite Single 302', 3, 'Mobilim modern dhe shërbim premium.', 'assets/images/single-lux.jpg', 1, 65.00, 'Available'),
(3, 'Standard Double 102', 1, 'Krevat dopio dhe shumë dritë natyrale.', 'assets/images/double-std.jpg', 2, 75.00, 'Available'),
(3, 'Standard Double 202', 2, 'Ideale për çifte, ambient i ngrohtë.', 'assets/images/double-std.jpg', 2, 75.00, 'Available'),
(4, 'Deluxe Double 401', 4, 'Krevat King-size dhe ballkon privat.', 'assets/images/double-lux.jpg', 2, 110.00, 'Available'),
(4, 'Royal Double 402', 4, 'Dekor luksoz dhe jacuzzi në dhomë.', 'assets/images/double-lux.jpg', 2, 125.00, 'Available'),
(5, 'Twin Classic 103', 1, 'Dy krevatë teke, komode për miq.', 'assets/images/twin.jpg', 2, 80.00, 'Available'),
(5, 'Twin Superior 203', 2, 'Hapësirë e bollshme me dy krevatë.', 'assets/images/twin.jpg', 2, 80.00, 'Available'),
(6, 'Triple Family 104', 1, 'Tre krevatë teke, shumë hapësirë.', 'assets/images/triple.jpg', 3, 100.00, 'Available'),
(6, 'Triple Comfort 204', 2, 'Ideale për grupe miqsh.', 'assets/images/triple.jpg', 3, 100.00, 'Available'),
(7, 'Junior Suite 501', 5, 'Zonë ndenjeje dhe krevat mbretëror.', 'assets/images/junior-suite.jpg', 2, 150.00, 'Available'),
(7, 'Junior Suite 502', 5, 'Dizajn modern dhe komoditet ekstra.', 'assets/images/junior-suite.jpg', 2, 150.00, 'Available'),
(8, 'Executive Business 601', 6, 'Suitë me zyrë dhe dhomë gjumi.', 'assets/images/exec-suite.jpg', 2, 220.00, 'Available'),
(8, 'Executive VIP 602', 6, 'Për takime biznesi dhe luks.', 'assets/images/exec-suite.jpg', 2, 220.00, 'Available'),
(9, 'Presidential 701', 7, 'Luks absolut dhe siguri maksimale.', 'assets/images/presid-suite.jpg', 4, 500.00, 'Available'),
(9, 'Presidential 702', 7, 'Suitë elitare me pamje 360 gradë.', 'assets/images/presid-suite.jpg', 4, 500.00, 'Available'),
(10, 'Family 105', 1, 'Kombinim krevatesh për prindër e fëmijë.', 'assets/images/family.jpg', 4, 130.00, 'Available'),
(10, 'Family 205', 2, 'Hapësirë e madhe dhe lojëra për fëmijë.', 'assets/images/family.jpg', 4, 130.00, 'Available'),
(11, 'Studio Kitchen 106', 1, 'Me aneks kuzhine për qëndrime të gjata.', 'assets/images/studio.jpg', 2, 90.00, 'Available'),
(11, 'Modern Studio 206', 2, 'E vogël, praktike dhe shumë moderne.', 'assets/images/studio.jpg', 2, 90.00, 'Available');


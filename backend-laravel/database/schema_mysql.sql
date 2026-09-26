-- ========================================================
-- Somali Hospital Queue & Clinical Management System
-- Database Schema & Initial Data for MySQL 8.0+ / MariaDB
-- Database Name: somali_hospital_db
-- ========================================================

CREATE DATABASE IF NOT EXISTS `somali_hospital_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `somali_hospital_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Table: Users (Shaqaalaha Isbitaalka)
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `custom_id` varchar(100) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','doctor','nurse','receptionist','pharmacist','patient') NOT NULL DEFAULT 'receptionist',
  `title` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `specialty` varchar(255) DEFAULT NULL,
  `assigned_room_id` varchar(50) DEFAULT NULL,
  `patient_ticket` varchar(50) DEFAULT NULL,
  `avatar` text DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_custom_id_unique` (`custom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: Doctor Rooms (Qolalka Dhakhaatiirta)
DROP TABLE IF EXISTS `doctor_rooms`;
CREATE TABLE `doctor_rooms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `room_code` varchar(50) NOT NULL,
  `room_name` varchar(255) NOT NULL,
  `doctor_name` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `specialty` varchar(255) NOT NULL,
  `current_patient_id` varchar(50) DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `doctor_rooms_room_code_unique` (`room_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: Patients (Bukaanada & Safka Tikidhada)
DROP TABLE IF EXISTS `patients`;
CREATE TABLE `patients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ticket_number` varchar(50) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `age` int NOT NULL,
  `gender` enum('female','male') NOT NULL,
  `category` enum('maternal','child','adult','emergency') NOT NULL DEFAULT 'adult',
  `pregnancy_week` int DEFAULT NULL,
  `symptoms` text DEFAULT NULL,
  `triage_level` enum('emergency','urgent','routine') NOT NULL DEFAULT 'routine',
  `triage_score` int NOT NULL DEFAULT '3',
  `vitals` json DEFAULT NULL,
  `status` enum('waiting','called','in_consultation','completed','referred') NOT NULL DEFAULT 'waiting',
  `assigned_room_id` varchar(50) DEFAULT NULL,
  `assigned_doctor_name` varchar(255) DEFAULT NULL,
  `registered_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `called_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `estimated_wait_minutes` int NOT NULL DEFAULT '15',
  `doctor_notes` text DEFAULT NULL,
  `prescriptions` json DEFAULT NULL,
  `vaccination_follow_up` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patients_ticket_number_unique` (`ticket_number`),
  KEY `patients_status_index` (`status`),
  KEY `patients_triage_score_index` (`triage_score`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: Prescriptions (Warqadaha Dawooyinka)
DROP TABLE IF EXISTS `prescriptions`;
CREATE TABLE `prescriptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `prescription_number` varchar(50) NOT NULL,
  `patient_id` bigint unsigned DEFAULT NULL,
  `patient_ticket` varchar(50) NOT NULL,
  `patient_name` varchar(255) NOT NULL,
  `doctor_name` varchar(255) NOT NULL,
  `doctor_room` varchar(100) DEFAULT NULL,
  `medicines` json NOT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('pending','dispensed','cancelled') NOT NULL DEFAULT 'pending',
  `dispensed_by` varchar(255) DEFAULT NULL,
  `dispensed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `prescriptions_number_unique` (`prescription_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: Maternal Records (Daryeelka Hooyada & Dhallaanka)
DROP TABLE IF EXISTS `maternal_records`;
CREATE TABLE `maternal_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `mother_name` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `age` int NOT NULL,
  `pregnancy_weeks` int NOT NULL,
  `trimester` tinyint NOT NULL DEFAULT '1',
  `next_checkup_date` date DEFAULT NULL,
  `last_hb_level` varchar(50) DEFAULT NULL,
  `risk_level` enum('safe','caution','high_risk') NOT NULL DEFAULT 'safe',
  `child_name` varchar(255) DEFAULT NULL,
  `child_age_months` int DEFAULT NULL,
  `next_vaccine_due` date DEFAULT NULL,
  `vaccine_date` date DEFAULT NULL,
  `sms_sent` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table: Pharmacy Inventory (Keydka Dawooyinka)
DROP TABLE IF EXISTS `pharmacy_items`;
CREATE TABLE `pharmacy_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `generic_name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `minimum_threshold` int NOT NULL DEFAULT '20',
  `unit` varchar(50) NOT NULL,
  `dosage` varchar(255) NOT NULL,
  `expiry_date` date NOT NULL,
  `storage_location` varchar(100) DEFAULT NULL,
  `unit_price` decimal(8,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================
-- Initial Data Seeding (Xogta Hordhaca Ah)
-- ========================================================

-- Insert Staff Users (Passwords: Admin123!, Doctor123!, Nurse123!, Reception123!, Pharm123!)
INSERT INTO `users` (`custom_id`, `name`, `email`, `password`, `role`, `title`, `department`, `phone`, `avatar`) VALUES
('u-admin', 'Agaasime Cabdiraxmaan Xasan', 'admin@somali-hospital.so', '$2y$12$K1rS2mZc75aWjE8v9e73tebT/QhGqg4wQ1P7Ue7R3o9HqLg0xT4nO', 'admin', 'Agaasimaha Guud ee Isbitaalka', 'Maamulka Guud', '+252 61 555 0100', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'),
('u-doc-1', 'Dr. Faadumo Cali Cumar', 'faadumo@somali-hospital.so', '$2y$12$K1rS2mZc75aWjE8v9e73tebT/QhGqg4wQ1P7Ue7R3o9HqLg0xT4nO', 'doctor', 'Agaasimaha Qaybta Hooyada & Dhallaanka', 'Daryeelka Hooyada & Dhallaanka', '+252 61 555 0101', 'https://images.unsplash.com/photo-1594824813589-354316d5fb9d?auto=format&fit=crop&q=80&w=200'),
('u-doc-2', 'Dr. Axmed Maxamed Warsame', 'axmed@somali-hospital.so', '$2y$12$K1rS2mZc75aWjE8v9e73tebT/QhGqg4wQ1P7Ue7R3o9HqLg0xT4nO', 'doctor', 'Takhasuska Daawada Guud', 'Daawada Guud (General Medicine)', '+252 61 555 0102', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200'),
('u-nurse-1', 'Kalkaaliso Maryan Yuusuf', 'maryan@somali-hospital.so', '$2y$12$K1rS2mZc75aWjE8v9e73tebT/QhGqg4wQ1P7Ue7R3o9HqLg0xT4nO', 'nurse', 'Madaxa Kalkaalada Triage-ka', 'Qaybta Triage & Degdegga', '+252 61 555 0103', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=200'),
('u-rec-1', 'Soo-dhaweeye Khadar Aadan', 'reception@somali-hospital.so', '$2y$12$K1rS2mZc75aWjE8v9e73tebT/QhGqg4wQ1P7Ue7R3o9HqLg0xT4nO', 'receptionist', 'Sarkaalka Soo Dhaweynta & Tikidhada', 'Qaybta Soo Dhaweynta & Safka', '+252 61 555 0104', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'),
('u-pharm-1', 'Dawo-bixiye Saynab Cabdi', 'pharmacy@somali-hospital.so', '$2y$12$K1rS2mZc75aWjE8v9e73tebT/QhGqg4wQ1P7Ue7R3o9HqLg0xT4nO', 'pharmacist', 'Madaxa Farmashiyaha Guud', 'Farmashiyaha Isbitaalka', '+252 61 555 0105', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200');

-- Insert Doctor Rooms
INSERT INTO `doctor_rooms` (`room_code`, `room_name`, `doctor_name`, `title`, `specialty`, `current_patient_id`, `is_available`) VALUES
('room-1', 'Qolka 1: Daryeelka Hooyada & Dhallaanka', 'Dr. Faadumo Cali Cumar', 'Agaasimaha Qaybta Hooyada & Dhallaanka', 'Maternal & Child Health', 'M-14', 1),
('room-2', 'Qolka 2: Daawada Guud & Baaritaanka', 'Dr. Axmed Maxamed Warsame', 'Takhasuska Daawada Guud', 'General Medicine', NULL, 1),
('room-3', 'Qolka 3: Qalliinka & Dhaawacyada Degdegga ah', 'Dr. Xasan Nuur Ciise', 'Qalliinka Guud', 'General Surgery & Trauma', 'E-01', 1),
('room-4', 'Qolka 4: Cudurrada Carruurta (Pediatrics)', 'Dr. Leyla Cabdullaahi', 'Takhasuska Cudurrada Carruurta', 'Pediatrics', NULL, 1);

-- Insert Active Queue Patients
INSERT INTO `patients` (`ticket_number`, `full_name`, `phone`, `age`, `gender`, `category`, `pregnancy_week`, `symptoms`, `triage_level`, `triage_score`, `vitals`, `status`, `assigned_room_id`, `assigned_doctor_name`, `estimated_wait_minutes`) VALUES
('E-01', 'Sharmaarke Cabdullaahi', '+252 61 555 7711', 34, 'male', 'emergency', NULL, 'Dhaawac degdeg ah iyo neefsasho adag', 'emergency', 1, '{"temperature": 38.5, "bloodPressure": "85/55", "heartRate": 128, "spO2": 88}', 'called', 'room-3', 'Dr. Xasan Nuur Ciise', 0),
('M-14', 'Xaliimo Cabdi Faarax', '+252 61 555 9922', 26, 'female', 'maternal', 32, 'Dhabar xanuun daran & cadaadis dhiig oo kordhay', 'urgent', 2, '{"temperature": 37.1, "bloodPressure": "145/95", "heartRate": 88, "spO2": 97}', 'called', 'room-1', 'Dr. Faadumo Cali Cumar', 0),
('P-08', 'Yuusuf Maxamed (Dhallaanka)', '+252 61 555 3344', 2, 'male', 'child', NULL, 'Qandho sare & shuban biyood', 'urgent', 2, '{"temperature": 39.2, "bloodPressure": "90/60", "heartRate": 135, "spO2": 95}', 'waiting', 'room-4', 'Dr. Leyla Cabdullaahi', 8),
('R-33', 'Cali Jaamac Geedi', '+252 61 555 4488', 45, 'male', 'adult', NULL, 'Madax xanuun daba dheeraaday & qufac fudud', 'routine', 3, '{"temperature": 36.6, "bloodPressure": "120/80", "heartRate": 72, "spO2": 99}', 'waiting', 'room-2', 'Dr. Axmed Maxamed Warsame', 20);

-- Insert Pharmacy Items
INSERT INTO `pharmacy_items` (`name`, `generic_name`, `category`, `stock`, `minimum_threshold`, `unit`, `dosage`, `expiry_date`, `storage_location`, `unit_price`) VALUES
('Amoxicillin 500mg', 'Amoxicillin Trihydrate', 'antibiotic', 140, 30, 'Capsules', '500mg - 3 jeer maalintii', DATE_ADD(CURDATE(), INTERVAL 14 MONTH), 'Khaanadda A-02', 4.50),
('Paracetamol Syrup 120mg/5ml', 'Acetaminophen', 'pediatric', 85, 20, 'Bottles', '5ml marka qandho timaado', DATE_ADD(CURDATE(), INTERVAL 18 MONTH), 'Khaanadda C-01', 2.00),
('Iron & Folic Acid Tablets', 'Ferrous Fumarate + Folic Acid', 'maternal', 320, 50, 'Tablets', '1 kiniin maalin kasta', DATE_ADD(CURDATE(), INTERVAL 24 MONTH), 'Khaanadda M-01', 1.50),
('ORS (Oral Rehydration Salts)', 'WHO Rehydration Formula', 'pediatric', 450, 100, 'Sachets', '1 baakad lagu qaso 1L biyo', DATE_ADD(CURDATE(), INTERVAL 20 MONTH), 'Khaanadda P-04', 0.50),
('Normal Saline IV 0.9% 500ml', 'Sodium Chloride Injection', 'emergency_iv', 95, 25, 'Bags', 'IV Drip', DATE_ADD(CURDATE(), INTERVAL 16 MONTH), 'Qaybta Degdegga IV-01', 3.00);

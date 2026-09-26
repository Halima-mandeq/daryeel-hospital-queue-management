# DaryeelQoys Hospital Queue & Clinical Management System — Laravel 11 Backend

This backend service powers the **DaryeelQoys Clinic Triage & Smart Queue Management System**, built using **Laravel 11**, **MySQL 8.0+**, and **Laravel Sanctum Authentication**.

---

## 🚀 Setup & Installation Instructions

### Prerequisites
* **PHP** >= 8.2 with extensions: `pdo_mysql`, `mbstring`, `openssl`, `curl`, `xml`, `bcmath`
* **Composer** (PHP Package Manager)
* **MySQL Server** >= 8.0 (via XAMPP, WAMP, Laragon, or Docker)

---

### Step 1: Navigate to the Backend Directory
Open your terminal and enter the backend directory:
```bash
cd backend-laravel
```

### Step 2: Install PHP Dependencies
```bash
composer install
```

### Step 3: Configure the Environment File
Create a copy of `.env.example`:
```bash
cp .env.example .env
php artisan key:generate
```

### Step 4: Configure the MySQL Database
1. Launch MySQL or open phpMyAdmin (`http://localhost/phpmyadmin`).
2. Create a new database named:
   ```sql
   CREATE DATABASE somali_hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Update database credentials in `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=somali_hospital_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```

### Step 5: Run Migrations & Seeders
You can populate tables and sample records using either method below:

#### Method A: Laravel Artisan (Recommended)
```bash
php artisan migrate --seed
```

#### Method B: Direct SQL Import via phpMyAdmin / CLI
Import the pre-configured SQL file:
```bash
mysql -u root -p somali_hospital_db < database/schema_mysql.sql
```
*(Or import `database/schema_mysql.sql` inside phpMyAdmin)*

---

### Step 6: Start the Laravel API Server
```bash
php artisan serve
```
The API server will run at: **`http://localhost:8000`**

---

## 🔗 Key API Endpoints Reference

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server and database connectivity check |
| `POST` | `/api/auth/login` | Staff and patient authentication |
| `GET` | `/api/queue/live-board` | Active queue state for the waiting room TV screen |
| `GET` | `/api/patients` | List of patients currently in queue |
| `POST` | `/api/patients` | Register new walk-in patient & issue ticket |
| `GET` | `/api/patients/lookup?q=M-14` | Search ticket details by number or phone |
| `POST` | `/api/kiosk/scan-qr` | Validate QR code scanned at entrance kiosk |
| `GET` | `/api/rooms` | Retrieve doctor consultation rooms & availability |
| `POST` | `/api/queue/call-next` | Advance queue and trigger doctor call |
| `POST` | `/api/prescriptions` | Issue new electronic prescription |
| `POST` | `/api/prescriptions/{id}/dispense` | Dispense medications (Pharmacy) |
| `GET` | `/api/pharmacy/inventory` | Retrieve pharmacy inventory and stock levels |

---

## 🔑 Pre-seeded Test Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin (Director)** | `admin@somali-hospital.so` | `Admin123!` |
| **Doctor (Physician)** | `faadumo@somali-hospital.so` | `Doctor123!` |
| **Nurse (Triage)** | `maryan@somali-hospital.so` | `Nurse123!` |
| **Receptionist** | `reception@somali-hospital.so` | `Reception123!` |
| **Pharmacist** | `pharmacy@somali-hospital.so` | `Pharm123!` |

*(Note: The frontend demo accounts such as `admin.shire@daryeelqoys.so` / `daryeel2026` are also supported in offline mode).*

---

## 🛡️ License
This project is open-source and licensed under the [MIT License](../LICENSE).

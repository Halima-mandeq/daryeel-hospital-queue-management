<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\DoctorRoom;
use App\Models\Patient;
use App\Models\PharmacyItem;
use App\Models\MaternalRecord;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Hospital Staff Users
        $users = [
            [
                'custom_id' => 'u-admin',
                'name' => 'Agaasime Cabdiraxmaan Xasan',
                'email' => 'admin@somali-hospital.so',
                'password' => Hash::make('Admin123!'),
                'role' => 'admin',
                'title' => 'Agaasimaha Guud ee Isbitaalka',
                'department' => 'Maamulka Guud',
                'phone' => '+252 61 555 0100',
                'avatar' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
            ],
            [
                'custom_id' => 'u-doc-1',
                'name' => 'Dr. Faadumo Cali Cumar',
                'email' => 'faadumo@somali-hospital.so',
                'password' => Hash::make('Doctor123!'),
                'role' => 'doctor',
                'title' => 'Agaasimaha Qaybta Hooyada & Dhallaanka',
                'department' => 'Daryeelka Hooyada & Dhallaanka',
                'specialty' => 'Maternal & Child Health',
                'assigned_room_id' => 'room-1',
                'phone' => '+252 61 555 0101',
                'avatar' => 'https://images.unsplash.com/photo-1594824813589-354316d5fb9d?auto=format&fit=crop&q=80&w=200',
            ],
            [
                'custom_id' => 'u-doc-2',
                'name' => 'Dr. Axmed Maxamed Warsame',
                'email' => 'axmed@somali-hospital.so',
                'password' => Hash::make('Doctor123!'),
                'role' => 'doctor',
                'title' => 'Takhasuska Daawada Guud',
                'department' => 'Daawada Guud (General Medicine)',
                'specialty' => 'General Medicine',
                'assigned_room_id' => 'room-2',
                'phone' => '+252 61 555 0102',
                'avatar' => 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
            ],
            [
                'custom_id' => 'u-nurse-1',
                'name' => 'Kalkaaliso Maryan Yuusuf',
                'email' => 'maryan@somali-hospital.so',
                'password' => Hash::make('Nurse123!'),
                'role' => 'nurse',
                'title' => 'Madaxa Kalkaalada Triage-ka',
                'department' => 'Qaybta Triage & Degdegga',
                'phone' => '+252 61 555 0103',
                'avatar' => 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=200',
            ],
            [
                'custom_id' => 'u-rec-1',
                'name' => 'Soo-dhaweeye Khadar Aadan',
                'email' => 'reception@somali-hospital.so',
                'password' => Hash::make('Reception123!'),
                'role' => 'receptionist',
                'title' => 'Sarkaalka Soo Dhaweynta & Tikidhada',
                'department' => 'Qaybta Soo Dhaweynta & Safka',
                'phone' => '+252 61 555 0104',
                'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
            ],
            [
                'custom_id' => 'u-pharm-1',
                'name' => 'Dawo-bixiye Saynab Cabdi',
                'email' => 'pharmacy@somali-hospital.so',
                'password' => Hash::make('Pharm123!'),
                'role' => 'pharmacist',
                'title' => 'Madaxa Farmashiyaha Guud',
                'department' => 'Farmashiyaha Isbitaalka',
                'phone' => '+252 61 555 0105',
                'avatar' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
            ],
        ];

        foreach ($users as $u) {
            User::updateOrCreate(['email' => $u['email']], $u);
        }

        // 2. Seed Doctor Consultation Rooms
        $rooms = [
            [
                'room_code' => 'room-1',
                'room_name' => 'Qolka 1: Daryeelka Hooyada & Dhallaanka',
                'doctor_name' => 'Dr. Faadumo Cali Cumar',
                'title' => 'Agaasimaha Qaybta Hooyada & Dhallaanka',
                'specialty' => 'Maternal & Child Health',
                'is_available' => true,
                'current_patient_id' => 'M-14',
            ],
            [
                'room_code' => 'room-2',
                'room_name' => 'Qolka 2: Daawada Guud & Baaritaanka',
                'doctor_name' => 'Dr. Axmed Maxamed Warsame',
                'title' => 'Takhasuska Daawada Guud',
                'specialty' => 'General Medicine',
                'is_available' => true,
                'current_patient_id' => null,
            ],
            [
                'room_code' => 'room-3',
                'room_name' => 'Qolka 3: Qalliinka & Dhaawacyada Degdegga ah',
                'doctor_name' => 'Dr. Xasan Nuur Ciise',
                'title' => 'Qalliinka Guud',
                'specialty' => 'General Surgery & Trauma',
                'is_available' => true,
                'current_patient_id' => 'E-01',
            ],
            [
                'room_code' => 'room-4',
                'room_name' => 'Qolka 4: Cudurrada Carruurta (Pediatrics)',
                'doctor_name' => 'Dr. Leyla Cabdullaahi',
                'title' => 'Takhasuska Cudurrada Carruurta',
                'specialty' => 'Pediatrics',
                'is_available' => true,
                'current_patient_id' => null,
            ],
        ];

        foreach ($rooms as $r) {
            DoctorRoom::updateOrCreate(['room_code' => $r['room_code']], $r);
        }

        // 3. Seed Patients
        $patients = [
            [
                'ticket_number' => 'E-01',
                'full_name' => 'Sharmaarke Cabdullaahi',
                'phone' => '+252 61 555 7711',
                'age' => 34,
                'gender' => 'male',
                'category' => 'emergency',
                'symptoms' => 'Dhaawac degdeg ah iyo neefsasho adag (Severe trauma & respiratory distress)',
                'triage_level' => 'emergency',
                'triage_score' => 1,
                'vitals' => [
                    'temperature' => 38.5,
                    'bloodPressure' => '85/55',
                    'heartRate' => 128,
                    'spO2' => 88,
                ],
                'status' => 'called',
                'assigned_room_id' => 'room-3',
                'assigned_doctor_name' => 'Dr. Xasan Nuur Ciise',
                'registered_at' => Carbon::now()->subMinutes(12),
                'called_at' => Carbon::now()->subMinutes(2),
                'estimated_wait_minutes' => 0,
            ],
            [
                'ticket_number' => 'M-14',
                'full_name' => 'Xaliimo Cabdi Faarax',
                'phone' => '+252 61 555 9922',
                'age' => 26,
                'gender' => 'female',
                'category' => 'maternal',
                'pregnancy_week' => 32,
                'symptoms' => 'Dhabar xanuun daran & cadaadis dhiig oo kordhay (Preeclampsia warning)',
                'triage_level' => 'urgent',
                'triage_score' => 2,
                'vitals' => [
                    'temperature' => 37.1,
                    'bloodPressure' => '145/95',
                    'heartRate' => 88,
                    'spO2' => 97,
                ],
                'status' => 'called',
                'assigned_room_id' => 'room-1',
                'assigned_doctor_name' => 'Dr. Faadumo Cali Cumar',
                'registered_at' => Carbon::now()->subMinutes(25),
                'called_at' => Carbon::now()->subMinutes(5),
                'estimated_wait_minutes' => 0,
            ],
            [
                'ticket_number' => 'P-08',
                'full_name' => 'Yuusuf Maxamed (Dhallaanka)',
                'phone' => '+252 61 555 3344',
                'age' => 2,
                'gender' => 'male',
                'category' => 'child',
                'symptoms' => 'Qandho sare & shuban biyood (High fever & acute diarrhea)',
                'triage_level' => 'urgent',
                'triage_score' => 2,
                'vitals' => [
                    'temperature' => 39.2,
                    'bloodPressure' => '90/60',
                    'heartRate' => 135,
                    'spO2' => 95,
                ],
                'status' => 'waiting',
                'assigned_room_id' => 'room-4',
                'assigned_doctor_name' => 'Dr. Leyla Cabdullaahi',
                'registered_at' => Carbon::now()->subMinutes(18),
                'estimated_wait_minutes' => 8,
            ],
            [
                'ticket_number' => 'R-33',
                'full_name' => 'Cali Jaamac Geedi',
                'phone' => '+252 61 555 4488',
                'age' => 45,
                'gender' => 'male',
                'category' => 'adult',
                'symptoms' => 'Madax xanuun daba dheeraaday & qufac fudud',
                'triage_level' => 'routine',
                'triage_score' => 3,
                'vitals' => [
                    'temperature' => 36.6,
                    'bloodPressure' => '120/80',
                    'heartRate' => 72,
                    'spO2' => 99,
                ],
                'status' => 'waiting',
                'assigned_room_id' => 'room-2',
                'assigned_doctor_name' => 'Dr. Axmed Maxamed Warsame',
                'registered_at' => Carbon::now()->subMinutes(40),
                'estimated_wait_minutes' => 20,
            ],
        ];

        foreach ($patients as $p) {
            Patient::updateOrCreate(['ticket_number' => $p['ticket_number']], $p);
        }

        // 4. Seed Pharmacy Inventory
        $medicines = [
            [
                'name' => 'Amoxicillin 500mg',
                'generic_name' => 'Amoxicillin Trihydrate',
                'category' => 'antibiotic',
                'stock' => 140,
                'minimum_threshold' => 30,
                'unit' => 'Capsules',
                'dosage' => '500mg - 3 jeer maalintii',
                'expiry_date' => Carbon::now()->addMonths(14),
                'storage_location' => 'Khaanadda A-02',
                'unit_price' => 4.50,
            ],
            [
                'name' => 'Paracetamol Syrup 120mg/5ml',
                'generic_name' => 'Acetaminophen',
                'category' => 'pediatric',
                'stock' => 85,
                'minimum_threshold' => 20,
                'unit' => 'Bottles',
                'dosage' => '5ml marka qandho timaado',
                'expiry_date' => Carbon::now()->addMonths(18),
                'storage_location' => 'Khaanadda C-01',
                'unit_price' => 2.00,
            ],
            [
                'name' => 'Iron & Folic Acid Tablets',
                'generic_name' => 'Ferrous Fumarate + Folic Acid',
                'category' => 'maternal',
                'stock' => 320,
                'minimum_threshold' => 50,
                'unit' => 'Tablets',
                'dosage' => '1 kiniin maalin kasta (Hooyada Uurka)',
                'expiry_date' => Carbon::now()->addMonths(24),
                'storage_location' => 'Khaanadda M-01',
                'unit_price' => 1.50,
            ],
            [
                'name' => 'ORS (Oral Rehydration Salts)',
                'generic_name' => 'WHO Rehydration Formula',
                'category' => 'pediatric',
                'stock' => 450,
                'minimum_threshold' => 100,
                'unit' => 'Sachets',
                'dosage' => '1 baakad lagu qaso 1L biyo nadiif ah',
                'expiry_date' => Carbon::now()->addMonths(20),
                'storage_location' => 'Khaanadda P-04',
                'unit_price' => 0.50,
            ],
            [
                'name' => 'Normal Saline IV 0.9% 500ml',
                'generic_name' => 'Sodium Chloride Injection',
                'category' => 'emergency_iv',
                'stock' => 95,
                'minimum_threshold' => 25,
                'unit' => 'Bags',
                'dosage' => 'IV Drip (Sida dhakhtarku amro)',
                'expiry_date' => Carbon::now()->addMonths(16),
                'storage_location' => 'Qaybta Degdegga IV-01',
                'unit_price' => 3.00,
            ],
        ];

        foreach ($medicines as $m) {
            PharmacyItem::updateOrCreate(['name' => $m['name']], $m);
        }
    }
}

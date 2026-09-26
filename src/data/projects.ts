export interface ProjectItem {
  id: string;
  number: string;
  titleSo: string;
  titleEn: string;
  taglineSo: string;
  taglineEn: string;
  category: 'health' | 'water' | 'agri' | 'fintech' | 'emergency' | 'housing' | 'education' | 'jobs' | 'waste' | 'logistics';
  categoryLabelSo: string;
  categoryLabelEn: string;
  badgeColor: string;
  iconName: string;
  difficulty: string;
  timeToMVP: string;
  marketPotential: string;
  problemSo: string;
  problemEn: string;
  solutionSo: string;
  solutionEn: string;
  targetAudienceSo: string[];
  targetAudienceEn: string[];
  coreFeaturesSo: string[];
  coreFeaturesEn: string[];
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    apis: string[];
  };
  monetizationSo: string;
  monetizationEn: string;
  whyBuildThisSo: string;
  whyBuildThisEn: string;
  databaseSchema: string;
  starterRoadmapSo: { week: string; task: string }[];
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'daryeel-qoys',
    number: '01',
    titleSo: 'DaryeelQoys',
    titleEn: 'CareFamily Triage',
    taglineSo: 'Nidaamka Safafka Isbitaalka, Ballamaha Hooyada & Dhallaanka iyo Triage Degdeg ah',
    taglineEn: 'Maternal & Child Health Clinic Queuing, Smart Triage & SMS Follow-up',
    category: 'health',
    categoryLabelSo: 'Caafimaadka (HealthTech)',
    categoryLabelEn: 'Healthcare',
    badgeColor: 'emerald',
    iconName: 'HeartPulse',
    difficulty: 'Dhexe (Intermediate)',
    timeToMVP: '2 - 3 Toddobaad',
    marketPotential: 'Aad u Sareysa (Xarumaha MCH & Isbitaallada Gaarka ah)',
    problemSo: 'Xarumaha caafimaadka iyo kuwa hooyada iyo dhallaanka (MCH) waxaa ka jira safaf aad u dhaadheer oo saacado badan qata. Hooyooyinka uurka leh iyo carruurta xanuunsan ma helaan nidaam kala sooca xaaladaha degdegga ah (triage), taasoo keenta in bukaanno halis ku jira ay safka dhexdiisa ku dhibtoodaan. Sidoo kale ma jiro nidaam otomaatig ah oo xusuusiya xilliga tallaalka xiga.',
    problemEn: 'Maternal and child clinics face debilitating 4-6 hour waiting queues with zero triage priority scoring. Critical cases wait in line behind routine visits, leading to preventable maternal emergencies. Furthermore, over 40% of infant vaccination appointments are missed due to a complete lack of digital reminder systems.',
    solutionSo: 'Web application fudud oo kalkaalisada u sahlaya inay bukaanka ku diiwaangeliso triage score (Cas: Degdeg, Jaalle: Dhexdhexaad, Cagaar: Caadi). Bukaanku waxay safka kaga socon karaan telefoonkooda, waxayna helayaan fariin SMS ah marka lambarkoodu soo dhowaado iyo xusuusinta tallaalka carruurta.',
    solutionEn: 'A high-speed clinic queue and clinical triage portal that auto-scores incoming patients into urgent, moderate, and routine tiers. Integrates an SMS token dispenser so patients can wait comfortably, plus automated WhatsApp/SMS vaccination schedule reminders.',
    targetAudienceSo: ['Xarumaha Caafimaadka MCH', 'Isbitaallada Gaarka ah & kuwa Dadweynaha', 'Hooyooyinka & Qoysaska'],
    targetAudienceEn: ['MCH Health Centers', 'Private & Public Hospitals', 'Mothers & Primary Caregivers'],
    coreFeaturesSo: [
      'Shaashad Triage degdeg ah oo kalkaalisadu 10 ilbiriqsi ku kala soocdo bukaanka',
      'Nidaamka lambarrada safka oo toos ah (Live Queue Board) & SMS ogeysiis ah',
      'Jadwalka tallaallada ilmaha iyo fariimo otomaatig ah oo hooyada u dhaca',
      'Warbixinaha tirada bukaanada maalin kasta iyo waqtiga celcelis ahaan ay sugaan'
    ],
    coreFeaturesEn: [
      '10-second rapid clinical triage scoring engine for triage nurses',
      'Real-time live queue status board with automated SMS ticket countdown',
      'Child immunization calendar with recurring multi-channel SMS reminders',
      'Daily clinic efficiency analytics, wait time monitoring and audit trail'
    ],
    techStack: {
      frontend: ['React 19', 'Tailwind CSS', 'Lucide Icons'],
      backend: ['Node.js / Express', 'RESTful Endpoints'],
      database: ['PostgreSQL / SQLite', 'Prisma ORM'],
      apis: ['Africa\'s Talking / Twilio SMS API', 'WebSockets for Live Queue']
    },
    monetizationSo: 'Isbitaallada waxaa laga qaadayaa lacag bil ah (SaaS Subscription: $30-$80 bishii xarun kasta) oo ay ku jirto dirista fariimaha SMS-ka.',
    monetizationEn: 'B2B SaaS subscription charged per clinic ($30–$80/month) including custom SMS branding and patient quota.',
    whyBuildThisSo: 'Mashaariicda caafimaadku waxay leeyihiin qiimo bani\'aadamnimo oo dhab ah, waxaana si toos ah u iibsan kara xarumaha caafimaadka ee raba inay adeegooda casriyeeyaan.',
    whyBuildThisEn: 'Solves an immediate life-saving problem with direct commercial demand from private clinics seeking efficiency.',
    databaseSchema: `CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  emergency_level VARCHAR(20) DEFAULT 'green', -- green, yellow, red
  symptoms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE queue_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  ticket_number INT NOT NULL,
  status VARCHAR(20) DEFAULT 'waiting', -- waiting, serving, completed, cancelled
  estimated_wait_mins INT DEFAULT 15,
  called_at TIMESTAMP WITH TIME ZONE
);`,
    starterRoadmapSo: [
      { week: 'Toddobaadka 1', task: 'Samee diiwaangelinta bukaanada iyo algorithm-ka xisaabiya Triage Priority' },
      { week: 'Toddobaadka 2', task: 'Dhis shaashadda safka tooska ah (Live Queue Screen) iyo lambar bixinta' },
      { week: 'Toddobaadka 3', task: 'Ku xir SMS API (Twilio ama Africa\'s Talking) oo tijaabi fariimaha' },
      { week: 'Toddobaadka 4', task: 'Samee dashboard-ka maamulka isbitaalka iyo xogta tallaallada' }
    ]
  },
  {
    id: 'biyo-kaab',
    number: '02',
    titleSo: 'BiyoKaab',
    titleEn: 'HydroAlert & Well Monitor',
    taglineSo: 'Kormeerka Ceelasha Biyaha, Ogaanshaha Cilladaha & Dirista Farsamo-yaqaanka',
    taglineEn: 'Rural & Urban Water Point Telemetry, Breakdown Alert & Technician Dispatch',
    category: 'water',
    categoryLabelSo: 'Kheyraadka & Biyaha',
    categoryLabelEn: 'Water & Utilities',
    badgeColor: 'sky',
    iconName: 'Droplets',
    difficulty: 'Dhexe (Intermediate)',
    timeToMVP: '3 Toddobaad',
    marketPotential: 'Hay\'adaha Biyaha, Shirkadaha Ceelasha & Dowladda Hoose',
    problemSo: 'Matoorada iyo ceelasha biyaha ee deegaannada iyo baadiyaha marka ay cilladoobaan, waxaa qaadata maalmo ama toddobaadyo in maamulka iyo farsamo-yaqaannadu ogaadaan. Dadweynaha iyo xooluhu waxay wajahaan harraad daran, biyaha baabuurta lagu keeno oo qaaliyooba, iyo khasaare dhaqaale.',
    problemEn: 'When borehole pumps and solar water points break down in peri-urban and pastoral communities, repairs frequently take 2 to 3 weeks due to fragmented communication. Entire communities are left stranded without clean water, forcing reliance on exorbitant water trucking.',
    solutionSo: 'Madal khariidad leh (Interactive Map) oo muujinaysa xaaladda ceel kasta (Shaqaynaya, Khatar, Cilladaysan). Dadweynuhu waxay ku soo diri karaan cabashada SMS/Web, nidaamkuna wuxuu toos ugu dirayaa farsamo-yaqaanka ugu dhow shaqada dayactirka.',
    solutionEn: 'A geospatial water dashboard mapping every borehole and public pump status in real time. Features one-click citizen fault reporting via SMS/Web and auto-dispatches repair work orders to vetted regional water technicians.',
    targetAudienceSo: ['Shirkadaha Biyaha Maamula', 'Wasaaradaha Kheyraadka Biyaha', 'Hay\'adaha Gargaarka (WASH)', 'Bulshada Deegaanka'],
    targetAudienceEn: ['Water Utility Operators', 'Ministry of Water Resources', 'WASH Humanitarian NGOs', 'Local Communities'],
    coreFeaturesSo: [
      'Khariidad toos ah oo ku calaamadeysan xaaladda ceelasha (Cagaar/Huruud/Cas)',
      'Foom fudud oo qofka deegaanku cilladda ceelka kaga soo warbixin karo',
      'System-ka u xilsaaraya farsamo-yaqaanka ugu dhow qoraal SMS ah',
      'Diiwaanka tayada biyaha (salinity/pH) iyo taariikhda dayactirrada'
    ],
    coreFeaturesEn: [
      'Interactive GIS map with live operational status of all water points',
      'Lightweight incident reporting interface with photo and geolocation support',
      'Smart dispatch engine matching closest certified repair technician via SMS',
      'Water quality logbook (salinity, chlorine, volume) and maintenance logs'
    ],
    techStack: {
      frontend: ['React 19', 'Leaflet / MapLibre GL', 'Tailwind CSS'],
      backend: ['Node.js', 'Express', 'GeoJSON APIs'],
      database: ['PostgreSQL + PostGIS', 'Supabase'],
      apis: ['OpenStreetMap Tiles', 'SMS Gateway API']
    },
    monetizationSo: 'Qandaraas ama subscription bil ah oo lala galo hay\'adaha WASH ama shirkadaha biyaha ($150-$500 bishii ee maamulka gobolka).',
    monetizationEn: 'Institutional licensing for NGO water consortia and municipal utilities on an annual contract basis ($150–$500/month).',
    whyBuildThisSo: 'Dhibaatada biyuhu waa midda ugu daran ee gobolka ka jirta, hay\'adaha iyo dowladduna waxay si joogto ah u raadiyaan xal digital ah.',
    whyBuildThisEn: 'High social impact backed by substantial humanitarian/utility funding and clear operational ROI.',
    databaseSchema: `CREATE TABLE water_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  status VARCHAR(20) DEFAULT 'operational', -- operational, degraded, broken
  flow_rate_lpm INT,
  last_inspected TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE breakdown_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  water_point_id UUID REFERENCES water_points(id),
  reported_by_phone VARCHAR(20),
  issue_description TEXT,
  severity VARCHAR(10) DEFAULT 'high',
  assigned_technician_name VARCHAR(100),
  status VARCHAR(20) DEFAULT 'open' -- open, assigned, resolved
);`,
    starterRoadmapSo: [
      { week: 'Toddobaadka 1', task: 'Dhis xogta ceelasha iyo khariidada (Leaflet Map) oo gobollada muujisa' },
      { week: 'Toddobaadka 2', task: 'Samee qaybta cabasho soo diridda dadweynaha iyo diiwaangelinta cilladda' },
      { week: 'Toddobaadka 3', task: 'Dhis module-ka farsamo-yaqaanka loo xilsaaro shaqada iyo SMS-ka' },
      { week: 'Toddobaadka 4', task: 'Kudar shaashadda warbixinta NGO-yada iyo xisaabinta ceelasha shaqeeya' }
    ]
  },
  {
    id: 'beero-xiriir',
    number: '03',
    titleSo: 'BeeroXiriir',
    titleEn: 'AgriMarket Direct',
    taglineSo: 'Suuqa Tooska ah ee Beeralayda, Qiimaha Maalinlaha ah & Baabuurta Dalagga',
    taglineEn: 'Direct Farm-to-Retail Marketplace, Daily Price Transparency & Logistics Pooling',
    category: 'agri',
    categoryLabelSo: 'Beeraha & Ganacsiga',
    categoryLabelEn: 'AgriTech',
    badgeColor: 'amber',
    iconName: 'Sprout',
    difficulty: 'Dhexe (Intermediate)',
    timeToMVP: '2.5 Toddobaad',
    marketPotential: 'Beeralayda Dalka, Hoteellada, Dukaamada & Suuqyada Waaweyn',
    problemSo: 'Beeralayda Afgooye, Balcad, Jowhar, Gabiley iyo meelo kale waxay khudaartooda (yaanyo, basbaas, qaraha, mooska) ku iibiyaan qiimo aad u jaban sababtoo ah dilaaliin ayaa ka dhex faa\'iideysta. Dhanka kale, hoteellada iyo dukaamada magaalada waxay ku iibsadaan qiimo qaali ah, dalag badanina wuu xumaadaa gaadiid la\'aan darteed.',
    problemEn: 'Farmers lose up to 45% of crop value to multiple tiers of middlemen due to lack of real-time wholesale price information. Simultaneously, urban restaurants and markets overpay, while tons of fresh produce spoil at farms due to fragmented transport coordination.',
    solutionSo: 'Madal fudud oo beeraleydu ku qoraan waxa u soo go\'ay (sawir, caddad, goobta), suuqyada waaweynna maalin kasta lagu daabaco qiimaha rasmiga ah. Hoteellada iyo dukaamadu waxay toos uga iibsan karaan beeraleyda, baabuurtana waa la wadaagi karaa (freight pooling).',
    solutionEn: 'A mobile-friendly agri-commerce portal connecting farmers directly with urban grocers and restaurants. Publishes verified daily wholesale commodity prices and enables shared refrigerated truck pooling to slash transport overhead.',
    targetAudienceSo: ['Beeralayda Gobollada', 'Hoteellada & Maqaayadaha Magaalada', 'Dukaamada Khudaarta', 'Gaadiidleyda Xamuulka'],
    targetAudienceEn: ['Regional Farmers & Cooperatives', 'Urban Hotels & Restaurants', 'Supermarkets & Produce Sellers', 'Rural Freight Drivers'],
    coreFeaturesSo: [
      'Boodhka qiimaha maalinlaha ah ee khudaarta (Suuqa Bakaaraha, Hargeysa, Baydhabo)',
      'Xayeysiinta dalagga beerta oo sawir iyo cod lagu dari karo',
      'Iibsasho toos ah oo qandaraas kula gala beeraleyda',
      'Isku xirka gaadiidleyda si hal baabuur loogu soo wada qaado beero dhowr ah'
    ],
    coreFeaturesEn: [
      'Daily verified wholesale price ticker for top produce commodities across major markets',
      'Farmer crop listing portal with voice note and photo upload capabilities',
      'Direct purchase orders and advance harvest pre-ordering',
      'Shared logistics routing to pool partial truckloads between adjacent farms'
    ],
    techStack: {
      frontend: ['React 19', 'Tailwind CSS', 'Lucide Icons'],
      backend: ['Node.js / Express', 'Cloudinary Image CDN'],
      database: ['PostgreSQL / Supabase'],
      apis: ['Daily Price Scraping / Entry Tool', 'WhatsApp Order Sharing API']
    },
    monetizationSo: 'Komiishan yar oo ah 2% ilaa 3% marka dalagga beerta laga iibsado ama lacag xayeysiinta gaarka ah ee gaadiidka.',
    monetizationEn: '2-3% platform transaction fee on completed wholesale orders plus premium featured listings for commercial logistics operators.',
    whyBuildThisSo: 'Dalku wuxuu u baahan yahay isku-filnaansho cunto, dhiirrigelinta beeraleyda waxay kordhisaa wax-soo-saarka gudaha.',
    whyBuildThisEn: 'Direct economic boost to domestic food security; solves tangible supply-chain waste with huge scalability.',
    databaseSchema: `CREATE TABLE crop_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  location_region VARCHAR(80) NOT NULL,
  crop_type VARCHAR(50) NOT NULL, -- tomatoes, watermelon, onions, bananas
  quantity_kg INT NOT NULL,
  price_per_kg NUMERIC(8,2) NOT NULL,
  available_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'available' -- available, reserved, sold
);

CREATE TABLE daily_market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_name VARCHAR(80) NOT NULL,
  crop_type VARCHAR(50) NOT NULL,
  wholesale_price_avg NUMERIC(8,2) NOT NULL,
  price_date DATE NOT NULL
);`,
    starterRoadmapSo: [
      { week: 'Toddobaadka 1', task: 'Dhis qaab-dhismeedka qiimaha maalinlaha ah iyo noocyada khudaarta' },
      { week: 'Toddobaadka 2', task: 'Samee foomka beeraleyda ee fudud oo xitaa moobilka shaashaddiisa ku habboon' },
      { week: 'Toddobaadka 3', task: 'Dhis module-ka hoteellada wax ka dalbanayaan iyo xisaabinta gaadiidka' },
      { week: 'Toddobaadka 4', task: 'Ku dar wadaagista dalabka WhatsApp-ka iyo tijaabi beero dhab ah' }
    ]
  },
  {
    id: 'xisaab-smart',
    number: '04',
    titleSo: 'XisaabSmart',
    titleEn: 'Dukaan Khata & Offline POS',
    taglineSo: 'Diiwaanka Amaahda Macaamiisha, Dakhliga Dukaanka & Fariimaha Xusuusinta EVC/Zaad',
    taglineEn: 'Offline-First Dukaan Bookkeeping, Customer Credit Ledger & Mobile Money SMS Alerts',
    category: 'fintech',
    categoryLabelSo: 'Ganacsiga & Maaliyadda',
    categoryLabelEn: 'FinTech & Retail',
    badgeColor: 'blue',
    iconName: 'Receipt',
    difficulty: 'Bilaaw / Dhexe (Accessible)',
    timeToMVP: '2 Toddobaad',
    marketPotential: 'Boqolaal Kun oo Dukaamo, Farmashiyo & Meherado Yaryar ah',
    problemSo: 'Dukaanleyda xaafadaha iyo meheradaha yaryar waxay amaahda macaamiisha ku qoraan buug qalin lagu duugay. Buuggu wuu lumi karaa, wuu qoyi karaa, waxaana luma boqolaal doolar oo amaah ah. Dukaanluhu ma oga inta qof ee lagu leeyahay, xisaab xidhka maalinlaha ah, iyo faa\'iidada dhabta ah.',
    problemEn: 'Micro-retailers and neighborhood shop owners manage customer credit ("Amaah") on physical paper notebooks. Notebooks are vulnerable to fire, water damage, and unreadable handwriting, leading to thousands of dollars in uncollected debts and zero visibility into true daily profit/loss.',
    solutionSo: 'Web App shaqaynaya xitaa haddii internetku go\'o (Offline-first PWA). Dukaanluhu wuxuu 5 ilbiriqsi ku qorayaa qofka qaatay amaahda, isagoo hal gujin ku diraya fariin SMS/WhatsApp xusuusin ah oo leh lambarka EVC Plus/Zaad ee lacagta loogu soo celinayo.',
    solutionEn: 'An offline-first Progressive Web App (PWA) that syncs automatically when connection returns. Allows shopkeepers to record a credit entry in 5 seconds and send automated WhatsApp/SMS payment reminders with instant mobile money payment links.',
    targetAudienceSo: ['Dukaamada Raashinka & Qudaarta', 'Farmashiyeyaasha', 'Dukaamada Dharka & Qalabka', 'Kawaannada Hilibka'],
    targetAudienceEn: ['Corner Grocery Shops', 'Community Pharmacies', 'Apparel & Hardware Stores', 'Local Meat Vendors'],
    coreFeaturesSo: [
      'Diiwaangelinta amaahda macaamiisha (Qofka, Taariikhda, Qaddarka)',
      'Shaqaynaya Offline adigoo aan internet haysan (Local IndexedDB)',
      'Dirista fariin xusuusin ah oo WhatsApp ama SMS ah hal gujin',
      'Xisaab-xirka dakhliga iyo faa\'iidada maalinta oo shaashad kooban ku cad'
    ],
    coreFeaturesEn: [
      'Digital credit ledger recording customer name, phone, item, and debt history',
      '100% offline-first capability using IndexedDB with automated background cloud sync',
      'One-tap WhatsApp & SMS polite debt collection reminder messages with merchant number',
      'Daily visual dashboard showing total cash collected, outstanding credit, and net margin'
    ],
    techStack: {
      frontend: ['React 19', 'IndexedDB / Dexie.js', 'Tailwind CSS'],
      backend: ['Node.js', 'Express', 'JWT Auth'],
      database: ['SQLite / PostgreSQL for Cloud Backup'],
      apis: ['Web Share API', 'WhatsApp Click-to-Chat URI', 'SMS Gateway']
    },
    monetizationSo: 'Bilaash waxyaabaha aasaasiga ah (Freemium), $5-$10 bishii marka uu rabo backup-ka cloud-ka iyo fariimaha SMS-ka otomaatiga ah.',
    monetizationEn: 'Freemium local usage; premium tier ($5–$10/month) for automatic encrypted cloud backup, multi-device sync, and automated SMS collection.',
    whyBuildThisSo: 'Waa mashruuca ugu fudud ee aad isla markiiba geyn karto dukaamada kuugu dhow xaafadda, isla markaana xallinaya lacag dhab ah oo qofka ka lumaysay.',
    whyBuildThisEn: 'Instant product-market fit with immediate neighborhood distribution and tangible financial value to small merchants.',
    databaseSchema: `CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  total_debt NUMERIC(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE debt_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  type VARCHAR(10) NOT NULL, -- 'credit_given' (amaah) or 'payment_received' (bixiyay)
  amount NUMERIC(10,2) NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    starterRoadmapSo: [
      { week: 'Toddobaadka 1', task: 'Dhis diiwaanka macaamiisha iyo qorista amaahda adoo adeegsanaya IndexedDB' },
      { week: 'Toddobaadka 2', task: 'Samee fariimaha WhatsApp-ka iyo SMS-ka xusuusinta lacag bixinta' },
      { week: 'Toddobaadka 3', task: 'Kudar shaashadda xisaab-xirka maalinlaha ah iyo search-ka degdegga ah' },
      { week: 'Toddobaadka 4', task: 'Samee Cloud sync iyo PWA install button si loogu rakibo moobilka' }
    ]
  },
  {
    id: 'kaalmo-dhiig',
    number: '05',
    titleSo: 'KaalmoDhiig',
    titleEn: 'BloodLink Emergency',
    taglineSo: 'Badbaadinta Nolosha: Isku Xirka Bukaanka Degdegga ah & Deeq-bixiyeyaasha Dhiigga',
    taglineEn: 'Urgent Blood Dispatch, Donor Geo-Matching & Blood Bank Availability',
    category: 'emergency',
    categoryLabelSo: 'Xaaladaha Degdegga ah',
    categoryLabelEn: 'Emergency & Health',
    badgeColor: 'rose',
    iconName: 'Activity',
    difficulty: 'Dhexe (Intermediate)',
    timeToMVP: '2.5 Toddobaad',
    marketPotential: 'Isbitaallada, Hay\'adaha Bisha Cas & Bulshada Rayidka ah',
    problemSo: 'Xilliyada qaraxyada, shilalka baabuurta, iyo dhiig-baxa hooyooyinka dhalaya, waxaa dhacda in isbitaalladu ay dhiig u waayaan daqiiqado gudahood. Dadka ehellada ah waxay ku wareeraan baraha bulshada iyagoo qoraal qora, halka dhiig-bixiyeyaal diyaar ah ay joogaan masaafo 2km u jirta isbitaalka.',
    problemEn: 'During trauma emergencies, caesarean deliveries, and accidents, finding matching rare blood types (e.g. O-, B-, AB-) takes desperate frantic hours across social media. Patients bleed out while willing, compatible volunteer donors are situated merely 2-3 km away.',
    solutionSo: 'Nidaam qaylo-dhaan degdeg ah oo isbitaalku ku daabaco dhiigga loo baahan yahay. Nidaamku wuxuu isla daqiiqadaas SMS iyo wicitaan u dirayaa dadka dhiiggoodu isu galo ee jooga aagga isbitaalka (Geo-radius 5km), isagoo tusaya halka ay tagayaan.',
    solutionEn: 'An emergency blood dispatch system where verified hospitals broadcast an urgent blood requisition. The system matches blood-group compatibility rules and alerts pre-registered volunteer donors within a 5km radius via instant SMS alerts.',
    targetAudienceSo: ['Dhaqaatiirta Qalliinka & Isbitaallada', 'Deeq-bixiyeyaasha Mutadawiciinta ah', 'Bisha Cas / Red Cross', 'Bukaanka & Ehelladooda'],
    targetAudienceEn: ['Surgeons & Emergency Room Staff', 'Volunteer Blood Donors', 'Red Crescent / Blood Banks', 'Patient Families'],
    coreFeaturesSo: [
      'Qaylo-dhaan hal daqiiqo ah oo isbitaalku ku dalbanayo nooca dhiigga (O+, A-, AB+, iwm)',
      'Algorithm xisaabinaya noocyada dhiigga ee isu geli kara (Compatibility Matrix)',
      'SMS degdeg ah oo u dhacaya dadka dhiigga leh ee aagga dhow jooga',
      'Diiwaanka dhiig-bixiyaha oo xisaabinaya 3 bilood ee nasashada dhiig-bixinta'
    ],
    coreFeaturesEn: [
      '60-second emergency blood requisition broadcast module for verified hospitals',
      'Medical blood compatibility matrix logic (universal donors, plasma compatibility)',
      'Geo-targeted SMS dispatch alerting nearby matching volunteers within radius',
      'Donor safety cadence tracker enforcing the mandatory 90-day rest interval'
    ],
    techStack: {
      frontend: ['React 19', 'Tailwind CSS', 'Lucide Icons'],
      backend: ['Node.js / Express', 'Blood Compatibility Algorithm'],
      database: ['PostgreSQL / Supabase'],
      apis: ['Bulk SMS Provider API', 'Geolocation Coordinates Math']
    },
    monetizationSo: 'Isbitaallada iyo bangiyada dhiigga ayaa bixinaya adeegga xaqiijinta iyo nidaamka degdegga ah ($50-$100 bishii), ama taageero dawli ah.',
    monetizationEn: 'Institutional subscriptions paid by hospitals and private blood testing laboratories for rapid emergency donor logistics.',
    whyBuildThisSo: 'Waa mashruuc toos u badbaadinaya naf qof bani\'aadam ah, caan ka noqon kara dalka, qof kastaana uu ku faani doono inuu isticmaalo.',
    whyBuildThisEn: 'Directly saves human lives in catastrophic moments; immense viral adoption and community goodwill.',
    databaseSchema: `CREATE TABLE donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  blood_group VARCHAR(5) NOT NULL, -- O+, O-, A+, A-, B+, B-, AB+, AB-
  city VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  last_donation_date DATE,
  is_available BOOLEAN DEFAULT true
);

CREATE TABLE emergency_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_name VARCHAR(100) NOT NULL,
  required_blood_group VARCHAR(5) NOT NULL,
  units_needed INT NOT NULL DEFAULT 2,
  urgency_level VARCHAR(20) DEFAULT 'critical',
  contact_phone VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' -- active, fulfilled, expired
);`,
    starterRoadmapSo: [
      { week: 'Toddobaadka 1', task: 'Dhis diiwaangelinta deeq-bixiyeyaasha dhiigga iyo algorithm-ka blood compatibility' },
      { week: 'Toddobaadka 2', task: 'Samee shaashadda isbitaalka ee dalabka degdegga ah (Emergency Broadcast)' },
      { week: 'Toddobaadka 3', task: 'Ku xir SMS API si farriin loogu diro dadka dhiiggoodu ku habboon yahay' },
      { week: 'Toddobaadka 4', task: 'Samee xaqiijinta aqoonsiga isbitaallada iyo tijaabada guud' }
    ]
  },
  {
    id: 'guri-hel',
    number: '06',
    titleSo: 'GuriHel',
    titleEn: 'FairRent & Verified Estates',
    taglineSo: 'Guryo Kiro ah oo la Xaqiijiyay, Heshiis Digital ah & Ka Hortagga Khiyaanada Dillaaliinta',
    taglineEn: 'Verified Rental Housing, Transparent Broker Ratings & Digital Lease Escrow',
    category: 'housing',
    categoryLabelSo: 'Guryaha & Hantida',
    categoryLabelEn: 'PropTech & Housing',
    badgeColor: 'violet',
    iconName: 'Home',
    difficulty: 'Dhexe / Sare (Feature-Rich)',
    timeToMVP: '3 Toddobaad',
    marketPotential: 'Magaalooyinka Waaweyn (Muqdisho, Hargeysa, Garoowe, Kismaayo)',
    problemSo: 'Qoysaska kireysanaya guryaha waxay dhibaato ba\'an kala kulmaan dillaaliinta: sawirro been abuur ah, dalbashada lacag hordhac ah ka hor intaan guriga la tusin, guri hore loo kireeyay oo dad kale lacag looga qaado, iyo muran joogto ah oo ku saabsan lacagta deebaajiga (deposit) marka guriga laga baxayo.',
    problemEn: 'Tenants face endemic scams by unregulated brokers: fabricated listing photos, extortionate viewing fees charged before showing the property, double-letting, and landlords arbitrarily withholding security deposits without itemized damages.',
    solutionSo: 'Madal lagu xaqiijiyo guryaha kireysan (GPS geotagged + sawirro dhab ah), heshiis digital ah oo labada dhinac ku heshiiyaan, qiimaynta dillaaliinta iyo mulkiilayaasha, iyo diiwaanka deebaajiga si aan qofna loo dulmin.',
    solutionEn: 'A verified property rental marketplace featuring geotagged physical verification badges, standardized digital lease agreements, tenant-landlord escrow deposit tracking, and public broker rating scores.',
    targetAudienceSo: ['Qoysaska & Dhallinyarada Guryaha Kireysanaya', 'Mulkiilayaasha Guryaha', 'Dillaaliinta La Aqoonsan Yahay'],
    targetAudienceEn: ['Tenants & Relocating Families', 'Property Owners & Landlords', 'Licensed Real Estate Brokers'],
    coreFeaturesSo: [
      'Guryo kireysan oo sawirradooda iyo goobtooda GPS-ka la xaqiijiyay (Verified Badge)',
      'Filter heersare ah (Qiimaha kirada, Tirada qolalka, Biyaha & Korontada, Xaafadda)',
      'Heshiis heersare ah oo digital ah (Standard Lease Agreement Generator)',
      'Qiimaynta dillaalka (Reviews & Reputation Score)'
    ],
    coreFeaturesEn: [
      'Field-verified listing badges with genuine room photos and verified coordinate metadata',
      'Granular search filters (rent budget, bedrooms, 24/7 electricity/water, neighborhood)',
      'Standardized digital lease agreement generator with printable PDF output',
      'Transparent broker and landlord reputation reviews from former tenants'
    ],
    techStack: {
      frontend: ['React 19', 'Tailwind CSS', 'Leaflet Maps'],
      backend: ['Node.js', 'Express', 'PDFKit for Lease Contracts'],
      database: ['PostgreSQL / Prisma'],
      apis: ['Cloudinary Image Verification', 'SMS Alerts for Bookings']
    },
    monetizationSo: 'Lacag yar oo xaqiijinta guriga ah ($10 halkii guri oo mulkiiluhu bixiyo) iyo khidmad heshiiska digital-ka ah.',
    monetizationEn: 'Property verification fee ($10 per listing paid by landlord/broker) and transaction fee on digital lease signing.',
    whyBuildThisSo: 'Magaalooyinka dhismuhu aad buu ugu kordhayaa, dadkuna waxay diyaar u yihiin inay bixiyaan lacag haddii ay helayaan ammaan iyo hufnaan.',
    whyBuildThisEn: 'Rapid urban expansion creates continuous rental turnover; trust and transparency command direct willingness to pay.',
    databaseSchema: `CREATE TABLE rental_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(120) NOT NULL,
  district VARCHAR(80) NOT NULL,
  city VARCHAR(50) NOT NULL,
  monthly_rent_usd NUMERIC(8,2) NOT NULL,
  deposit_usd NUMERIC(8,2) NOT NULL,
  bedrooms INT NOT NULL,
  bathrooms INT NOT NULL,
  water_availability VARCHAR(50), -- 24/7, borehole, trucking
  electricity_type VARCHAR(50), -- city power, solar hybrid
  is_verified BOOLEAN DEFAULT false,
  landlord_phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    starterRoadmapSo: [
      { week: 'Toddobaadka 1', task: 'Dhis database-ka guryaha iyo shaashadda daalacashada leh filter-ka casriga ah' },
      { week: 'Toddobaadka 2', task: 'Samee foomka soo gelinta guriga iyo qaabka sawirrada loo xaqiijiyo' },
      { week: 'Toddobaadka 3', task: 'Dhis matoorka soo saara heshiiska kirada (Digital Lease Generator)' },
      { week: 'Toddobaadka 4', task: 'Kudar nidaamka qiimaynta dillaaliinta iyo feedback-ka kireystayaasha' }
    ]
  },
  {
    id: 'iskuul-kaab',
    number: '07',
    titleSo: 'IskuulKaab',
    titleEn: 'EduLite Low-Data Revision',
    taglineSo: 'U Diyaargaroowga Imtixaanaadka Shahaadiga ah, Casharro Cod ah & Su\'aalo Interactive ah',
    taglineEn: 'Ultra-Low Data National Exam Prep, Audio Lecture Streaming & Interactive Quizzes',
    category: 'education',
    categoryLabelSo: 'Waxbarashada (EdTech)',
    categoryLabelEn: 'Education',
    badgeColor: 'indigo',
    iconName: 'GraduationCap',
    difficulty: 'Bilaaw / Dhexe (Accessible)',
    timeToMVP: '2 Toddobaad',
    marketPotential: 'Boqolaal Kun oo Arday Dugsiyada Sare & Waalidiin ah',
    problemSo: 'Ardayda dugsiyada sare waxay dhibaato ka haysataa helitaanka buugaagta iyo imtixaanaadkii hore ee shahaadiga ah (Form 4 & Grade 8). Video-yada YouTube-ku waxay cunaan internet aad u badan oo ardayda qaarkood aysan awoodin xirmooyinka qaaliga ah, mana jiraan meel ay ku tijaabiyaan fahamkooda su\'aalo toos ah leh sharraxaad.',
    problemEn: 'Students preparing for national secondary school exams lack organized revision archives. Streaming heavy video lessons exhausts expensive mobile data quotas, and static PDFs offer zero interactive feedback, leaving students unprepared for actual exam conditions.',
    solutionSo: 'Madal waxbarasho oo ku shaqaynaysa xog aad u yar (Low-bandwidth). Waxay leedahay casharro cod ah (audio lectures) oo qaadanaya wax ka yar 3MB halkii cashar, imtixaanaadkii hore oo interactive ah oo isla markiiba natiijada iyo sharraxaadda qaladka bixinaya, iyo qoraallo kooban.',
    solutionEn: 'A high-compression, low-bandwidth exam revision platform featuring bite-sized audio masterclasses (<3MB each), past national exam interactive mock drills with immediate error breakdowns, and downloadable study summaries.',
    targetAudienceSo: ['Ardayda Dugsiyada Sare (Form 4)', 'Macallimiinta & Dugsiyada Gaarka ah', 'Waalidiinta doonaya natiijo fiican'],
    targetAudienceEn: ['High School Students (Form 4)', 'Secondary School Teachers', 'Parents seeking quality revision'],
    coreFeaturesSo: [
      'Su\'aalihii imtixaanaadka shahaadiga ee 5-tii sano ee u dambeysay oo interactive ah',
      'Sharraxaad degdeg ah marka ardaygu su\'aasha saxo ama qaldho',
      'Casharro cod ah (Audio Lessons) oo aad u xog yar (Low Data Mode)',
      'Boodhka guusha ardayga (Progress Tracker) iyo imtixaan tijaabo ah oo waqti leh'
    ],
    coreFeaturesEn: [
      'Interactive past 5 years national exam papers with timed exam simulator mode',
      'Instant granular explanation for every correct and incorrect answer',
      'Ultra-compressed streaming audio lessons optimized for 3G/2G mobile data',
      'Subject mastery dashboard with weak-topic remediation recommendations'
    ],
    techStack: {
      frontend: ['React 19', 'Tailwind CSS', 'Web Audio API'],
      backend: ['Node.js', 'Express', 'JSON Quiz Engine'],
      database: ['SQLite / PostgreSQL'],
      apis: ['Service Worker Offline Cache', 'PDF Certificate Generator']
    },
    monetizationSo: 'Diiwaangelinta imtixaanka tijaabada ah ($2-$5 halkii arday xilliga imtixaanka) ama heshiis lala galo iskuullada gaarka ah.',
    monetizationEn: 'Micro-payments ($2–$5 one-time revision pass during exam season) or school-wide site licenses for private institutions.',
    whyBuildThisSo: 'Arday kasta iyo waalid kastaa waxay rabaan inay baasaan imtixaanka, internetka oo yarna wuxuu gaarsiinayaa gobol kasta oo dalka ah.',
    whyBuildThisEn: 'Solves the accessibility and affordability crisis in education; massive viral sharing among exam candidates.',
    databaseSchema: `CREATE TABLE exam_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(60) NOT NULL, -- Xisaab, Fiisikis, Kimistari, Taariikh, Soomaali
  grade_level INT NOT NULL DEFAULT 12
);

CREATE TABLE exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES exam_subjects(id),
  year INT NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option CHAR(1) NOT NULL, -- 'A', 'B', 'C', 'D'
  explanation TEXT NOT NULL
);`,
    starterRoadmapSo: [
      { week: 'Toddobaadka 1', task: 'Dhis qaab-dhismeedka su\'aalaha imtixaanka iyo maadooyinka dugsiga sare' },
      { week: 'Toddobaadka 2', task: 'Samee shaashadda imtixaanka interactive-ka ah oo leh waqti (Timer) iyo dhibco' },
      { week: 'Toddobaadka 3', task: 'Kudar qaybta casharrada codka ah (Audio player) iyo qoraallada kooban' },
      { week: 'Toddobaadka 4', task: 'Samee Service Worker offline mode si ardaydu internet la\'aan ugu celceliyaan' }
    ]
  },
  {
    id: 'shaqo-doori',
    number: '08',
    titleSo: 'ShaqoDoori',
    titleEn: 'SkillMatch Blue-Collar Gigs',
    taglineSo: 'Isku Xirka Farsamo-yaqaannada La Hubo (Koronto, Tuubiste, Najaar) & Dadka Shaqada U Baahan',
    taglineEn: 'Verified Blue-Collar Trades Marketplace, Voice Portfolios & Guaranteed Service Calls',
    category: 'jobs',
    categoryLabelSo: 'Shaqooyinka & Farsamada',
    categoryLabelEn: 'Workforce & Trades',
    badgeColor: 'teal',
    iconName: 'Wrench',
    difficulty: 'Dhexe (Intermediate)',
    timeToMVP: '2.5 Toddobaad',
    marketPotential: 'Magaalooyinka Dalka, Qoysaska & Shirkadaha Dhismada',
    problemSo: 'Haddii ay gurigaaga ku cilladoobaan korontada, tuubada biyaha, ama qalabka guriga, way adag tahay inaad hesho qof farsamo-yaqaan ah oo aamin ah, khibrad leh, oo aan lacag badan kaa qaadayn. Dhanka kale, dhallinyaro badan oo baratay korontada iyo farsamada ma helaan suuq ay shaqooyinkooda ku soo bandhigaan.',
    problemEn: 'When emergency home electrical, plumbing, or masonry faults happen, homeowners have no way to verify technician competence, fair pricing, or trustworthiness. Conversely, thousands of certified vocational school graduates sit idle without job visibility.',
    solutionSo: 'Madal fudud oo qofka guriga lihi ku raadin karo farsamo-yaqaan u dhow (tuubiste, koronto-yaqaan, najaar, rinjiile), arkana qiimayntii dadkii hore ugu yeertay, shaqooyinkii uu hore u qabtay oo sawirro ah, iyo qiime go\'an.',
    solutionEn: 'A vetted tradesperson on-demand dispatch network. Homeowners find certified plumbers, electricians, carpenters, and appliance mechanics with customer verification badges, transparent price estimates, and verified reviews.',
    targetAudienceSo: ['Qoysaska & Xafiisyada Magaalada', 'Koronto-yaqaannada & Tuubistayaasha', 'Shirkadaha Dhismada & Dayactirka'],
    targetAudienceEn: ['Homeowners & Office Managers', 'Electricians, Plumbers & Mechanics', 'Construction & Facility Contractors'],
    coreFeaturesSo: [
      'Raadinta farsamo-yaqaanka kuugu dhow xaafadda adoo dooranaya nooca ciladda',
      'Profile-ka farsamo-yaqaanka oo leh sawirrada shaqadiisa hore iyo shahaadada',
      'Qiimaynta xiddigaha (1-5 Stars) iyo faallooyinka dadkii hore u shaqaaleeyay',
      'Badhanka "Wac Hadda" ama "Ballanso Waqti" oo toos ah'
    ],
    coreFeaturesEn: [
      'Neighborhood geolocation lookup for nearest available vetted tradesperson',
      'Trade artisan portfolio profiles with verified credentials and job proof photos',
      'Transparent 5-star customer review rating and dispute mediation logs',
      'One-tap direct calling and scheduled service dispatch calendar'
    ],
    techStack: {
      frontend: ['React 19', 'Tailwind CSS', 'Lucide Icons'],
      backend: ['Node.js / Express', 'Direct Phone Call / WhatsApp Links'],
      database: ['PostgreSQL / Supabase'],
      apis: ['SMS Alert Dispatch API', 'Cloudinary Photo Uploads']
    },
    monetizationSo: 'Komiishan yar halkii shaqo (10% khidmadda) ama xubinimo bil ah oo farsamo-yaqaanku ku helo macaamiil joogto ah ($10/bishii).',
    monetizationEn: '10% dispatch service fee per completed booking or monthly premium artisan profile pass ($10/month).',
    whyBuildThisSo: 'Shaqo abuur toos ah ayuu u yahay dhallinyarada xirfadaha gacanta leh, qoysaskuna maalin kasta waxay u baahan yihiin farsamo.',
    whyBuildThisEn: 'Direct economic empowerment for vocational labor with evergreen, non-cyclical consumer demand.',
    databaseSchema: `CREATE TABLE artisans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  skill_category VARCHAR(50) NOT NULL, -- electrician, plumber, carpenter, mason
  district VARCHAR(60) NOT NULL,
  years_experience INT NOT NULL,
  rating_avg NUMERIC(3,2) DEFAULT 5.00,
  verified_id BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true
);

CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id UUID REFERENCES artisans(id),
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  district VARCHAR(60) NOT NULL,
  issue_summary TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' -- pending, accepted, completed, cancelled
);`,
    starterRoadmapSo: [
      { week: 'Toddobaadka 1', task: 'Dhis diiwaangelinta xirfadlayaasha iyo shaashadda daalacashada xirfadaha' },
      { week: 'Toddobaadka 2', task: 'Samee foomka dalbashada adeegga iyo wacitaanka tooska ah' },
      { week: 'Toddobaadka 3', task: 'Kudar nidaamka xiddigaha qiimaynta (Reviews) iyo sawirrada shaqada' },
      { week: 'Toddobaadka 4', task: 'Kudar SMS ogeysiis ah marka farsamo-yaqaanka shaqo cusub loo soo diro' }
    ]
  },
  {
    id: 'qashin-kaab',
    number: '09',
    titleSo: 'QashinKaab',
    titleEn: 'EcoCollect & Plastic Exchange',
    taglineSo: 'Jadwalka Qaadista Qashinka Xaafadda & Abaalmarinta Kala-soocidda Caagagga',
    taglineEn: 'On-Demand Waste Pickup Scheduling & Plastic Bottle Recycling Reward Wallet',
    category: 'waste',
    categoryLabelSo: 'Deegaanka & Nadaafadda',
    categoryLabelEn: 'CleanTech & Ecology',
    badgeColor: 'emerald',
    iconName: 'Trash2',
    difficulty: 'Dhexe (Intermediate)',
    timeToMVP: '3 Toddobaad',
    marketPotential: 'Shirkadaha Qashinka, Warshadaha Caagga & Dowladda Hoose',
    problemSo: 'Qashinka caagagga ah iyo haraaga guryaha ee buuxiya waddooyinka iyo biyo-mareennada magaalooyinka waxay sababaan daadad marka roobku da\'o iyo cuduro. Dadweynuhu ma haystaan dhiirrigelin (incentive) ay qashinka caagga ah ku kala soocaan, shirkadaha qashinkuna ma yaqaannaan goorta guri kasta qashinkiisu buuxsamo.',
    problemEn: 'Municipal plastic waste chokes drainage channels, sparking flash floods and vector-borne diseases. Households have zero financial incentive to sort recyclables, while private waste trucks burn fuel on blind, unoptimized collection routes.',
    solutionSo: 'Madal qoysasku ku ballansan karaan gaariga qashinka, isla markaana haddii ay dhiibaan jawaan caagag ah oo la soocay waxay helayaan dhibco (Points) ay ku bedelan karaan lacagta mobilka (EVC/Zaad) ama dhimis canshuurta qashinka.',
    solutionEn: 'An eco-tech platform allowing households to schedule waste pickups and earn redeemable mobile money credits for pre-sorted plastic bottles and recyclable aluminum, which are sold in bulk to local recycling plants.',
    targetAudienceSo: ['Qoysaska Xaafadaha', 'Shirkadaha Qashinka Ururiya', 'Warshadaha Dib-u-warshadeynta Caagga'],
    targetAudienceEn: ['Urban Households', 'Municipal Waste Concessionaires', 'Plastic Recycling & Pelletizing Plants'],
    coreFeaturesSo: [
      'Jadwalka imaatinka gaariga qashinka ee xaafadda oo toos ah',
      'Dalbashada qaadista qashinka culus hal gujin',
      'Jeebka dhibcaha (Green Wallet) oo lagu helo lacagta caagagga la dhiibo',
      'Dashboard-ka shirkadda qashinka oo tusaya waddooyinka ugu habboon'
    ],
    coreFeaturesEn: [
      'Neighborhood waste truck arrival schedule and live vehicle tracking notifications',
      'One-tap on-demand bulky waste pickup scheduling',
      'Green reward wallet crediting cash points per kilogram of sorted PET plastics',
      'Fleet logistics dashboard optimizing municipal collection routes'
    ],
    techStack: {
      frontend: ['React 19', 'Tailwind CSS', 'Lucide Icons'],
      backend: ['Node.js', 'Express', 'Points-to-Cash Ledger'],
      database: ['PostgreSQL / Supabase'],
      apis: ['Mobile Money Payout API Mock', 'SMS Pickup Notifications']
    },
    monetizationSo: 'Komiishan laga qaado iibka caagagga loo iibinayo warshadaha dib-u-warshadaynta iyo lacagta software-ka shirkadaha qashinka.',
    monetizationEn: 'Arbitrage margin on bulk sorted plastic sales to recycling factories plus SaaS route-optimization fees to haulers.',
    whyBuildThisSo: 'Magaalooyinka nadiifka ahi waxay fure u yihiin caafimaadka bulshada, mashruucanna wuxuu leeyahay dhiirrigelin dhaqaale oo dhab ah.',
    whyBuildThisEn: 'Solves municipal environmental degradation while putting real cash into household pockets.',
    databaseSchema: `CREATE TABLE recycling_pickups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  district VARCHAR(60) NOT NULL,
  plastic_kg NUMERIC(6,2) DEFAULT 0.00,
  points_earned INT DEFAULT 0,
  pickup_status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, collected, paid
  scheduled_date DATE NOT NULL
);`,
    starterRoadmapSo: [
      { week: 'Toddobaadka 1', task: 'Dhis qaabka qoysku u dalbado qaadista qashinka iyo jadwalka' },
      { week: 'Toddobaadka 2', task: 'Samee xisaabinta dhibcaha caagagga (Points Wallet System)' },
      { week: 'Toddobaadka 3', task: 'Dhis dashboard-ka darawalka iyo shirkadda qashinka ee kormeerka' },
      { week: 'Toddobaadka 4', task: 'Kudar xiriirinta mobile money payout iyo ogeysiisyada' }
    ]
  },
  {
    id: 'dhoof-track',
    number: '10',
    titleSo: 'DhoofTrack',
    titleEn: 'LivestockPassport & Export Quarantine',
    taglineSo: 'Baasaboorka Caafimaadka Xoolaha Dhoofaya, Tallaalka & Xaqiijinta Dekedda ee QR-Code',
    taglineEn: 'Livestock Health Passport, Veterinary Vaccination Ledger & Port Quarantine QR Verifier',
    category: 'logistics',
    categoryLabelSo: 'Dhoofka & Kheyraadka Xoolaha',
    categoryLabelEn: 'Livestock & Trade Logistics',
    badgeColor: 'amber',
    iconName: 'ShieldCheck',
    difficulty: 'Sare (Enterprise Grade)',
    timeToMVP: '3 - 4 Toddobaad',
    marketPotential: 'Ganacsatada Xoolaha Dhoofiya, Wasaaradda Xannaanada Xoolaha & Dekedaha',
    problemSo: 'Dalka waxaa sannad kasta laga dhoofiyaa malaayiin neef oo xoolo ah (ari, lo\' iyo geel). Xilliyada qaar maraakiibta xoolaha waxaa laga soo celiyaa dekedaha dalalka Khaliijka (sida Sacuudiga ama Imaaraatka) sababtoo ah shaki ku saabsan shahaadooyinka tallaalka iyo caafimaadka xoolaha, taasoo keenta khasaare tobanaan milyan oo doolar ah.',
    problemEn: 'Livestock export is the lifeblood of the economy, yet livestock shipments risk catastrophic rejection at Gulf destination ports due to suspect paper vaccination certificates, unverified quarantine logs, and lack of individual animal traceability.',
    solutionSo: 'Nidaam digital ah oo xoolaha lagu siiyo summad QR-Code ah (Digital Animal Passport). Dhakhtarka xoolaha ayaa ku qoraya tallaalladii la siiyay iyo taariikhda karantiilka. Saraakiisha dekedda waxay hal ilbiriqsi ku scan-gareyn karaan koodhka si ay u arkaan taariikhda caafimaadka oo buuxda.',
    solutionEn: 'A digital animal health passport system assigning batch and ear-tag QR codes to exported livestock herds. Certified vets log vaccination dates and quarantine laboratory blood titers, allowing border and port inspectors to verify authenticity instantly on mobile.',
    targetAudienceSo: ['Ganacsatada Xoolaha Dhoofisa', 'Dhakhaatiirta Xoolaha ee Dawladda & Gaarka ah', 'Maamulka Dekedaha & Karantiilka'],
    targetAudienceEn: ['Livestock Export Consortia', 'Veterinary Quarantine Officers', 'Port Customs & Agricultural Ministries'],
    coreFeaturesSo: [
      'Soo saarista Baasaboorka Digital-ka ah ee xoolaha (Livestock Health Passport)',
      'QR-Code qof kasta scan-garayn karo oo tusaya xaqiijinta tallaalka',
      'Diiwaanka dhakhtarka xoolaha ee rasmiga ah oo leh summad gaar ah',
      'Kormeerka tirada xoolaha ku jira karantiilka deked kasta (Berbera, Boosaaso, Muqdisho)'
    ],
    coreFeaturesEn: [
      'Digital animal passport generator with verifiable batch vaccination logs',
      'Instant mobile QR code scanner verifying authentic government vet seal',
      'Official vet credential signature and batch audit log',
      'Real-time quarantine station census tracker across major export ports'
    ],
    techStack: {
      frontend: ['React 19', 'Tailwind CSS', 'QR Code Generator / Scanner'],
      backend: ['Node.js / Express', 'Cryptographic Batch Signing'],
      database: ['PostgreSQL / Supabase'],
      apis: ['HTML5 Camera QR Scanner', 'PDF Health Certificate Generator']
    },
    monetizationSo: 'Lacag yar oo lagu bixiyo shahaadada halkii shixnad ama xubinimo ay bixiyaan shirkadaha xoolaha dhoofiya ($200-$1000 sanadkii).',
    monetizationEn: 'Per-batch export certificate verification charge ($10–$25 per consignment) or enterprise port authority license.',
    whyBuildThisSo: 'Xooluhu waa lafdhabarta dhaqaalaha dalka, ilaalinta dhoofkooduna waxay badbaadinaysaa dhaqaalaha qaranka.',
    whyBuildThisEn: 'Directly secures the primary foreign-exchange engine of the country with enterprise-grade fintech/agritech traceability.',
    databaseSchema: `CREATE TABLE livestock_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exporter_name VARCHAR(100) NOT NULL,
  animal_type VARCHAR(40) NOT NULL, -- sheep, goats, cattle, camels
  head_count INT NOT NULL,
  origin_region VARCHAR(60) NOT NULL,
  destination_port VARCHAR(60) NOT NULL,
  quarantine_station VARCHAR(60) NOT NULL,
  quarantine_start_date DATE NOT NULL,
  quarantine_status VARCHAR(20) DEFAULT 'in_quarantine', -- in_quarantine, cleared, rejected
  vet_officer_name VARCHAR(100),
  vaccination_certified BOOLEAN DEFAULT false,
  qr_token VARCHAR(64) UNIQUE NOT NULL
);`,
    starterRoadmapSo: [
      { week: 'Toddobaadka 1', task: 'Dhis qaab-dhismeedka shixnadda xoolaha iyo noocyada cudurrada laga tallaalo' },
      { week: 'Toddobaadka 2', task: 'Samee module-ka dhakhtarka xooluhu ku saxiixo tallaalka iyo baaritaanka' },
      { week: 'Toddobaadka 3', task: 'Kudar matoorka soo saara QR-Code-ka iyo shaashadda scan-ka ee dekedda' },
      { week: 'Toddobaadka 4', task: 'Dhis PDF-ka shahaadada caafimaadka ee rasmiga ah oo la daabacan karo' }
    ]
  }
];
